import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

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

// Shared
const NotFound = lazy(() => import("./pages/shared/NotFound"));
const ErrorPage = lazy(() => import("./pages/shared/Error"));
const Maintenance = lazy(() => import("./pages/shared/Maintenance"));

/* =======================
   App Component
======================= */

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- CUSTOMER ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />

        {/* ---------- ORDERS ---------- */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/orders/tracking" element={<OrderTracking />} />

        {/* ---------- ADMIN ---------- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        {/* ---------- FARMER ---------- */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/analytics" element={<FarmerAnalytics />} />
        <Route path="/farmer/inventory" element={<FarmerInventory />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />

        {/* ---------- PUBLIC ---------- */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* ---------- SHARED ---------- */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/maintenance" element={<Maintenance />} />

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default App;
