import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Farmart</h2>
                <p className="text-sm text-gray-400">Fresh from farm to table</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              Bringing you the freshest produce directly from local farms. 
              Quality, sustainability, and community at the heart of everything we do.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="/orders/tracking" className="text-gray-400 hover:text-white">Track Order</Link></li>
              <li><Link to="/orders/history" className="text-gray-400 hover:text-white">Order History</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-white">My Account</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Shopping Cart</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-green-400 mt-1" />
                <span className="text-gray-400">123 Farm Street, Agriculture City, AC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-green-400" />
                <span className="text-gray-400">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-green-400" />
                <span className="text-gray-400">support@farmart.com</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {currentYear} Farmart. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <img src="/icons/visa.svg" alt="Visa" className="h-8" />
              <img src="/icons/mastercard.svg" alt="Mastercard" className="h-8" />
              <img src="/icons/paypal.svg" alt="PayPal" className="h-8" />
              <img src="/icons/stripe.svg" alt="Stripe" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;