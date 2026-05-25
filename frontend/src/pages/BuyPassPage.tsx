import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface PassType {
  id: string
  name: string
  duration_days: number
  price: number
  description: string
}

export default function BuyPassPage() {
  const navigate = useNavigate()
  const [passTypes, setPassTypes] = useState<PassType[]>([])
  const [selectedPass, setSelectedPass] = useState<PassType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPassTypes()
  }, [])

  const fetchPassTypes = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/passes/types')
      setPassTypes(response.data)
    } catch (err: any) {
      setError('Failed to load pass types')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!selectedPass) return

    try {
      setLoading(true)
      setError('')

      await api.post('/api/v1/passes/', {
        pass_type_id: selectedPass.id,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/my-passes')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Purchase failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pass Purchased Successfully!</h2>
          <p className="text-gray-600 mb-4">Your bus pass is now active.</p>
          <p className="text-sm text-gray-500">Redirecting to your passes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Buy a Bus Pass</h1>
      <p className="text-gray-600 mb-8">Choose a pass that fits your travel needs</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading && !selectedPass ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading pass options...</p>
        </div>
      ) : passTypes.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pass types available at the moment.</p>
        </div>
      ) : !selectedPass ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {passTypes.map((passType) => (
            <div
              key={passType.id}
              className="card hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-primary-600"
              onClick={() => setSelectedPass(passType)}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{passType.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-600">${passType.price}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                  <Clock className="h-4 w-4" />
                  <span>{passType.duration_days} days</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{passType.description}</p>
                <button className="w-full btn btn-primary">
                  Select Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <button
              onClick={() => setSelectedPass(null)}
              className="mb-4 text-primary-600 hover:text-primary-700"
            >
              ← Back to pass options
            </button>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pass Details</h2>

              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white mb-6">
                <h3 className="text-3xl font-bold mb-2">{selectedPass.name}</h3>
                <p className="text-primary-100 mb-4">{selectedPass.description}</p>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-primary-200 text-sm">Duration</p>
                    <p className="text-2xl font-bold">{selectedPass.duration_days} days</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm">Price</p>
                    <p className="text-2xl font-bold">${selectedPass.price}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Pass Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited travel on all routes</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No booking required - just board and go</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Digital QR code for easy verification</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Valid for {selectedPass.duration_days} consecutive days</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Instant activation upon purchase</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How it works</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Purchase your pass</li>
                  <li>Receive your digital pass with QR code</li>
                  <li>Show the QR code to the conductor when boarding</li>
                  <li>Travel unlimited for the pass duration</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pass Type:</span>
                  <span className="font-medium">{selectedPass.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{selectedPass.duration_days} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Activation:</span>
                  <span className="font-medium">Immediate</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">${selectedPass.price}</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full btn btn-primary py-3 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Purchase Pass'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your pass will be activated immediately after purchase
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
