import React, { useState, useEffect,useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getNearbyUsers } from '../api'
import { Logo } from '../components'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { 
  fetchNearbyUsers, 
  setSelectedProfession,
  selectNearbyUsers, 
  selectNearbyUsersLoading, 
  selectNearbyUsersError,
  selectSelectedProfession 
} from '../store/nearbyUsersSlice';

function Home() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status)
  const user = useSelector((state) => state.auth.userData)
  const [searchTerm, setSearchTerm] = useState('')
  const [nearbyProfessionals, setNearbyProfessionals] = useState([])
  const dispatch = useDispatch();
  const nearbyUsers = useSelector(selectNearbyUsers);
  const loading = useSelector(selectNearbyUsersLoading);
  const error = useSelector(selectNearbyUsersError);
  const selectedProfession = useSelector(selectSelectedProfession);


  // Local search term state (since it's not in Redux)
const [localSearchTerm, setLocalSearchTerm] = useState('');

// Client-side filtering
const filteredUsers = useMemo(() => {
  let filtered = nearbyUsers;

  // Filter by search term (name or profession)
  if (localSearchTerm.trim()) {
    const searchLower = localSearchTerm.toLowerCase();
    filtered = filtered.filter(user => 
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.profession?.toLowerCase().includes(searchLower) ||
      user.aboutMe?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}, [nearbyUsers, localSearchTerm]);

// Fetch users on component mount
useEffect(() => {
  if (authStatus) {
    dispatch(fetchNearbyUsers({ profession: 'all' }));
  }
}, [authStatus, dispatch]);


  const sendEmergencyAlert = () => {
    alert('Emergency alert sent to nearby users within 2km radius!')
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Full Screen Hero Section */}
      {!authStatus&&(<section className='relative h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex items-center'>
        {/* Enhanced Animated Background Elements */}
        <div className='absolute inset-0'>
          {/* Large floating orbs */}
          <div className='absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse' style={{ animationDelay: '1s' }}></div>
          
          {/* Medium floating elements */}
          <div className='absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-2xl rotate-45 opacity-25 animate-bounce' style={{ animationDelay: '0.5s' }}></div>
          <div className='absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-300 to-blue-300 rounded-full opacity-30 animate-bounce' style={{ animationDelay: '1.5s' }}></div>
          
          {/* Small animated dots */}
          <div className='absolute top-1/2 left-1/3 w-8 h-8 bg-purple-400 rounded-full opacity-40 animate-ping'></div>
          <div className='absolute top-1/4 right-1/3 w-6 h-6 bg-indigo-400 rounded-full opacity-30 animate-ping' style={{ animationDelay: '0.8s' }}></div>
          <div className='absolute bottom-1/4 left-1/2 w-10 h-10 bg-blue-400 rounded-full opacity-20 animate-ping' style={{ animationDelay: '1.2s' }}></div>
          
          {/* Floating geometric shapes */}
          <div className='absolute top-16 right-16 w-20 h-20 border-4 border-purple-300 rounded-lg rotate-12 opacity-20 animate-spin' style={{ animationDuration: '10s' }}></div>
          <div className='absolute bottom-16 left-16 w-16 h-16 border-3 border-indigo-300 rounded-full opacity-25 animate-spin' style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
          
          {/* Gradient waves */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent animate-pulse' style={{ animationDuration: '4s' }}></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 w-full'>
          <div className='text-center'>
            {/* <div className='mb-8 transform hover:scale-105 transition-transform duration-300'>
              <Logo />
            </div> */}
            
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black text-gray-800 mb-8 tracking-tight'>
              <span className='block animate-fade-in-up'>Find Local Professionals</span>
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mt-4 animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
                Within 5KM Radius
              </span>
            </h1>
            
            <p className='text-xl md:text-3xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
              {authStatus 
                ? `Welcome back, ${user?.fullName || 'User'}! Find trusted professionals in your neighborhood or send emergency alerts when needed.`
                : 'Connect with trusted doctors, plumbers, electricians, teachers and more in your neighborhood. Get help fast with our emergency alert system.'
              }
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up' style={{ animationDelay: '0.6s' }}>
              {!authStatus ? (
                <>
                  <Link 
                    to="/signup" 
                    className='group px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden'
                    style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                    <span className='relative z-10 flex items-center justify-center gap-3'>
                      Get Started Free
                      <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
                    </span>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  </Link>
                  <Link 
                    to="/about-us" 
                    className='group border-3 border-purple-600 text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-110 bg-white/90 backdrop-blur-sm hover:shadow-2xl'>
                    <span className='group-hover:scale-105 transition-transform duration-300 inline-block'>Learn More</span>
                  </Link>
                </>
              ) : (
                <div className='flex flex-col sm:flex-row gap-6'>
                  <button 
                    onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                    className='group px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden'
                    style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                    <span className='relative z-10 flex items-center justify-center gap-3'>
                      🔍 Find Professionals
                      <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
                    </span>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  </button>
                  <button 
                    onClick={sendEmergencyAlert}
                    className='bg-gradient-to-r from-red-600 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-red-700 hover:to-pink-700 transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl relative overflow-hidden group'>
                    <span className='relative z-10 flex items-center justify-center gap-3'>
                      🚨 Emergency Alert
                    </span>
                    <div className='absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>)}

      {/* Search Section - Only show if authenticated */}
       {authStatus && (
  <section id="search-section" className='py-20 px-6 bg-white relative overflow-hidden'>
    <div className='absolute inset-0 opacity-20'>
      <div className='absolute top-10 right-20 w-20 h-20 bg-purple-100 rounded-full blur-lg animate-pulse'></div>
      <div className='absolute bottom-10 left-20 w-16 h-16 bg-indigo-100 rounded-full blur-md animate-pulse' style={{ animationDelay: '1s' }}></div>
    </div>
    
    <div className='max-w-6xl mx-auto relative z-10'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-black text-gray-900 mb-4'>What Service Do You Need?</h2>
        <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mb-6 rounded-full'></div>
        <p className='text-xl text-gray-600'>Search for professionals in your area</p>
      </div>

      <div className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500'>
        <div className='flex flex-col md:flex-row gap-4 max-w-4xl mx-auto'>
          <div className='flex-1'>
            <input 
              type="text" 
              placeholder="Search by name or profession..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className='w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-lg transition-all duration-300 hover:border-purple-300'
            />
          </div>
          <div>
            <select 
              value={selectedProfession}
              onChange={(e) => dispatch(setSelectedProfession(e.target.value))}
              className='px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-lg bg-white transition-all duration-300 hover:border-purple-300'>
              <option value="" disabled className='text-gray-400'>Select Profession</option>
              <option value="all">All Professionals</option>
              <option value="Accountant">Accountant</option>
              <option value="Barber">Barber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Chef">Chef</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Doctor">Doctor</option>
              <option value="Driver">Driver</option>
              <option value="Electrician">Electrician</option>
              <option value="Engineer">Engineer</option>
              <option value="Gardener">Gardener</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Maid">Maid</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Musician">Musician</option>
              <option value="Nurse">Nurse</option>
              <option value="Painter">Painter</option>
              <option value="Photographer">Photographer</option>
              <option value="Plumber">Plumber</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Tutor">Tutor</option>
              <option value="Waiter">Waiter</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button 
            onClick={() => dispatch(fetchNearbyUsers({ profession: selectedProfession }))}
            disabled={loading}
            className='px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 disabled:opacity-50 relative overflow-hidden group'
            style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
            <span className='relative z-10'>
              {loading ? '🔄 Searching...' : '🔍 Search'}
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className='mt-16'>
        <h3 className='text-2xl font-bold text-gray-800 mb-8'>
          {loading ? 'Searching...' : `Found ${filteredUsers.length} professionals nearby`}
        </h3>
        
        {error && (
          <div className='bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md'>
            <p className='font-semibold'>Error: {error}</p>
            <button 
              onClick={() => dispatch(fetchNearbyUsers({ profession: selectedProfession }))}
              className='mt-2 text-sm underline hover:no-underline transition-all duration-300 hover:text-red-800'>
              Try again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className='flex flex-col gap-6'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className='bg-gray-200 animate-pulse p-8 rounded-2xl h-32'></div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {filteredUsers.map((professional) => (
              <div key={professional._id} className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 group relative overflow-hidden'>
                {/* Background Gradient */}
                <div className='absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                
                <div className='relative z-10'>
                  <div className='flex flex-col lg:flex-row items-start lg:items-center gap-6'>
                    {/* Profile Section */}
                    <div className='flex items-start gap-6 flex-1'>
                      {/* ✅ Clickable Avatar */}
                      <div className='relative flex-shrink-0'>
                        <img 
                          src={professional.avatar || 'https://via.placeholder.com/80x80?text=User'} 
                          alt={professional.fullName}
                          className='w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all duration-300 shadow-lg cursor-pointer hover:scale-105'
                          onClick={() => navigate(`/profile/${professional._id}`)}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=User'
                          }}
                        />
                      </div>
                      
                      <div className='flex-1 min-w-0'>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-3'>
                          {/* ✅ Clickable Name */}
                          <h4 
                            className='text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 cursor-pointer hover:underline'
                            onClick={() => navigate(`/profile/${professional._id}`)}>
                            {professional.fullName}
                          </h4>
                          <div className='flex items-center gap-2'>
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors duration-300'>
                              {professional.profession}
                            </span>
                          </div>
                        </div>
                        
                        {/* About Section with View Full Profile */}
                        <div className='mb-4'>
                          <p className='text-gray-600 text-lg leading-relaxed'>
                            {professional.aboutMe ? (
                              <>
                                {professional.aboutMe.slice(0, 40)}
                                {professional.aboutMe.length > 40 && (
                                  <>
                                    ... 
                                    <button 
                                      onClick={() => navigate(`/profile/${professional._id}`)}
                                      className='text-xs text-purple-600 hover:text-purple-800 font-semibold ml-1 underline hover:no-underline transition-all duration-300'>
                                      view full profile
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                Experienced professional service provider in your area. Ready to help with quality services... 
                                <button 
                                  onClick={() => navigate(`/profile/${professional._id}`)}
                                  className='text-purple-600 hover:text-purple-800 font-semibold ml-1 underline hover:no-underline transition-all duration-300'>
                                  view full profile
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0'>
                      <button 
                        onClick={() => navigate(`/chat/${professional._id}`)}
                        className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2'>
                        <span className='text-lg'>💬</span>
                        Chat Now
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (professional.contactNumber) {
                           window.location.href = `tel:${professional.contactNumber}`;
                          }
                        }}
                        className='px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2'
                        disabled={!professional.contactNumber}>
                        <span className='text-lg'>📞</span>
                        Call Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className='text-center py-12 bg-gray-50 rounded-2xl'>
            <div className='text-6xl mb-4 animate-bounce'>🔍</div>
            <h3 className='text-2xl font-bold text-gray-800 mb-2'>No professionals found</h3>
            <p className='text-gray-600'>Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>
    </div>
  </section>
)}


      {/* Popular Services */}
        {authStatus && (
                <section className='py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden'>
                  <div className='absolute inset-0'>
                    <div className='absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-30 animate-pulse'></div>
                    <div className='absolute bottom-20 right-10 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div className='max-w-7xl mx-auto relative z-10'>
                    <div className='text-center mb-16'>
                      <h2 className='text-4xl font-black text-gray-900 mb-4'>Popular Services</h2>
                      <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full'></div>
                      <p className='text-xl text-gray-600'>Most requested professionals in your area</p>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
                      {[
                        { icon: "👨‍⚕️", name: "Doctor", profession: "Doctor" },
                        { icon: "🔧", name: "Plumber", profession: "Plumber" },
                        { icon: "⚡", name: "Electrician", profession: "Electrician" },
                        { icon: "👨‍🏫", name: "Teacher", profession: "Teacher" },
                        { icon: "🧹", name: "Cleaner", profession: "Cleaner" },
                        { icon: "✂️", name: "Barber", profession: "Barber" }
                      ].map((service, index) => (
                        <div 
                          key={index} 
                          onClick={() => {
                            dispatch(setSelectedProfession(service.profession));
                            dispatch(fetchNearbyUsers({ profession: service.profession }));
                            // Scroll to search section
                            document.getElementById('search-section')?.scrollIntoView({ 
                              behavior: 'smooth' 
                            });
                          }}
                          className='bg-white p-6 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:border-purple-200 cursor-pointer relative overflow-hidden'>
                          <div className='relative z-10'>
                            <div className='text-5xl mb-4 group-hover:scale-125 transition-transform duration-500'>{service.icon}</div>
                            <h3 className='font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-700 transition-colors duration-300'>{service.name}</h3>
                            <p className='text-purple-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                              {loading && selectedProfession === service.profession ? 'Searching...' : 'Click to search'}
                            </p>
                          </div>
                          
                          {/* Loading indicator for active profession */}
                          {loading && selectedProfession === service.profession && (
                            <div className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl'>
                              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}


      {/* How It Works area when not logined*/}
      {!authStatus && (
        <section className='py-20 px-6 bg-white relative overflow-hidden'>
          <div className='absolute inset-0'>
            <div className='absolute top-10 left-1/4 w-20 h-20 bg-purple-100 rounded-full blur-lg opacity-30 animate-pulse'></div>
            <div className='absolute bottom-10 right-1/4 w-16 h-16 bg-indigo-100 rounded-full blur-md opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className='max-w-6xl mx-auto relative z-10'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-black text-gray-900 mb-4'>How It Works</h2>
              <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mb-6 rounded-full'></div>
              <p className='text-xl text-gray-600'>Get connected in three simple steps</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              {[
                {
                  step: "1",
                  title: "Search & Browse",
                  description: "Find professionals by service type or browse by location within 5km radius",
                  icon: "🔍"
                },
                {
                  step: "2",
                  title: "View Profiles",
                  description: "Check ratings, reviews, contact info and availability of professionals",
                  icon: "👤"
                },
                {
                  step: "3",
                  title: "Connect & Hire",
                  description: "Contact directly through our platform and get your work done safely",
                  icon: "🤝"
                }
              ].map((item, index) => (
                <div key={index} className='text-center group relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  <div className='relative z-10 p-6'>
                    <div className='w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl text-white shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden'
                         style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                      <span className='relative z-10'>{item.icon}</span>
                      <div className='absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300'>{item.title}</h3>
                    <p className='text-gray-600 text-lg leading-relaxed'>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Alert Feature */}
      <section className='py-20 px-6 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse'></div>
          <div className='absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
          <div className='absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full blur-xl animate-ping'></div>
        </div>
        
        <div className='max-w-6xl mx-auto text-center relative z-10'>
          <div className='text-7xl mb-8 animate-pulse'>🚨</div>
          <h2 className='text-4xl font-black mb-6'>Emergency? Get Help Instantly!</h2>
          <div className='w-32 h-1 bg-white mx-auto mb-8 rounded-full'></div>
          <p className='text-xl mb-12 max-w-3xl mx-auto opacity-95'>
            Our emergency alert system notifies all users within 2km radius. 
            Community members can provide immediate assistance when you need it most.
          </p>
          
         
          {authStatus ? (
            <button 
              onClick={() => navigate("/emergency")}
              className='bg-white text-red-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 relative overflow-hidden group'>
              <span className='relative z-10'>🚨 Send Emergency Alert</span>
              <div className='absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            </button>
          ) : (
            <Link 
              to="/signup"
              className='bg-white text-red-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 inline-block relative overflow-hidden group'>
              <span className='relative z-10'>Join for Emergency Support</span>
              <div className='absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            </Link>
          )}
        </div>
      </section>

       {/* Join our community area */}
      <section className='py-20 px-6 bg-white relative overflow-hidden'>

        {/* animation */}
        <div className='absolute inset-0'>
          <div className='absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full blur-2xl opacity-50 animate-pulse'></div>
          <div className='absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-40 animate-pulse' style={{ animationDelay: '1s' }}></div>
          <div className='absolute top-1/2 left-1/3 w-8 h-8 bg-purple-300 rounded-full opacity-20 animate-bounce'></div>
        </div>

       
        <div className='relative max-w-4xl mx-auto text-center z-10'>
          <h2 className='text-4xl font-black mb-6 text-gray-900'>Join Your Local Community Today!</h2>
          <div className='w-24 h-1 mx-auto mb-8 rounded-full animate-pulse' style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}></div>
          
          <p className='text-xl mb-12 text-gray-600 max-w-3xl mx-auto'>
            Whether you need services or provide them, our platform connects you with your neighborhood.
          </p>

          {!authStatus ? (
            <div className='flex flex-col sm:flex-row gap-6 justify-center'>
              <Link 
                to="/signup"
                className='px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden group'
                style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                <span className='relative z-10'>Sign Up Free</span>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </Link>
              <Link 
                to="/login"
                className='border-2 border-purple-600 text-purple-600 px-12 py-6 rounded-full font-bold text-xl hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-110 bg-white hover:shadow-xl group'>
                <span className='group-hover:scale-105 transition-transform duration-300 inline-block'>Sign In</span>
              </Link>
            </div>
          ) : (
            <div className='flex flex-col sm:flex-row gap-6 justify-center'>
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className='px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-white relative overflow-hidden group'
                style={{ background: 'linear-gradient(145deg, #667EEA 0%, #6B46C1 100%)' }}>
                <span className='relative z-10'>🔍 Find More Professionals</span>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </button>
              <button className='border-2 border-purple-600 text-purple-600 px-12 py-6 rounded-full font-bold text-xl hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-110 bg-white hover:shadow-xl group'>
                <span className='group-hover:scale-105 transition-transform duration-300 inline-block'>📍 Update Location</span>
              </button>
            </div>
          )}

        </div>

      </section>
    </div>
  )
}

export default Home
