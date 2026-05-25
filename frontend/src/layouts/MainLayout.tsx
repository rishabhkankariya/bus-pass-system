import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Bus, User, LogOut, Menu, X, Ticket, CreditCard, MapPin, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SmartBus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/routes" className="text-gray-700 hover:text-primary-600 transition">
                Routes
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Dashboard
                  </Link>
                  <Link to="/book-ticket" className="text-gray-700 hover:text-primary-600 transition">
                    Book Ticket
                  </Link>
                  <Link to="/buy-pass" className="text-gray-700 hover:text-primary-600 transition">
                    Buy Pass
                  </Link>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                      <User className="h-5 w-5" />
                      <span>{user?.first_name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/my-passes"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Passes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/routes"
                  className="text-gray-700 hover:text-primary-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Routes
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/book-ticket"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Book Ticket
                    </Link>
                    <Link
                      to="/buy-pass"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Buy Pass
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/my-passes"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Passes
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="text-left text-red-600 hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-primary-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary inline-block text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bus className="h-8 w-8 text-primary-400" />
                <span className="text-xl font-bold">SmartBus</span>
              </div>
              <p className="text-gray-400">
                Your smart solution for bus tickets and passes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/routes" className="hover:text-white transition">
                    Routes
                  </Link>
                </li>
                <li>
                  <Link to="/book-ticket" className="hover:text-white transition">
                    Book Ticket
                  </Link>
                </li>
                <li>
                  <Link to="/buy-pass" className="hover:text-white transition">
                    Buy Pass
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 SmartBus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
