import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Farmart</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-green-600 font-medium">Products</Link>
              <Link to="/about" className="text-green-600 font-medium border-b-2 border-green-600">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</Link>
              <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Sign Up</Link>
            </nav>
            
            {/* Mobile menu button */}
            <button className="md:hidden">
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <span className="text-2xl">🌱</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Farmart
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connecting farmers and consumers through technology, sustainability, and trust.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-400 to-green-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Growing Together</h2>
                <p className="text-lg opacity-90">Empowering farmers, enriching communities</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          <div className="p-6 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-8 bg-green-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Welcome to <strong className="text-green-700">Farmart</strong> — the ultimate online marketplace 
                  designed to bridge the gap between farmers and consumers. Our platform makes it easier than ever 
                  to buy and sell farm products and agricultural equipment with confidence, transparency, and convenience.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Born from a passion for agriculture and technology, Farmart was founded in 2023 with a simple 
                  yet powerful vision: to create a digital ecosystem that supports local farmers while providing 
                  consumers with access to fresh, high-quality farm products. We believe in the power of 
                  community-driven commerce and sustainable agriculture.
                </p>
              </div>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-green-50 p-8 rounded-xl border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700">
                    To empower farmers by providing them with a reliable platform to sell their products, 
                    while giving customers access to fresh, high-quality farm goods. We strive to create a 
                    seamless, transparent, and trustworthy marketplace where agriculture meets technology.
                  </p>
                </div>

                <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700">
                    To become the leading digital marketplace for agricultural products worldwide, 
                    fostering sustainable farming practices, supporting rural economies, and making 
                    fresh farm products accessible to everyone, everywhere.
                  </p>
                </div>
              </div>

              {/* Why Choose Farmart */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-green-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Why Choose Farmart?</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: "👨‍🌾",
                      title: "Direct from Farmers",
                      description: "Connect directly with verified farmers. No middlemen, better prices for everyone."
                    },
                    {
                      icon: "🥦",
                      title: "Fresh & Organic",
                      description: "Get farm-fresh produce delivered directly from harvest to your doorstep."
                    },
                    {
                      icon: "🛡️",
                      title: "Quality Guaranteed",
                      description: "Every product is quality-checked and comes with satisfaction guarantee."
                    },
                    {
                      icon: "💸",
                      title: "Fair Prices",
                      description: "Competitive pricing that supports farmers while being affordable for consumers."
                    },
                    {
                      icon: "🚚",
                      title: "Fast Delivery",
                      description: "Quick and reliable delivery network ensuring freshness upon arrival."
                    },
                    {
                      icon: "🌍",
                      title: "Sustainable Choice",
                      description: "Support eco-friendly farming practices and reduce carbon footprint."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-green-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Core Values</h2>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { value: "Integrity", description: "Transparent and honest in all our dealings" },
                      { value: "Sustainability", description: "Promoting eco-friendly farming practices" },
                      { value: "Community", description: "Building strong relationships between farmers and consumers" },
                      { value: "Innovation", description: "Leveraging technology to improve agriculture" }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4">
                        <div className="text-3xl mb-2">
                          {index === 0 && "🤝"}
                          {index === 1 && "🌱"}
                          {index === 2 && "👥"}
                          {index === 3 && "💡"}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{item.value}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { number: "500+", label: "Farmers Partnered" },
                    { number: "10,000+", label: "Products Listed" },
                    { number: "50,000+", label: "Happy Customers" },
                    { number: "98%", label: "Satisfaction Rate" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-white rounded-xl border border-gray-200">
                      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                      <div className="text-gray-700 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Section */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-green-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: "John Farmer", role: "Founder & CEO", image: "👨‍🌾" },
                    { name: "Sarah Green", role: "Head of Operations", image: "👩‍💼" },
                    { name: "Michael Grow", role: "Technology Lead", image: "👨‍💻" }
                  ].map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-5xl mb-4">
                        {member.image}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                      <p className="text-green-600 mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">
                        Passionate about sustainable agriculture and building communities.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">Join the Farmart Community Today</h3>
                <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                  Whether you're a farmer looking to reach more customers or a consumer seeking fresh, 
                  quality farm products, Farmart is the perfect platform for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register" 
                    className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Sign Up as Buyer
                  </Link>
                  <Link 
                    to="/register/farmer" 
                    className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-700 transition-colors"
                  >
                    Join as Farmer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold">Farmart</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting farmers and consumers through sustainable agriculture.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">For Farmers</h4>
              <ul className="space-y-2">
                <li><Link to="/sell" className="text-gray-400 hover:text-white">Sell on Farmart</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Farmer Resources</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <span className="mr-2">📧</span> support@farmart.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span> +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span> 123 Farm Street, Agriculture City
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Farmart. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;