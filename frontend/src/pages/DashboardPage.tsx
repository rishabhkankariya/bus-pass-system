import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import { Ticket, CreditCard, MapPin, User } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600">Manage your bookings, passes, and profile</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          to="/book-ticket"
          className="card hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition">
              <Ticket className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Ticket</h3>
              <p className="text-sm text-gray-600">Book a new ticket</p>
            </div>
          </div>
        </Link>

        <Link
          to="/buy-pass"
          className="card hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Buy Pass</h3>
              <p className="text-sm text-gray-600">Purchase a bus pass</p>
            </div>
          </div>
        </Link>

        <Link
          to="/routes"
          className="card hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Routes</h3>
              <p className="text-sm text-gray-600">Browse all routes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Profile</h3>
              <p className="text-sm text-gray-600">Update your info</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <div className="text-center py-8 text-gray-500">
            <Ticket className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No bookings yet</p>
            <Link to="/book-ticket" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
              Book your first ticket →
            </Link>
          </div>
        </div>

        {/* Active Passes */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Passes</h2>
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No active passes</p>
            <Link to="/buy-pass" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
              Purchase a pass →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
