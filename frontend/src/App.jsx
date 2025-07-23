
import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './api'
import { login,logout } from './store/authSlice'
import {Footer,Header} from './components/index.js'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()
  console.log(loading)

  useEffect(
    ()=>{getCurrentUser()
      .then((res)=>{
        if(res?.data?.data){
          dispatch(login({userData:res.data.data}))
        }
        else{
          dispatch(logout())
        }
      })
      .catch(() => dispatch(logout()))
      .finally(() => setLoading(false))
    },[]
  )

  //conditional rendering
  return !loading ? (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        
          <main className='flex-1 bg-gradient-to-br from-white via-blue-50 to-indigo-100
' >
            
            <Outlet/>
          </main>
        <Footer />
      </div>
    </>
  ):null
}

export default App
