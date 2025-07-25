import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { getCurrentUser, loginUser,logoutUser } from '../../api'
import { login as authLogin } from '../../store/authSlice'
import Logo from '../Logo'
import { useDispatch } from 'react-redux'
import {useForm} from "react-hook-form"

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {register,handleSubmit} =useForm()
  const [error,setError] = useState("")

  const login = async (data)=>{
    setError("")
    try {
      const session = await loginUser(data)
      if(session){
        const response = await getCurrentUser()
        const userData = response.data.data
        if(userData)
        {dispatch(authLogin({userData}))}
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
    }
  }

  return (
    <div className='flex justify-center my-20 w-full'>
      <div className='mx-auto  bg-white w-full max-w-lg p-10 rounded-2xl shadow-black/30 shadow-lg '>
        <div className='mb-2 flex  justify-center '>
          {/* <span className='bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2'><Logo></Logo></span> */}
        </div>

        <h1 className='text-center text-2xl font-extrabold text-gray-700 mb-1'>Login to Your Account</h1>
        <p className='text-center text-gray-500 text-base'>Don't have Account ?&nbsp;
          <Link to="/signup" className='font-medium text-primary text-indigo-700 transition-all hover:underline '>Signup</Link>
           </p>
           {console.log(error)}
           {error&&<p className='text-center text-red-500 mt-1'>{error} </p>}
           
           <form onSubmit={handleSubmit(login)} className='mt-8'>
            <input type="text" label="email:" placeholder="Enter Your Email " className='mb-3 w-full space-y-5w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'

            {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email address must be valid"
                  }})}
            />
            <input type="password" label="Password" placeholder='Password' className='mb-1 w-full space-y-5w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400'
            {...register("password",{
              required:"Password is required"
            })}
            />
            <div className='text-end mr-2'>
              <Link to={"/forgetPassword"} className=" text-sm text-indigo-700 hover:underline hover:text-indigo-900 transition duration-200">Forget Password?</Link>
            </div>

            <button
            type="submit" 
            className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              Login
            </button>
           </form>
      </div>
     
    </div>
  )
}

export default Login