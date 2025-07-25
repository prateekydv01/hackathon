import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components'

function AboutUs() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section - Full Screen */}
      <section className='relative h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex items-center'>
        {/* Enhanced Animated Background Elements */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse' style={{ animationDelay: '1s' }}></div>
          
          <div className='absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-2xl rotate-45 opacity-25 animate-bounce' style={{ animationDelay: '0.5s' }}></div>
          <div className='absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-30 animate-bounce' style={{ animationDelay: '1.5s' }}></div>
          
          <div className='absolute top-1/2 left-1/3 w-8 h-8 bg-purple-400 rounded-full opacity-40 animate-ping'></div>
          <div className='absolute top-1/4 right-1/3 w-6 h-6 bg-indigo-400 rounded-full opacity-30 animate-ping' style={{ animationDelay: '0.8s' }}></div>
          
          <div className='absolute top-16 right-16 w-20 h-20 border-4 border-purple-300 rounded-lg rotate-12 opacity-20 animate-spin' style={{ animationDuration: '10s' }}></div>
          <div className='absolute bottom-16 left-16 w-16 h-16 border-3 border-indigo-300 rounded-full opacity-25 animate-spin' style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 w-full'>
          <div className='text-center'>
            <div className='mb-8 transform hover:scale-105 transition-transform duration-300'>
              {/* <Logo /> */}
            </div>
            
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black text-gray-800 mb-8 tracking-tight'>
              <span className='block animate-fade-in-up'>About Our</span>
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mt-4 animate-fade-in-up' style={{ animationDelay: '0.2s' }}>
                Local Network
              </span>
            </h1>
            
            <p className='text-xl md:text-3xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
              Connecting communities through trusted professional services within your neighborhood
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up' style={{ animationDelay: '0.6s' }}>
              <Link 
                to="/signup" 
                className='group px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden'
                style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                <span className='relative z-10 flex items-center justify-center gap-3'>
                  Join Our Community
                  <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
                </span>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </Link>
              <Link 
                to="/" 
                className='group border-3 border-purple-600 text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-110 bg-white/90 backdrop-blur-sm hover:shadow-2xl'>
                <span className='group-hover:scale-105 transition-transform duration-300 inline-block'>Explore Platform</span>
              </Link>
            </div>

            
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className='py-20 px-6 bg-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-1/4 w-20 h-20 bg-purple-100 rounded-full blur-lg opacity-30 animate-pulse'></div>
          <div className='absolute bottom-10 right-1/4 w-16 h-16 bg-indigo-100 rounded-full blur-md opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-black text-gray-900 mb-4'>Our Mission</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mb-6 rounded-full'></div>
            <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
              We're revolutionizing how communities connect by creating a trusted network where people can find 
              and offer professional services within their local area. Our platform bridges the gap between 
              service seekers and skilled professionals, fostering stronger neighborhood relationships.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-30 animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-black text-gray-900 mb-4'>How We Connect Communities</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full'></div>
            <p className='text-xl text-gray-600'>Building trust through verified connections</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {[
              {
                title: "Location-Based Matching",
                description: "Connect with professionals within a 5km radius for quick, convenient service access",
                icon: "📍",
                color: "from-green-500 to-emerald-600"
              },
              {
                title: "Verified Professionals",
                description: "All service providers are verified with detailed profiles, ratings, and reviews",
                icon: "✅",
                color: "from-blue-500 to-indigo-600"
              },
              {
                title: "Emergency Support",
                description: "Instant community alerts within 2km radius for emergency assistance when needed",
                icon: "🚨",
                color: "from-red-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div key={index} className='text-center group relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                <div className='relative z-10 p-6'>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl text-white shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className='text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300'>{feature.title}</h3>
                  <p className='text-gray-600 text-lg leading-relaxed'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className='py-20 px-6 bg-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-20 w-20 h-20 bg-purple-100 rounded-full blur-lg opacity-30 animate-pulse'></div>
          <div className='absolute bottom-10 left-20 w-16 h-16 bg-indigo-100 rounded-full blur-md opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-black text-gray-900 mb-4'>Professional Services Available</h2>
            <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mb-6 rounded-full'></div>
            <p className='text-xl text-gray-600'>From everyday needs to specialized services</p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6'>
            {[
              { icon: "👨‍⚕️", name: "Doctors" },
              { icon: "🔧", name: "Plumbers" },
              { icon: "⚡", name: "Electricians" },
              { icon: "👨‍🏫", name: "Teachers" },
              { icon: "🧹", name: "Cleaners" },
              { icon: "✂️", name: "Barbers" },
              { icon: "👨‍🍳", name: "Chefs" },
              { icon: "🔨", name: "Carpenters" },
              { icon: "🎨", name: "Painters" },
              { icon: "🌱", name: "Gardeners" },
              { icon: "🚗", name: "Drivers" },
              { icon: "🔒", name: "Security" },
              { icon: "💼", name: "Lawyers" },
              { icon: "📊", name: "Accountants" },
              { icon: "📸", name: "Photographers" },
              { icon: "🎵", name: "Musicians" }
            ].map((service, index) => (
              <div key={index} className='bg-white p-6 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border-2 border-transparent hover:border-purple-200'>
                <div className='text-4xl mb-4 group-hover:scale-125 transition-transform duration-500'>{service.icon}</div>
                <span className='text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300'>{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

   =

      {/* Emergency Feature Highlight */}
      <section className='py-20 px-6 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse'></div>
          <div className='absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
          <div className='absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full blur-xl animate-ping'></div>
        </div>
        
        <div className='max-w-6xl mx-auto text-center relative z-10'>
          <div className='text-7xl mb-8 animate-pulse'>🚨</div>
          <h2 className='text-4xl font-black mb-6'>Community Emergency Network</h2>
          <div className='w-32 h-1 bg-white mx-auto mb-8 rounded-full'></div>
          <p className='text-xl mb-12 max-w-3xl mx-auto opacity-95'>
            When emergencies strike, our community responds. Instant alerts reach all users within 2km, 
            creating a safety net that ensures help is always nearby when you need it most.
          </p>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <div className='bg-white/20 backdrop-blur-sm p-6 rounded-2xl'>
              <div className='text-4xl mb-4'>⚡</div>
              <div className='text-xl font-semibold'>Instant Alerts</div>
            </div>
            <div className='bg-white/20 backdrop-blur-sm p-6 rounded-2xl'>
              <div className='text-4xl mb-4'>📍</div>
              <div className='text-xl font-semibold'>2km Coverage</div>
            </div>
            <div className='bg-white/20 backdrop-blur-sm p-6 rounded-2xl'>
              <div className='text-4xl mb-4'>🤝</div>
              <div className='text-xl font-semibold'>Community Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6 bg-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full blur-2xl opacity-50 animate-pulse'></div>
          <div className='absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
        </div>

        <div className='relative max-w-4xl mx-auto text-center z-10'>
          <h2 className='text-4xl font-black mb-6 text-gray-900'>Ready to Connect with Your Community?</h2>
          <div className='w-24 h-1 mx-auto mb-8 rounded-full' style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}></div>
          
          <p className='text-xl mb-12 text-gray-600 max-w-3xl mx-auto'>
            Join thousands who've already discovered the power of local professional networking and community support.
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center'>
            <Link 
              to="/signup"
              className='px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden group'
              style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
              <span className='relative z-10'>Join Our Community</span>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            </Link>
            <Link 
              to="/"
              className='border-2 border-purple-600 text-purple-600 px-12 py-6 rounded-full font-bold text-xl hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-110 bg-white hover:shadow-xl group'>
              <span className='group-hover:scale-105 transition-transform duration-300 inline-block'>Explore Platform</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
