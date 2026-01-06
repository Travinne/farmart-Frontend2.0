import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-gray-200">404</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Button as={Link} to="/" className="inline-flex">
            Go back home
          </Button>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Or try searching for what you need
          </p>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;