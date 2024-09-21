import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const NotLoginHeader = () => {
  return (
    <div className='w-full h-screen bg-[url("https://plus.unsplash.com/premium_photo-1676057060928-c717a8e96784?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover bg-no-repeat flex flex-col items-center justify-center text-white'>
      <div className='text-4xl mb-4 font-bold'>
        If you want to chat, please log in or sign up
      </div>
      <div className='flex space-x-4'>
        <Link to="/login">
          <button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className='bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotLoginHeader;
