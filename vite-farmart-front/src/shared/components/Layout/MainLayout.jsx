import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// Lazy load components for better performance
const MainNavbar = React.lazy(() => import('../Navbar/MainNavbar'));
const Footer = React.lazy(() => import('../Footer/Footer'));

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Suspense for navbar */}
      <Suspense fallback={
        <div className="h-16 bg-white shadow-sm animate-pulse"></div>
      }>
        <MainNavbar />
      </Suspense>
      
      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Suspense for footer */}
      <Suspense fallback={
        <div className="h-48 bg-gray-900 animate-pulse"></div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MainLayout;