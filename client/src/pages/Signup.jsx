import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try {
          const response = await axios.post("http://localhost:5000/api/auth/signup",{
            username,email,password
          })
          console.log(response);
          if(response.status===200){
            navigate("/login")
          }
          
        } catch (error) {
          console.log(error);
          
        }
      
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

        <form className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Create a password"
              required
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              onClick={(e)=>handleSubmit(e)}
              className="w-full flex justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-6 flex justify-between items-center">
          <a href='/login'  className="text-sm text-indigo-600 hover:underline">
            Already have an account?
          </a>
          <a href='/login' className="text-sm text-indigo-600 hover:underline">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
