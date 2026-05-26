import { Link } from 'react-router-dom'
import { Ticket, CreditCard, QrCode, Clock, Shield, MapPin, Bot, Bus, Zap, ChevronRight, Star } from 'lucide-react'

const FEATURES = [
  { icon: Ticket, color: 'bg-blue-100 text-blue-600', title: 'Easy Booking', desc: 'Book tickets in seconds with our 3-step flow. Select route, pick a time, confirm.' },
  { icon: CreditCard, color: 'bg-green-100 text-green-600', title: 'Digital Passes', desc: '18 PMPML pass types — daily, monthly, student, senior citizen, and more.' },
  { icon: QrCode, color: 'bg-purple-100 text-purple-600', title: 'Instant QR Tickets', desc: 'Get a QR code immediately after booking. Show to conductor and board.' },
  { icon: Bot, color: 'bg-orange-100 text-orange-600', title: 'AI Route Assistant', desc: 'Ask in plain English — "Buses from Katraj to Hinjewadi" — and get instant answers.' },
  { icon: Clock, color: 'bg-red-100 text-red-600', title: 'Real-time Schedules', desc: 'PMPML schedules from 5:00 AM to 11:30 PM. Peak hour frequency every 5–15 mins.' },
  { icon: Shield, color: 'bg-teal-100 text-teal-600', title: 'Secure & Reliable', desc: 'JWT-secured accounts, encrypted QR codes with fraud detection.' },
]

const STEPS = [
  { n: '01', title: 'Create Account', desc: 'Sign up free in under a minute with your email.' },
  { n: '02', title: 'Find Your Route', desc: 'Search 1030+ PMPML routes or ask the AI assistant.' },
  { n: '03', title: 'Book & Get QR', desc: 'Confirm booking and receive your QR ticket instantly.' },
  { n: '04', title: 'Board & Travel', desc: 'Show QR to conductor. No paper tickets needed.' },
]

const PASS_HIGHLIGHTS = [
  { name: 'Daily Pass', price: '₹70', desc: 'PMC + PCMC · Unlimited rides', color: 'border-blue-200 bg-blue-50' },
  { name: 'Monthly Pass', price: '₹1,500', desc: 'PMC + PCMC · 30 days', color: 'border-green-200 bg-green-50' },
  { name: 'Student Monthly', price: '₹750', desc: 'All routes · 50% concession', color: 'border-purple-200 bg-purple-50' },
  { name: 'Senior Citizen', price: '₹40', desc: 'Entire network · Daily', color: 'border-orange-200 bg-orange-50' },
  { name: 'Divyang Pass', price: 'FREE', desc: 'Entire network · Annual', color: 'border-red-200 bg-red-50' },
  { name: 'Regional Monthly', price: '₹2,700', desc: 'PMRDA routes · 30 days', color: 'border-teal-200 bg-teal-50' },
]

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-yellow-300" />
              PMPML Smart Bus Pass System · Pune 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Book Tickets &<br />
              <span className="text-yellow-300">Manage Passes</span><br />
              Digitally
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              1030+ PMPML routes · Instant QR tickets · 18 pass types · AI-powered route finder
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book-ticket"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg">
                <Ticket className="h-5 w-5" /> Book a Ticket
              </Link>
              <Link to="/buy-pass"
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition border border-white/30">
                <CreditCard className="h-5 w-5" /> Buy a Pass
              </Link>
              <Link to="/ai-assistant"
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition shadow-lg">
                <Bot className="h-5 w-5" /> AI Assistant
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { value: '1,030+', label: 'PMPML Routes' },
                { value: '18', label: 'Pass Types' },
                { value: '5 AM–11:30 PM', label: 'Service Hours' },
                { value: 'Free', label: 'AI Assistant' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-blue-200 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              A complete digital transport solution for Pune's PMPML network
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-lg text-gray-500">Get your ticket in under 2 minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {n}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
              Get Started Free <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PASS TYPES PREVIEW ───────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Pass Types</h2>
              <p className="text-gray-500">Official PMPML 2026 pricing</p>
            </div>
            <Link to="/buy-pass" className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
              View all 18 passes <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PASS_HIGHLIGHTS.map(({ name, price, desc, color }) => (
              <Link key={name} to="/buy-pass"
                className={`rounded-2xl border-2 p-5 hover:shadow-md transition group ${color}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{name}</h3>
                  <span className="text-xl font-black text-gray-900">{price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{desc}</p>
                <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  Buy now <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link to="/buy-pass" className="text-blue-600 font-medium text-sm">View all 18 passes →</Link>
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT PROMO ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Bot className="h-4 w-4 text-yellow-400" /> Powered by AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ask Anything About<br />
                <span className="text-yellow-400">Pune Bus Routes</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Our AI assistant knows all 1030+ PMPML routes. Ask in plain language and get instant answers with booking links.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '"Which bus goes from Katraj to Hinjewadi?"',
                  '"Fastest route from Pune Station to Wakad"',
                  '"What buses stop at Swargate?"',
                ].map(q => (
                  <div key={q} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-sm">
                    <Bot className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-200 italic">{q}</span>
                  </div>
                ))}
              </div>
              <Link to="/ai-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition shadow-lg">
                <Bot className="h-5 w-5" /> Try AI Assistant
              </Link>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">PMPML AI Assistant</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">U</span>
                  </div>
                  <div className="bg-blue-600 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-xs">
                    Routes from Katraj to Hinjewadi
                  </div>
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs text-gray-200">
                    Found 3 routes! Route 91-U is the fastest — 45 mins, ₹25 fare. Want me to book it?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">U</span>
                  </div>
                  <div className="bg-blue-600 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-xs">
                    Yes, book it!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTES PREVIEW ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Routes</h2>
              <p className="text-gray-500">Most booked PMPML routes in Pune</p>
            </div>
            <Link to="/routes" className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Browse all 1030+ routes <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '91-U', from: 'Ma Na Pa', to: 'Ishanyanagari', km: 9.0, fare: 25 },
              { num: '373-D', from: 'Hinjawadi Maan Phase 3', to: 'Wakad Pul', km: 8.5, fare: 25 },
              { num: '94-D', from: 'Pune Station', to: 'Kothrud Depot', km: 11.4, fare: 25 },
              { num: '87-D', from: 'Sutarwadi', to: 'Deccan Gymkhana', km: 12.0, fare: 30 },
              { num: '14A-D', from: 'Kesnand Phata', to: 'Swargate', km: 19.4, fare: 40 },
              { num: '103D-U', from: 'Katraj', to: 'MIT College', km: 12.5, fare: 30 },
            ].map(r => (
              <Link key={r.num} to="/book-ticket"
                state={{ route: { route_number: r.num, origin: r.from, destination: r.to, distance_km: r.km, fare: r.fare, base_fare: r.fare, id: '' } }}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 transition">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Route {r.num}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{r.from} → {r.to}</p>
                  <p className="text-xs text-gray-500">{r.km} km · ₹{r.fare}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 text-yellow-300" /> Free to use · No hidden charges
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Travel Smarter?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Pune's digital transport revolution. Book tickets, manage passes, and travel with ease.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg">
              Create Free Account
            </Link>
            <Link to="/routes"
              className="px-8 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition border border-white/30 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Browse Routes
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
