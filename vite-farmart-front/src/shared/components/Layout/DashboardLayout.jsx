import React, { Suspense, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Lazy load components
const DashboardNavbar = React.lazy(() => import('../Navbar/DashboardNavbar'));
const AdminSidebar = React.lazy(() => import('../Sidebar/AdminSidebar'));
const FarmerSidebar = React.lazy(() => import('../Sidebar/FarmerSidebar'));
const CustomerSidebar = React.lazy(() => import('../Sidebar/CustomerSidebar'));

const DashboardLayout = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine which sidebar to show based on user role
  const getSidebarComponent = () => {
    switch (user.role) {
      case 'admin':
        return AdminSidebar;
      case 'farmer':
        return FarmerSidebar;
      case 'customer':
        return CustomerSidebar;
      default:
        return null;
    }
  };

  const SidebarComponent = getSidebarComponent();

  return (
    <div className="min-h-screen bg-gray-50">
      {SidebarComponent ? (
        <div className="flex">
          {/* Sidebar */}
          <Suspense fallback={
            <div className="w-64 h-screen bg-white border-r animate-pulse"></div>
          }>
            <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </Suspense>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Dashboard Navbar */}
            <Suspense fallback={
              <div className="h-16 bg-white border-b animate-pulse"></div>
            }>
              <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
            </Suspense>
            
            {/* Main content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      ) : (
        // No sidebar layout (for unexpected roles)
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={
            <div className="h-16 bg-white border-b animate-pulse"></div>
          }>
            <DashboardNavbar />
          </Suspense>
          
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;