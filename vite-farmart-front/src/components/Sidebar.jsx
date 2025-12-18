import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar, userRole }) {
  const sidebarClass = isOpen ? "sidebar open" : "sidebar";

  return (
    <aside className={sidebarClass}>
      <button className="sidebar-close" onClick={toggleSidebar}>
        ✕
      </button>

      <ul className="sidebar-links">
        {userRole === "user" && (
          <>
            <li><Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
            <li><Link to="/profile" onClick={toggleSidebar}>Profile</Link></li>
            <li><Link to="/orders" onClick={toggleSidebar}>Orders</Link></li>
            <li><Link to="/cart" onClick={toggleSidebar}>Cart</Link></li>
            <li><Link to="/checkout" onClick={toggleSidebar}>Checkout</Link></li>
          </>
        )}

        {userRole === "farmer" && (
          <>
            <li><Link to="/farmer-dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
            <li><Link to="/add-product" onClick={toggleSidebar}>Add Product</Link></li>
            <li><Link to="/manage-products" onClick={toggleSidebar}>Manage Products</Link></li>
            <li><Link to="/sales" onClick={toggleSidebar}>Sales / Orders</Link></li>
            <li><Link to="/farmer-profile" onClick={toggleSidebar}>Profile</Link></li>
          </>
        )}

        {userRole === "admin" && (
          <>
            <li><Link to="/admin-dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
            <li><Link to="/manage-users" onClick={toggleSidebar}>Manage Users</Link></li>
            <li><Link to="/manage-products" onClick={toggleSidebar}>Manage Products</Link></li>
            <li><Link to="/manage-orders" onClick={toggleSidebar}>Manage Orders</Link></li>
            <li><Link to="/reports" onClick={toggleSidebar}>Reports</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
