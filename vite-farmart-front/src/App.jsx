import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* =======================
   Layout Components
======================= */
const MainLayout = lazy(() => import("./shared/components/Layout/MainLayout"));
const DashboardLayout = lazy(() => import("./shared/components/Layout/DashboardLayout"));
const AuthLayout = lazy(() => import("./shared/components/Layout/AuthLayout"));

/* =======================
   Loading Components
======================= */
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
      <div className="space-y-2 text-center">
        <p className="text-xl font-semibold text-gray-700">Farmart</p>
        <p className="text-gray-500">Loading your fresh experience...</p>
      </div>
    </div>
  </div>
);

const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

/* =======================
   Protected Route Components
======================= */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'farmer':
        return <Navigate to="/farmer/dashboard" replace />;
      case 'customer':
        return <Navigate to="/profile" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <PageLoading />;
  }

  if (user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'farmer':
        return <Navigate to="/farmer/dashboard" replace />;
      default:
        return <Navigate to="/profile" replace />;
    }
  }

  return children;
};

/* =======================
   Lazy Imports
======================= */

// Auth
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Customer
const Home = lazy(() => import("./pages/customer/Home"));
const Products = lazy(() => import("./pages/customer/Products"));
const ProductDetail = lazy(() => import("./pages/customer/ProductDetail"));
const Cart = lazy(() => import("./pages/customer/Cart"));
const Profile = lazy(() => import("./pages/customer/Profile"));
const About = lazy(() => import("./pages/customer/About"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));

// Farmer
const FarmerDashboard = lazy(() => import("./pages/farmer/Dashboard"));
const FarmerAnalytics = lazy(() => import("./pages/farmer/Analytics"));
const FarmerInventory = lazy(() => import("./pages/farmer/Inventory"));
const FarmerOrders = lazy(() => import("./pages/farmer/Orders"));

// Orders
const Checkout = lazy(() => import("./pages/orders/Checkout"));
const OrderHistory = lazy(() => import("./pages/orders/orderHistory"));
const OrderTracking = lazy(() => import("./pages/orders/orderTracking"));

// Public
const Categories = lazy(() => import("./pages/public/Categories"));
const Contact = lazy(() => import("./pages/public/Contact"));
const FAQ = lazy(() => import("./pages/public/FAQ"));
const Privacy = lazy(() => import("./pages/public/Privacy"));
const Terms = lazy(() => import("./pages/public/Terms"));

// Shared Error Pages
const NotFound = lazy(() => import("./pages/shared/NotFound"));
const ErrorPage = lazy(() => import("./pages/shared/Error"));
const Maintenance = lazy(() => import("./pages/shared/Maintenance"));

/* =======================
   Main App Component
======================= */

function App() {
  // Get auth state
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ---------- DEFAULT REDIRECT ---------- */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* ---------- AUTH ROUTES (Public Only) ---------- */}
        <Route path="/auth/*" element={
          <Suspense fallback={<PageLoading />}>
            <AuthLayout />
          </Suspense>
        }>
          <Route path="login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
          <Route path="forgot-password" element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          } />
          <Route path="reset-password" element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          } />
        </Route>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/*" element={
          <Suspense fallback={<PageLoading />}>
            <MainLayout />
          </Suspense>
        }>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          
          {/* Cart & Checkout */}
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          
          {/* Customer Profile Routes */}
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders/history" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="orders/tracking" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderTracking />
            </ProtectedRoute>
          } />
        </Route>

        {/* ---------- ADMIN PROTECTED ROUTES ---------- */}
        <Route path="/admin/*" element={
          <Suspense fallback={<PageLoading />}>
            <DashboardLayout />
          </Suspense>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="products" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } />
        </Route>

        {/* ---------- FARMER PROTECTED ROUTES ---------- */}
        <Route path="/farmer/*" element={
          <Suspense fallback={<PageLoading />}>
            <DashboardLayout />
          </Suspense>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerAnalytics />
            </ProtectedRoute>
          } />
          <Route path="inventory" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerInventory />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerOrders />
            </ProtectedRoute>
          } />
        </Route>

        {/* ---------- SHARED ERROR ROUTES ---------- */}
        <Route path="/error" element={
          <Suspense fallback={<PageLoading />}>
            <ErrorPage />
          </Suspense>
        } />
        <Route path="/maintenance" element={
          <Suspense fallback={<PageLoading />}>
            <Maintenance />
          </Suspense>
        } />

        {/* ---------- 404 NOT FOUND ---------- */}
        <Route path="*" element={
          <Suspense fallback={<PageLoading />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;