// components/Logo/Logo.jsx
import React from 'react'

function Logo() {
  return (
    <div className='flex items-center gap-2'>
      {/* Logo Icon */}
      
      
      {/* Logo Text */}
      <div className='flex flex-col'>
        <span className='text-xl font-bold text-white tracking-tight'>
          Help<span className='text-yellow-300'>Hive</span>
        </span>
        <span className='text-xs text-white/70 -mt-1'>Community Help</span>
      </div>
    </div>
  )
}

export default Logo
