import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl font-bold text-red-600">500</div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-lg text-gray-600">
            We're sorry, but an unexpected error has occurred.
          </p>
        </div>
        
        <div className="mt-8">
          <Alert
            type="error"
            title="Error Details"
            message={error?.message || 'An unknown error occurred'}
            className="mb-6"
          />
          
          <div className="space-y-4">
            <Button as={Link} to="/" className="w-full">
              Go back home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Try again
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              If the problem persists, please contact support.
            </p>
            <Button
              as="a"
              href="mailto:support@freshmarket.com"
              variant="text"
              className="mt-2"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;