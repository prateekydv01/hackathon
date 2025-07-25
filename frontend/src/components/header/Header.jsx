import React, { useState, useEffect } from 'react'
import {Logo, LogoutButton} from "../index"
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './header.css'
import { logoutUser } from '../../api'
import { logout } from '../../store/authSlice'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const currentUser = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation() // Get current location
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
      icon: "🏠"
    },
    {
      name: "About Us",
      slug: "/about-us",
      active: !authStatus,
      icon: "ℹ️"
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
      icon: "🔐"
    },
    {
      name: "Sign Up",
      slug: "/signup",
      active: !authStatus,
      icon: "👤"
    },
    
    {
      name: "Map",
      slug: "/map",
      active: authStatus,
      icon: "🗺️"
    },
    {
      name: "Emergency",
      slug: "/emergency",
      active: authStatus,
      icon: "🚨"
    },
  ]

  // Check if current path matches nav item
  const isActivePage = (slug) => {
    if (slug === '/' && location.pathname === '/') return true
    if (slug !== '/' && location.pathname.startsWith(slug)) return true
    return false
  }

  // Helper function to get user's initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Helper function to get user's location
  const getUserLocation = () => {
    if (currentUser?.location?.address) {
      // Extract city from full address
      const addressParts = currentUser.location.address.split(',');
      return addressParts[0].trim(); // Return first part (usually city)
    }
    return 'Rewari';
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Header with Original Colors */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl bg-white/10' : 'backdrop-blur-sm bg-transparent'
      }`}>
        <div 
          className={`text-white px-4 md:px-6 lg:px-10 flex justify-between items-center shadow-2xl transition-all duration-500 ${
            scrolled ? 'py-2' : 'py-4'
          }`}
          style={{ 
            background: scrolled 
              ? 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' 
              : 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          {/* Logo Section */}
          <div className='flex items-center transform hover:scale-105 transition-transform duration-300'>
            <button 
              onClick={()=>{navigate("/")}}
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <Logo/>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - No Icons */}
          <nav className="hidden lg:block">
            <ul className='flex items-center gap-2'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name} className="relative">
                    <button
                      className={`px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-300 relative overflow-hidden group ${
                        isActivePage(item.slug) 
                          ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30 scale-105' 
                          : 'hover:bg-white/15 hover:backdrop-blur-sm hover:scale-105 hover:shadow-lg'
                      }`}
                      onClick={() => navigate(item.slug)}
                    >
                      {/* Active page indicator */}
                      {isActivePage(item.slug) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-purple-200/30 rounded-2xl animate-pulse"></div>
                      )}
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <span className="relative z-10">
                        {/* ✅ No icons in web view */}
                        {item.name}
                      </span>
                      
                      {/* Bottom border for active page */}
                      {isActivePage(item.slug) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                      )}
                    </button>
                  </li>
                ) : null
              )}
              
              {/* ✅ Location Bar + Profile Section */}
              {authStatus && currentUser && (
                <>
                  {/* Location Bar */}
                  <li className="ml-4">
                    <div className='flex items-center px-5 py-3 bg-white/20 text-white rounded-2xl
                                  backdrop-blur-sm shadow-lg font-semibold text-base border border-white/30
                                  hover:shadow-xl transition-all duration-300 hover:bg-white/25'>
                      <span className='mr-3 text-lg'>📍</span>
                      <span>{getUserLocation()}</span>
                    </div>
                  </li>

                  {/* Profile Section */}
                  <li>
                    <div className="flex items-center gap-4">
                      {/* Profile Button with Glow Effect */}
                      <button
                        className='relative p-1 rounded-full group transition-all duration-300 hover:scale-110'
                        onClick={() => navigate('/profile')}
                        title={`View ${currentUser.fullName}'s profile`}
                      >
                        {/* Glow ring */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-md scale-125"></div>
                        
                        {currentUser.avatar ? (
                          <img 
                            src={currentUser.avatar}
                            alt={currentUser.fullName}
                            className="w-12 h-12 rounded-full object-cover shadow-xl border-2 border-white/50 group-hover:border-white transition-all duration-300 relative z-10"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        <div 
                          className={`w-12 h-12 bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 rounded-full 
                                    flex items-center justify-center text-white font-bold text-base shadow-xl
                                    border-2 border-white/50 group-hover:border-white transition-all duration-300 relative z-10
                                    ${currentUser.avatar ? 'hidden' : 'flex'}`}
                          style={{ display: currentUser.avatar ? 'none' : 'flex' }}
                        >
                          {getUserInitials(currentUser.fullName)}
                        </div>
                      </button>
                      
                      {/* Sexy Divider */}
                      <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                      
                      {/* Enhanced Logout Button */}
                      <div className="transform hover:scale-105 transition-transform duration-300">
                        <LogoutButton />
                      </div>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
              }`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full my-0.5 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-full ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
              }`}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu - Keep Icons */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white via-purple-50 to-indigo-50 
        shadow-2xl transform transition-all duration-500 ease-out z-50 lg:hidden backdrop-blur-xl border-l border-white/20
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Header with Profile */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-purple-200">
            <div className="flex items-center gap-4">
              {authStatus && currentUser && (
                <button
                  onClick={() => {
                    navigate('/profile')
                    setIsMobileMenuOpen(false)
                  }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-lg scale-125"></div>
                  
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="w-12 h-12 rounded-full object-cover shadow-lg relative z-10 border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg relative z-10 border-2 border-purple-200">
                      {getUserInitials(currentUser.fullName)}
                    </div>
                  )}
                </button>
              )}
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Menu</h2>
            </div>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl hover:bg-purple-100 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation with Icons */}
          <nav className="space-y-2">
            {navItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 font-semibold relative overflow-hidden group ${
                    isActivePage(item.slug)
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-105'
                      : 'hover:bg-purple-100 hover:text-purple-700 text-gray-700 hover:scale-105'
                  }`}
                  onClick={() => {
                    navigate(item.slug)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {/* Active indicator */}
                  {isActivePage(item.slug) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  
                  {/* ✅ Keep icons in mobile view */}
                  <span className="text-2xl">{item.icon}</span>
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ) : null
            )}
          </nav>

          {/* Mobile Footer with Location */}
          <div className="mt-8 pt-6 border-t border-purple-200 space-y-4">
            {/* Location in Mobile */}
            {authStatus && currentUser && (
              <div className='flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium'>
                <span className='mr-3 text-xl'>📍</span>
                <span>{getUserLocation()}</span>
              </div>
            )}

            {authStatus && currentUser && (
              <button
                className='w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100
                         transition-all duration-300 flex items-center gap-4 font-semibold text-purple-700 hover:scale-105'
                onClick={() => {
                  navigate('/profile')
                  setIsMobileMenuOpen(false)
                }}
              >
                <span className="text-2xl">👤</span>
                View Profile
              </button>
            )}

            {authStatus && (
              <div className="pt-2">
                <LogoutButton className="w-full flex items-center justify-center gap-3 px-6 py-4 
                           bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl
                           font-semibold shadow-lg hover:shadow-xl transition-all duration-300
                           hover:from-red-600 hover:to-pink-600 hover:scale-105"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
