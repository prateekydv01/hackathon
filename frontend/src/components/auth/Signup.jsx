import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {getCurrentUser, registerUser } from '../../api'
import { login as authLogin } from '../../store/authSlice'
import Logo from '../logo'
import { useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"
import AddressAutocomplete from './AdressAutoComplete'

function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState("")
  const [selectedProfession, setSelectedProfession] = useState('')
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState("")
  const [useAddressInput, setUseAddressInput] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const fileInputRef = useRef(null)

  const locationCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          resolve(coords);
        },
        (error) => {
          let errorMessage = "Unable to retrieve location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          reject(new Error(errorMessage));
        }
      );
    });
  }

  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const coords = await locationCoordinates();
        setLocation(coords);
        console.log('Auto location obtained:', coords);
        setLocationError("");
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError("Unable to detect location automatically. Please enter your address below.");
        setUseAddressInput(true);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  const handleAddressSelect = (addressData) => {
    setLocation({
      latitude: addressData.latitude,
      longitude: addressData.longitude
    });
    setSelectedAddress(addressData.address);
    setLocationError("");
    console.log('Manual address selected:', addressData);
  };

  const toggleAddressInput = () => {
    setUseAddressInput(!useAddressInput);
    if (!useAddressInput) {
      // Reset location when switching to address input
      setLocation(null);
      setSelectedAddress("");
    }
  };

  const signup = async (data) => {
    setError("")
    
    if (!location) {
      setError("Location is required. Please either enable location services or select your address.");
      return;
    }

    try {
      const avatarFile = fileInputRef.current?.files?.[0]
      
      if (!avatarFile) {
        setError("Please select a profile picture")
        return
      }

      const formData = new FormData()
      
      formData.append('fullName', data.fullName)
      formData.append('username', data.username)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('profession', data.profession === "Other" ? data.otherProfession : data.profession)
      formData.append('contactNumber', data.contactNumber)
      formData.append('aboutMe', data.aboutMe)
      formData.append('avatar', avatarFile)
      
      // Add location data
      formData.append('location', JSON.stringify(location))

      console.log('Submitting registration with location:', location);

      const session = await registerUser(formData)
      
      if (session) {
        const response = await getCurrentUser()
        const userData = response.data.data
        if (userData) {
          dispatch(authLogin({ userData }))
        }
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
    }
  }

  return (
    <div className='flex justify-center my-10 w-full'>
      <div className='mx-auto bg-white w-full max-w-2xl p-10 rounded-2xl shadow-black/30 shadow-lg'>
        <div className='mb-2 flex justify-center'>
          <span><Logo /></span>
        </div>

        <h1 className='text-center text-2xl font-extrabold text-gray-700 mb-1'>Create Your Account</h1>
        <p className='text-center text-gray-500 text-base'>Already have an Account ?&nbsp;
          <Link to="/login" className='font-medium text-primary text-indigo-700 transition-all hover:underline'>Login</Link>
        </p>
        
        {error && <p className='text-center text-red-500 mt-1 text-sm'>{error}</p>}
        {locationError && <p className='text-center text-yellow-500 mt-1 text-sm'>{locationError}</p>}
        
        {/* Location Status */}
        <div className='text-center mt-2 mb-4'>
          {isLoadingLocation ? (
            <p className='text-blue-500 text-sm'>
              🔄 Getting your location...
            </p>
          ) : location && !useAddressInput ? (
            <div>
              <p className='text-green-600 text-sm'>
                ✅ Location detected
              </p>
            </div>
          ) : location && selectedAddress ? (
            <p className='text-green-600 text-sm'>
              ✅ Address selected
            </p>
          ) : useAddressInput ? (
            <p className='text-orange-500 text-sm'>
              📍 Please search and select your address below
            </p>
          ) : (
            <p className='text-gray-500 text-sm'>
              📍 Location services unavailable
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(signup)} className='mt-6'>
          
          {/* Location Section */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Location Information</h3>
              {!isLoadingLocation && (
                <button
                  type="button"
                  onClick={toggleAddressInput}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {useAddressInput ? 'Use auto-detection' : 'Enter address manually'}
                </button>
              )}
            </div>

            {useAddressInput && (
              <div>
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Start typing your address... (e.g., 123 Main Street, New Delhi)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Type and select from dropdown for accurate coordinates
                </p>
              </div>
            )}
          </div>

          {/* Full Name and Username row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters"
                  }
                })}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Username" 
                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters"
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores"
                  }
                })}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <input 
              type="email" 
              placeholder="Enter Your Email" 
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be valid"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <input 
              type="password" 
              placeholder='Password (minimum 6 characters)' 
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Profession and Contact Number row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
            <div className='w-full'>
              <select 
                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-600'
                {...register("profession", {
                  required: "Profession is required"
                })}
                onChange={(e) => setSelectedProfession(e.target.value)}
                value={selectedProfession}
              >
                <option value="" disabled className='text-gray-400'>Select Profession</option>
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
              {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession.message}</p>}
              
              {selectedProfession === "Other" && (
                <div className="mt-2">
                  <input 
                    type="text" 
                    placeholder="Please specify your profession" 
                    className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                    {...register("otherProfession", {
                      required: selectedProfession === "Other" ? "Please specify your profession" : false
                    })}
                  />
                  {errors.otherProfession && <p className="text-red-500 text-xs mt-1">{errors.otherProfession.message}</p>}
                </div>
              )}
            </div>

            <div>
              <input 
                type="tel" 
                placeholder="Contact Number (10 digits)" 
                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Contact number must be exactly 10 digits"
                  }
                })}
              />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className='mb-3'>
            <div className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200 relative'>
              <span className='text-gray-400 text-sm mr-3'>Profile Picture:</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className='text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer'
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a clear profile picture (JPG, PNG, or GIF)
            </p>
          </div>

          {/* About Me */}
          <div className="mb-3">
            <textarea 
              placeholder="About Me (Tell us about yourself...)" 
              rows="4"
              className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 resize-vertical'
              {...register("aboutMe", {
                required: "About me is required",
                minLength: {
                  value: 10,
                  message: "Please write at least 10 characters about yourself"
                },
                maxLength: {
                  value: 500,
                  message: "About me cannot exceed 500 characters"
                }
              })}
            />
            {errors.aboutMe && <p className="text-red-500 text-xs mt-1">{errors.aboutMe.message}</p>}
          </div>

          <button
            type="submit" 
            disabled={!location || isLoadingLocation}
            className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoadingLocation ? 'Getting Location...' : 
             !location ? 'Please Set Location' : 
             'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
