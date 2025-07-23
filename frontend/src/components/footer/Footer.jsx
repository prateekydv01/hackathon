import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../logo'

function Footer() {
  return (
    <footer className='py-12 px-6 text-white relative overflow-hidden' 
            style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
      {/* Subtle decorative elements matching header */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl'></div>
        <div className='absolute bottom-10 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl'></div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <div className='mb-4'>
              <Logo />
            </div>
            <p className='text-white/80'>Connecting local communities through trusted professional services.</p>
          </div>
          
          <div>
            <h3 className='text-white font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li><Link to="/about-us" className='text-white/80 hover:text-white transition-colors'>About Us</Link></li>
              <li><Link to="/signup" className='text-white/80 hover:text-white transition-colors'>Sign Up</Link></li>
              <li><Link to="/login" className='text-white/80 hover:text-white transition-colors'>Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-bold mb-4'>Services</h3>
            <ul className='space-y-2 text-white/80'>
              <li>Find Professionals</li>
              <li>Emergency Alerts</li>
              <li>Community Support</li>
              <li>Local Network</li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-bold mb-4'>Contact</h3>
            <div className='space-y-2 text-white/80'>
              <p>📧 support@localconnect.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Delhi, India</p>
            </div>
          </div>
        </div>

        <div className='border-t border-white/20 pt-8 text-center'>
          <p className='text-white/80'>&copy; 2024 LocalConnect. Built for connecting communities.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
