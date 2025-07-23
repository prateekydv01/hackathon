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
import ChatPage from './pages/ChatPage.jsx'

// Emergency System Pages
import Dashboard from './pages/Dashboard.jsx'
import EmergencyHistory from './pages/EmergencyHistory.jsx'
import NearbyEmergencies from './pages/NearbyEmergencies.jsx'

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
      // Emergency System Routes
      {
        path: '/emergency',
        element: (
          <Protected authentication={true}>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: '/emergency/dashboard',
        element: (
          <Protected authentication={true}>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: '/emergency/history',
        element: (
          <Protected authentication={true}>
            <EmergencyHistory />
          </Protected>
        ),
      },
      {
        path: '/emergency/nearby',
        element: (
          <Protected authentication={true}>
            <NearbyEmergencies />
          </Protected>
        ),
      },
      // In your main.jsx, add the chat route
{
  path: '/chat',
  element: (
    <Protected authentication={true}>
      <ChatPage />
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
