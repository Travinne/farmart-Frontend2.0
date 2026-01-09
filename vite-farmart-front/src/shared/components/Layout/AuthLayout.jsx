import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold">Farmart</span>
          </Link>
        </header>

        {/* Main content */}
        <main className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <Outlet />
          </div>
          
          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Home
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-green-600 hover:text-green-700">Terms</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-600 hover:text-green-700">Privacy Policy</Link>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Farmart. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/contact" className="hover:text-green-600">Contact</Link>
            <Link to="/faq" className="hover:text-green-600">FAQ</Link>
            <Link to="/about" className="hover:text-green-700">About Us</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;