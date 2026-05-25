import { useState, useEffect } from 'react'
import api from '../lib/api'
import { CreditCard, Calendar, QrCode, X, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDate, formatDateTime } from '../lib/utils'

interface Pass {
  id: string
  pass_type_id: string
  start_date: string
  end_date: string
  status: string
  qr_code_data: string
  created_at: string
  pass_type?: {
    name: string
    duration_days: number
    price: number
  }
}

export default function MyPassesPage() {
  const [passes, setPasses] = useState<Pass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    fetchPasses()
  }, [])

  const fetchPasses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/passes/')
      setPasses(response.data)
    } catch (err: any) {
      setError('Failed to load passes')
    } finally {
      setLoading(false)
    }
  }

  const handleShowQR = (pass: Pass) => {
    setSelectedPass(pass)
    setShowQR(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isPassActive = (pass: Pass) => {
    const now = new Date()
    const endDate = new Date(pass.end_date)
    return pass.status.toLowerCase() === 'active' && endDate > now
  }

  const getDaysRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your passes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Passes</h1>
        <a href="/buy-pass" className="btn btn-primary">
          Buy New Pass
        </a>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {passes.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No passes yet</h3>
          <p className="text-gray-600 mb-6">Purchase a pass for unlimited travel!</p>
          <a href="/buy-pass" className="btn btn-primary inline-block">
            Buy a Pass
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className={`card hover:shadow-xl transition ${
                isPassActive(pass) ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pass.status)}`}>
                  {pass.status}
                </span>
                {isPassActive(pass) && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {getDaysRemaining(pass.end_date)} days left
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {pass.pass_type?.name || 'Bus Pass'}
                </h3>
                <p className="text-sm text-gray-600">
                  {pass.pass_type?.duration_days} day pass
                </p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(pass.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{formatDate(pass.end_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-primary-600">${pass.pass_type?.price}</span>
                </div>
              </div>

              {isPassActive(pass) && (
                <button
                  onClick={() => handleShowQR(pass)}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Show QR Code</span>
                </button>
              )}

              {pass.status.toLowerCase() === 'expired' && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Pass expired on {formatDate(pass.end_date)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Pass</h3>
              <p className="text-gray-600 mb-6">Show this QR code to the conductor</p>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
                <img
                  src={`data:image/png;base64,${selectedPass.qr_code_data}`}
                  alt="QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg p-4 text-white text-left space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-primary-100">Pass Type:</span>
                  <span className="font-medium">{selectedPass.pass_type?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Valid From:</span>
                  <span className="font-medium">{formatDate(selectedPass.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-100">Valid Until:</span>
                  <span className="font-medium">{formatDate(selectedPass.end_date)}</span>
                </div>
                <div className="flex justify-between border-t border-primary-400 pt-2">
                  <span className="text-primary-100">Days Remaining:</span>
                  <span className="font-bold text-lg">{getDaysRemaining(selectedPass.end_date)}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Unlimited Travel</span>
                </div>
              </div>

              <button
                onClick={() => setShowQR(false)}
                className="w-full btn btn-primary"
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
