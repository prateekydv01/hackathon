import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux"
import store from "./store/store.js"
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

//existing pages
import HomePage from './pages/HomePage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import LoginPage from "./pages/LoginPage.jsx"
import MapPage from './pages/Map.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/profilePage.jsx'


// Emergency pages
import EmergencyDashboard from './pages/EmergencyDashboard.jsx'
import EmergencyPage from './pages/EmergencyPage.jsx'
import RouteNavigationPage from './pages/RouteNavigationPage.jsx'

import { Protected } from './components/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: (
          <Protected authentication={false}>
            <LoginPage />
          </Protected>
        ),
      },
      {
        path: '/signup',
        element: (
          <Protected authentication={false}>
            <SignupPage />
          </Protected>
        ),
      },
      {
        path: '/about-us',
        element: <AboutUsPage />,
      },
      {
        path: '/map',
        element: (
          <Protected authentication={true}>
            <MapPage />
          </Protected>
        ),
      },
      {
        path: '/profile',
        element: (
          <Protected authentication={true}>
            <ProfilePage />
          </Protected>
        ),
      },
      {
        path: "/profile/:userId",
        element: (
          <Protected authentication={true}>
            <ProfilePage />
          </Protected>
        ),
      },
      
      // Emergency routes
      {
        path: '/emergency',
        element: (
          <Protected authentication={true}>
            <EmergencyDashboard />
          </Protected>
        ),
      },
      {
        path: '/emergency/create',
        element: (
          <Protected authentication={true}>
            <EmergencyPage />
          </Protected>
        ),
      },
      {
        path: '/emergency/:emergencyId',
        element: (
          <Protected authentication={true}>
            <EmergencyPage />
          </Protected>
        ),
      },
      {
        path: '/emergency/navigate/:emergencyId',
        element: (
          <Protected authentication={true}>
            <RouteNavigationPage />
          </Protected>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
