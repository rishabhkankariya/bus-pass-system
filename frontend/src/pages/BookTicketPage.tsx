import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Calendar, MapPin, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'

interface Route {
  id: string
  route_number: string
  origin: string
  destination: string
  distance_km: number
  base_fare: number
}

interface Schedule {
  id: string
  departure_time: string
  arrival_time: string
  available_seats: number
}

export default function BookTicketPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [routes, setRoutes] = useState<Route[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form data
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [numSeats, setNumSeats] = useState(1)

  // Fetch routes on mount
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

  const fetchSchedules = async (routeId: string) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/v1/routes/${routeId}/schedules`)
      setSchedules(response.data)
    } catch (err: any) {
      setError('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route)
    setSelectedSchedule(null)
    fetchSchedules(route.id)
    setStep(2)
  }

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setStep(3)
  }

  const handleBooking = async () => {
    if (!selectedRoute || !selectedSchedule) return

    try {
      setLoading(true)
      setError('')

      const response = await api.post('/api/v1/bookings/', {
        schedule_id: selectedSchedule.id,
        booking_date: selectedDate,
        num_seats: numSeats,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/my-bookings')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
          <p className="text-gray-600 mb-4">Your ticket has been booked successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Ticket</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Route</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Schedule</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Select Route */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Your Route</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading routes...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="card text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No routes available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleRouteSelect(route)}
                  className="card text-left hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-primary-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                        Route {route.route_number}
                      </span>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{route.origin}</span>
                        <span>→</span>
                        <span className="font-medium">{route.destination}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{route.distance_km} km</span>
                    <span className="text-lg font-bold text-primary-600">${route.base_fare}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Schedule */}
      {step === 2 && selectedRoute && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="mb-4 text-primary-600 hover:text-primary-700 flex items-center"
          >
            ← Back to routes
          </button>
          <h2 className="text-xl font-semibold mb-4">Select Schedule</h2>
          <div className="card mb-4 bg-primary-50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Selected Route</span>
                <p className="font-semibold text-gray-900">
                  {selectedRoute.origin} → {selectedRoute.destination}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary-600">${selectedRoute.base_fare}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="card text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No schedules available for this route.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => handleScheduleSelect(schedule)}
                  className="card w-full text-left hover:shadow-lg transition border-2 border-transparent hover:border-primary-600"
                  disabled={schedule.available_seats === 0}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm text-gray-600">Departure</p>
                        <p className="text-lg font-semibold">{schedule.departure_time}</p>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div>
                        <p className="text-sm text-gray-600">Arrival</p>
                        <p className="text-lg font-semibold">{schedule.arrival_time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className={schedule.available_seats < 10 ? 'text-orange-600 font-medium' : ''}>
                          {schedule.available_seats} seats
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && selectedRoute && selectedSchedule && (
        <div>
          <button
            onClick={() => setStep(2)}
            className="mb-4 text-primary-600 hover:text-primary-700 flex items-center"
          >
            ← Back to schedules
          </button>
          <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Route Details */}
              <div className="card">
                <h3 className="font-semibold mb-3">Route Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route Number:</span>
                    <span className="font-medium">{selectedRoute.route_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{selectedRoute.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{selectedRoute.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{selectedRoute.distance_km} km</span>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="card">
                <h3 className="font-semibold mb-3">Schedule Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure Time:</span>
                    <span className="font-medium">{selectedSchedule.departure_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival Time:</span>
                    <span className="font-medium">{selectedSchedule.arrival_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Seats:</span>
                    <span className="font-medium">{selectedSchedule.available_seats}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="card">
                <h3 className="font-semibold mb-3">Booking Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Seats
                    </label>
                    <select
                      value={numSeats}
                      onChange={(e) => setNumSeats(Number(e.target.value))}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} disabled={num > selectedSchedule.available_seats}>
                          {num} {num === 1 ? 'seat' : 'seats'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h3 className="font-semibold mb-4">Price Summary</h3>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare:</span>
                    <span>${selectedRoute.base_fare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Seats:</span>
                    <span>× {numSeats}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary-600">${(selectedRoute.base_fare * numSeats).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Your seat will be reserved for 10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
