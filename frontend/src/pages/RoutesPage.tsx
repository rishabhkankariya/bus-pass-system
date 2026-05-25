import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { MapPin, Clock, DollarSign, Bus, AlertCircle } from 'lucide-react'

interface Route {
  id: string
  route_number: string
  origin: string
  destination: string
  distance_km: number
  base_fare: number
  is_active: boolean
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/routes/')
      setRoutes(response.data)
    } catch (err: any) {
      setError('Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  const filteredRoutes = routes.filter((route) => {
    const search = searchTerm.toLowerCase()
    return (
      route.route_number.toLowerCase().includes(search) ||
      route.origin.toLowerCase().includes(search) ||
      route.destination.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bus Routes</h1>
        <p className="text-gray-600">Browse all available bus routes and plan your journey</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by route number, origin, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input max-w-md"
        />
      </div>

      {filteredRoutes.length === 0 ? (
        <div className="card text-center py-12">
          <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No routes found' : 'No routes available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try a different search term' : 'Routes will be added soon'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="card hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    Route {route.route_number}
                  </span>
                  {route.is_active ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold text-gray-900">{route.origin}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold text-gray-900">{route.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{route.distance_km} km</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold text-primary-600">${route.base_fare}</span>
                    </div>
                  </div>
                </div>

                {route.is_active && (
                  <Link
                    to="/book-ticket"
                    className="mt-4 w-full btn btn-primary text-center block"
                  >
                    Book Ticket
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
            <Bus className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold mb-2">Frequent Service</h3>
          <p className="text-sm text-gray-600">Buses run every 15-30 minutes on all routes</p>
        </div>

        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">On-Time Performance</h3>
          <p className="text-sm text-gray-600">95% of our buses arrive within 5 minutes of schedule</p>
        </div>

        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Wide Coverage</h3>
          <p className="text-sm text-gray-600">Connecting all major areas of the city</p>
        </div>
      </div>
    </div>
  )
}
