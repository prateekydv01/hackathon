import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './api'
import { login, logout } from './store/authSlice'
import { Footer, Header } from './components/index.js'
import { Outlet } from 'react-router-dom'
import { EmergencyProvider } from './contexts/EmergencyContext' // Add this import
import { ToastContainer } from 'react-toastify' // Add this import
import 'react-toastify/dist/ReactToastify.css' // Add this import

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  console.log(loading)

  useEffect(
    () => {
      getCurrentUser()
        .then((res) => {
          if (res?.data?.data) {
            dispatch(login({ userData: res.data.data }))
            // Store token if available in response
            if (res.data.accessToken) {
              localStorage.setItem('token', res.data.accessToken)
            }
          } else {
            dispatch(logout())
          }
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false))
    }, []
  )

  // Conditional rendering
  return !loading ? (
    <EmergencyProvider> {/* Wrap everything with EmergencyProvider */}
      <div className='flex flex-col min-h-screen'>
        <Header />
        
        <main className='flex-1 bg-gradient-to-br from-white via-blue-50 to-indigo-100'>
          <Outlet />
        </main>
        
        <Footer />
      </div>
      
      {/* Toast notifications for emergency alerts */}
      <ToastContainer
        position="top-center"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </EmergencyProvider>
  ) : (
    // Loading screen
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  )
}

export default App
