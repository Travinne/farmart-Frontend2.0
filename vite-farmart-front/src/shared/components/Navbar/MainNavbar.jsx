import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronDown,
  Home,
  ShoppingBag,
  Leaf,
  Users,
  HelpCircle,
  Mail
} from 'lucide-react';
import { useSelector } from 'react-redux';

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get cart and user from Redux/store
  const cartItems = useSelector(state => state.cart.items || []);
  const user = useSelector(state => state.auth.user);
  const userRole = user?.role || 'guest';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Fresh Vegetables', path: '/categories', subpath: 'vegetables' },
    { name: 'Organic Fruits', path: '/categories', subpath: 'fruits' },
    { name: 'Dairy Products', path: '/categories', subpath: 'dairy' },
    { name: 'Farm Eggs & Meat', path: '/categories', subpath: 'meat' },
    { name: 'Grains & Cereals', path: '/categories', subpath: 'grains' },
    { name: 'Herbs & Spices', path: '/categories', subpath: 'herbs' },
  ];

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Categories', path: '/categories', icon: Leaf },
    { name: 'About', path: '/about', icon: Users },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin': return '/admin/dashboard';
      case 'farmer': return '/farmer/dashboard';
      case 'customer': return '/profile';
      default: return '/login';
    }
  };

  const handleLogout = () => {
    // Dispatch logout action
    navigate('/login');
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-green-800 text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+1 (234) 567-8900</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={14} />
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link to="/track-order" className="hover:text-green-200">Track Order</Link>
            <Link to="/faq" className="hover:text-green-200">FAQ</Link>
            <Link to="/contact" className="hover:text-green-200">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 shadow-md' : 'py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-green-700">Farmart</h1>
                  <p className="text-xs text-gray-500 -mt-1">Fresh from farm</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      isActive 
                        ? 'text-green-700 bg-green-50' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`
                  }
                >
                  <link.icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium"
                >
                  <span>More</span>
                  <ChevronDown size={16} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border py-2 z-50">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={`${category.path}?category=${category.subpath}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent ml-2 outline-none w-48"
                />
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCart size={24} className="text-gray-700" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-green-700" />
                  </div>
                  <ChevronDown size={16} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Link
                          to={getDashboardLink()}
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders/history"
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Order History
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium ${
                        isActive 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <link.icon size={20} />
                      <span>{link.name}</span>
                    </div>
                  </NavLink>
                ))}
                
                <div className="px-4 pt-2">
                  <p className="font-semibold mb-2 text-gray-500">Categories</p>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={`${category.path}?category=${category.subpath}`}
                        className="block py-2 text-gray-700 hover:text-green-600 pl-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;