import React from 'react'
import { useDispatch } from "react-redux"
import { logout } from '../../store/authSlice'
import { logoutUser } from '../../api'

function LogoutButton({ className = "" }) {
  const dispatch = useDispatch()

  const logoutHandler = () => {
    logoutUser()
      .then(() => dispatch(logout()))
      .catch((err) => console.error("Error while logging out:", err))

    console.log("logout done")
  }

  return (
    <button
      className={`inline-block px-6 py-2  hover:bg-red-500/80 
                 border border-white/20 hover:border-red-300
                 backdrop-blur-sm transition-all duration-300 
                 hover:scale-105 active:scale-95 hover:shadow-lg
                 group  rounded-full ${className}`}
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutButton
