"""
AI Chatbot Service using RAG (Retrieval-Augmented Generation)
Integrates with existing bus system to provide intelligent route assistance
"""
import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import text, or_

# AI/ML imports (install: pip install langchain chromadb sentence-transformers)
try:
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import Chroma
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.llms import Ollama
    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    print("Warning: LangChain not installed. AI features will be limited.")

from app.models.route import Route
from app.models.schedule import Schedule
from app.models.chatbot import ChatbotMessage, ChatbotSession
from app.core.database import get_db


class AIRouteAssistant:
    """AI-powered route assistant using RAG"""
    
    def __init__(self, db: Session):
        self.db = db
        self.embeddings = None
        self.vectorstore = None
        self.llm = None
        self.qa_chain = None
        
        if LANGCHAIN_AVAILABLE:
            self._initialize_ai()
    
    def _initialize_ai(self):
        """Initialize AI components"""
        try:
            # Initialize embeddings model
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'}
            )
            
            # Initialize Ollama LLM (make sure Ollama is running)
            try:
                self.llm = Ollama(
                    model="llama3",  # or "mistral"
                    temperature=0.7,
                    base_url="http://localhost:11434"  # Default Ollama URL
                )
                print("✓ Ollama LLM initialized")
            except Exception as e:
                print(f"⚠ Ollama not available: {e}")
                print("  Chatbot will use fallback mode (keyword search)")
                self.llm = None
            
            # Load or create vector store
            self._load_vectorstore()
            
            # Create QA chain only if LLM is available
            if self.llm:
                self._create_qa_chain()
            else:
                print("  QA chain not created (Ollama not running)")
            
        except Exception as e:
            print(f"AI initialization error: {e}")
            print("  Chatbot will use fallback mode")
    
    def _load_vectorstore(self):
        """Load or create vector store from route data"""
        persist_directory = "backend/data/chroma_db"
        
        try:
            # Try to load existing vectorstore
            self.vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=self.embeddings
            )
            print("Loaded existing vector store")
        except:
            # Create new vectorstore from database
            print("Creating new vector store from database...")
            self._create_vectorstore_from_db()
    
    def _create_vectorstore_from_db(self):
        """Create vector store from existing route database"""
        # Get all routes
        routes = self.db.query(Route).all()
        
        documents = []
        metadatas = []
        
        print(f"Found {len(routes)} routes in database")
        
        for route in routes:
            # Create rich text representation of route
            route_text = self._create_route_document(route)
            documents.append(route_text)
            
            metadatas.append({
                "route_id": str(route.id),
                "route_number": route.route_number,
                "origin": route.origin,
                "destination": route.destination,
                "distance_km": float(route.distance_km),
                "duration_minutes": route.estimated_duration_minutes
            })
        
        if not documents:
            print("No routes found to create embeddings!")
            return
        
        # Create vectorstore
        print(f"Creating embeddings for {len(documents)} routes...")
        self.vectorstore = Chroma.from_texts(
            texts=documents,
            embedding=self.embeddings,
            metadatas=metadatas,
            persist_directory="backend/data/chroma_db"
        )
        
        self.vectorstore.persist()
        print(f"✓ Created vector store with {len(documents)} routes")
    
    def _create_route_document(self, route: Route) -> str:
        """Create searchable document from route data"""
        doc = f"""
Route Number: {route.route_number}
Origin: {route.origin}
Destination: {route.destination}
Distance: {route.distance_km} kilometers
Estimated Duration: {route.estimated_duration_minutes} minutes
Route Type: Bus Route
Service: PMPML (Pune Mahanagar Parivahan Mahamandal Limited)

This bus route connects {route.origin} to {route.destination}.
The total distance is {route.distance_km} km and takes approximately {route.estimated_duration_minutes} minutes.
Route number {route.route_number} is available for booking.
"""
        return doc.strip()
    
    def _create_qa_chain(self):
        """Create question-answering chain"""
        # Custom prompt template
        template = """You are a helpful PMPML bus route assistant for Pune city. 
Use the following context about bus routes to answer the user's question.
If you don't know the answer, say so politely and suggest checking the route search.

Context: {context}

Question: {question}

Provide a helpful, conversational answer in a friendly tone. Include specific route numbers, 
origins, destinations, and travel times when available. If multiple routes are relevant, 
mention the best options.

Answer:"""

        PROMPT = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )
        
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 5}),
            chain_type_kwargs={"prompt": PROMPT}
        )
    
    async def process_query(
        self, 
        user_id: int, 
        query: str, 
        session_id: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Process user query and return AI response
        
        Args:
            user_id: User ID
            query: User's natural language query
            session_id: Optional chat session ID
            language: Language code (en, hi, mr)
        
        Returns:
            Dict with response, routes, and metadata
        """
        # Create or get chat session
        if not session_id:
            session = ChatbotSession(
                user_id=user_id,
                session_token=f"session_{user_id}_{datetime.utcnow().timestamp()}",
                context={"language": language}
            )
            self.db.add(session)
            self.db.commit()
            session_id = str(session.id)
        
        # Save user message
        user_message = ChatbotMessage(
            session_id=session_id,
            message_type="user",
            message_text=query,
            message_metadata={"language": language}
        )
        self.db.add(user_message)
        self.db.commit()
        
        # Process query
        if LANGCHAIN_AVAILABLE and self.qa_chain:
            response = await self._ai_response(query, language)
        else:
            response = await self._fallback_response(query)
        
        # Save bot response
        bot_message = ChatbotMessage(
            session_id=session_id,
            message_type="bot",
            message_text=response["answer"],
            message_metadata=response.get("metadata")
        )
        self.db.add(bot_message)
        self.db.commit()
        
        return {
            "session_id": session_id,
            "query": query,
            "answer": response["answer"],
            "routes": response.get("routes", []),
            "suggestions": response.get("suggestions", []),
            "language": language
        }
    
    async def _ai_response(self, query: str, language: str) -> Dict[str, Any]:
        """Generate AI response using RAG"""
        try:
            # Check if LLM is available
            if not self.llm or not self.qa_chain:
                print("LLM not available, using fallback")
                return await self._fallback_response(query)
            
            # Get AI response
            result = self.qa_chain({"query": query})
            answer = result["result"]
            
            # Extract relevant routes from vector search
            docs = self.vectorstore.similarity_search(query, k=3)
            routes = []
            
            for doc in docs:
                if doc.metadata:
                    routes.append({
                        "route_number": doc.metadata.get("route_number"),
                        "origin": doc.metadata.get("origin"),
                        "destination": doc.metadata.get("destination"),
                        "distance_km": doc.metadata.get("distance_km"),
                        "duration_minutes": doc.metadata.get("duration_minutes")
                    })
            
            # Generate suggestions
            suggestions = self._generate_suggestions(query, routes)
            
            return {
                "answer": answer,
                "routes": routes,
                "suggestions": suggestions,
                "metadata": {
                    "model": "llama3",
                    "method": "rag"
                }
            }
            
        except Exception as e:
            print(f"AI response error: {e}")
            return await self._fallback_response(query)
    
    async def _fallback_response(self, query: str) -> Dict[str, Any]:
        """Fallback response when AI is not available - optimized for speed"""
        query_lower = query.lower()
        routes = []
        
        # Try vector search first if available (fastest method)
        if self.vectorstore:
            try:
                docs = self.vectorstore.similarity_search(query, k=5)
                for doc in docs:
                    if doc.metadata:
                        routes.append({
                            "route_number": doc.metadata.get("route_number"),
                            "origin": doc.metadata.get("origin"),
                            "destination": doc.metadata.get("destination"),
                            "distance_km": doc.metadata.get("distance_km"),
                            "duration_minutes": doc.metadata.get("duration_minutes")
                        })
                
                if routes:
                    # Generate concise answer
                    if len(routes) == 1:
                        r = routes[0]
                        answer = f"🚌 Found Route {r['route_number']}\n\n"
                        answer += f"📍 {r['origin']} → {r['destination']}\n"
                        answer += f"📏 {r['distance_km']} km • ⏱️ ~{r['duration_minutes']} min\n\n"
                        answer += "Click 'Book' to reserve your seat!"
                    else:
                        answer = f"✅ Found {len(routes)} routes for you:\n\n"
                        for i, r in enumerate(routes[:3], 1):
                            answer += f"{i}. Route {r['route_number']}: {r['origin']} → {r['destination']}\n"
                    
                    return {
                        "answer": answer.strip(),
                        "routes": routes[:5],
                        "suggestions": self._generate_suggestions(query, routes),
                        "metadata": {"method": "vector_search", "response_time": "fast"}
                    }
            except Exception as e:
                print(f"Vector search error: {e}")
        
        # Fast keyword-based search (fallback)
        # Extract location names using simple pattern matching
        locations = []
        
        # Common patterns
        if "from" in query_lower and "to" in query_lower:
            parts = query_lower.split("from")
            if len(parts) > 1:
                rest = parts[1].split("to")
                if len(rest) > 1:
                    origin = rest[0].strip().split()[0]  # First word
                    destination = rest[1].strip().split()[0]  # First word
                    locations = [origin, destination]
        elif "at" in query_lower or "near" in query_lower:
            # Extract location after "at" or "near"
            for word in ["at", "near"]:
                if word in query_lower:
                    parts = query_lower.split(word)
                    if len(parts) > 1:
                        location = parts[1].strip().split()[0]
                        locations = [location]
                        break
        
        # Search by extracted locations
        if locations:
            for location in locations:
                if len(location) > 3:  # Skip very short words
                    results = self.db.query(Route).filter(
                        or_(
                            Route.origin.ilike(f"%{location}%"),
                            Route.destination.ilike(f"%{location}%")
                        )
                    ).limit(5).all()
                    
                    for route in results:
                        route_dict = {
                            "route_number": route.route_number,
                            "origin": route.origin,
                            "destination": route.destination,
                            "distance_km": float(route.distance_km),
                            "duration_minutes": route.estimated_duration_minutes
                        }
                        if route_dict not in routes:
                            routes.append(route_dict)
        
        # If still no results, search all words
        if not routes:
            words = [w for w in query_lower.split() if len(w) > 4]
            for word in words[:3]:  # Check first 3 meaningful words
                results = self.db.query(Route).filter(
                    or_(
                        Route.origin.ilike(f"%{word}%"),
                        Route.destination.ilike(f"%{word}%"),
                        Route.route_number.ilike(f"%{word}%")
                    )
                ).limit(5).all()
                
                for route in results:
                    route_dict = {
                        "route_number": route.route_number,
                        "origin": route.origin,
                        "destination": route.destination,
                        "distance_km": float(route.distance_km),
                        "duration_minutes": route.estimated_duration_minutes
                    }
                    if route_dict not in routes:
                        routes.append(route_dict)
                
                if routes:
                    break
        
        # Generate response
        if routes:
            if len(routes) == 1:
                r = routes[0]
                answer = f"🚌 Route {r['route_number']}\n\n"
                answer += f"📍 {r['origin']} → {r['destination']}\n"
                answer += f"📏 {r['distance_km']} km • ⏱️ ~{r['duration_minutes']} min"
            else:
                answer = f"✅ Found {len(routes)} routes:\n\n"
                for i, r in enumerate(routes[:3], 1):
                    answer += f"{i}. Route {r['route_number']}: {r['origin']} → {r['destination']}\n"
        else:
            answer = "🔍 No routes found. Try:\n\n"
            answer += "• 'Routes from Katraj to Hinjewadi'\n"
            answer += "• 'Buses at Swargate'\n"
            answer += "• 'Route 91U details'"
        
        return {
            "answer": answer.strip(),
            "routes": routes[:5],
            "suggestions": self._generate_suggestions(query, routes) if routes else [
                "Show all routes",
                "Popular destinations",
                "Pass information"
            ],
            "metadata": {"method": "keyword_search", "response_time": "fast"}
        }
    
    def _generate_suggestions(self, query: str, routes: List[Dict]) -> List[str]:
        """Generate follow-up suggestions"""
        suggestions = []
        
        if routes and len(routes) > 0:
            # Suggest related queries based on first route
            r = routes[0]
            suggestions.append(f"Alternative routes to {r['destination']}")
            if len(routes) > 1:
                suggestions.append(f"Compare with Route {routes[1]['route_number']}")
            suggestions.append("Check pass prices")
        else:
            suggestions.append("Show popular routes")
            suggestions.append("Routes from Pune Station")
            suggestions.append("Bus pass information")
        
        return suggestions[:3]
    
    def refresh_embeddings(self):
        """Refresh vector store with latest route data"""
        if LANGCHAIN_AVAILABLE:
            print("Refreshing embeddings...")
            self._create_vectorstore_from_db()
            self._create_qa_chain()
            print("Embeddings refreshed successfully")
        else:
            print("LangChain not available. Cannot refresh embeddings.")


class ChatbotService:
    """Service for chatbot operations"""
    
    @staticmethod
    async def send_message(
        db: Session,
        user_id: int,
        message: str,
        session_id: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Send message to chatbot and get response"""
        assistant = AIRouteAssistant(db)
        response = await assistant.process_query(
            user_id=user_id,
            query=message,
            session_id=session_id,
            language=language
        )
        return response
    
    @staticmethod
    def get_chat_history(
        db: Session,
        user_id: int,
        session_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        messages = db.query(ChatbotMessage).filter(
            ChatbotMessage.session_id == session_id
        ).order_by(ChatbotMessage.created_at.asc()).limit(limit).all()
        
        return [
            {
                "id": str(msg.id),
                "message": msg.message_text,
                "is_bot": msg.message_type == "bot",
                "created_at": msg.created_at.isoformat(),
                "metadata": msg.message_metadata
            }
            for msg in messages
        ]
    
    @staticmethod
    def get_user_sessions(
        db: Session,
        user_id: int,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get user's chat sessions"""
        sessions = db.query(ChatbotSession).filter(
            ChatbotSession.user_id == user_id
        ).order_by(ChatbotSession.created_at.desc()).limit(limit).all()
        
        return [
            {
                "id": str(session.id),
                "session_token": session.session_token,
                "created_at": session.created_at.isoformat(),
                "is_active": session.is_active
            }
            for session in sessions
        ]
    
    @staticmethod
    def create_session(
        db: Session,
        user_id: int,
        language: str = "en"
    ) -> str:
        """Create new chat session"""
        session = ChatbotSession(
            user_id=user_id,
            session_token=f"session_{user_id}_{datetime.utcnow().timestamp()}",
            context={"language": language}
        )
        db.add(session)
        db.commit()
        return str(session.id)
