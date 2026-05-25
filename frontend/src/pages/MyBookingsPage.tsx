import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Ticket, Calendar, MapPin, Clock, QrCode, X, AlertCircle } from 'lucide-react'
import { formatDate, formatDateTime } from '../lib/utils'

interface Booking {
  id: string
  schedule_id: string
  booking_date: string
  num_seats: number
  total_amount: number
  status: string
  qr_code_data: string
  created_at: string
  route?: {
    route_number: string
    origin: string
    destination: string
  }
  schedule?: {
    departure_time: string
    arrival_time: string
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/bookings/')
      setBookings(response.data)
    } catch (err: any) {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      setCancelling(bookingId)
      await api.put(`/api/v1/bookings/${bookingId}/cancel`)
      // Refresh bookings
      fetchBookings()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const handleShowQR = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowQR(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <a href="/book-ticket" className="btn btn-primary">
          Book New Ticket
        </a>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start your journey by booking your first ticket!</p>
          <a href="/book-ticket" className="btn btn-primary inline-block">
            Book a Ticket
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card hover:shadow-lg transition">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Booked on {formatDateTime(booking.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">
                          {booking.route?.origin || 'N/A'} → {booking.route?.destination || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <span>Route {booking.route?.route_number || 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-gray-700 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {booking.schedule?.departure_time || 'N/A'} - {booking.schedule?.arrival_time || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-600">Seats:</span>
                      <span className="ml-2 font-medium">{booking.num_seats}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="ml-2 font-bold text-primary-600">${booking.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                  {booking.status.toLowerCase() === 'confirmed' && (
                    <button
                      onClick={() => handleShowQR(booking)}
                      className="btn btn-primary flex items-center justify-center space-x-2"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Show QR Code</span>
                    </button>
                  )}
                  {(booking.status.toLowerCase() === 'confirmed' || booking.status.toLowerCase() === 'pending') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelling === booking.id}
                      className="btn btn-secondary text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Ticket</h3>
              <p className="text-gray-600 mb-6">Show this QR code to the conductor</p>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
                <img
                  src={`data:image/png;base64,${selectedBooking.qr_code_data}`}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">
                    {selectedBooking.route?.origin} → {selectedBooking.route?.destination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(selectedBooking.booking_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedBooking.schedule?.departure_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{selectedBooking.num_seats}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-primary-600">${selectedBooking.total_amount}</span>
                </div>
              </div>

              <button
                onClick={() => setShowQR(false)}
                className="mt-6 w-full btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
