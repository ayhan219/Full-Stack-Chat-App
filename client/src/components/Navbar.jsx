import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); 

    const handleLogout = async () => {
        setUser(null);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/logout", {}, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200) {
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='w-full h-24 bg-[#18212F] text-white flex items-center justify-between px-4 sm:px-10 z-50'>
            <Link to={"/chat"}><div className='text-3xl font-bold'>
                Chat Site
            </div></Link>
            <div className='hidden md:flex space-x-4'> {/* Show for medium screens and above */}
                {user && <Link to={"/profile"}><button className='w-12 sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Profile</button></Link>}
                {user !== null ? <Link to={"/chat"}><button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Chat</button></Link> : <Link to="/login">
                    <button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Login</button>
                </Link>}
                {user !== null ? <button onClick={handleLogout} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Logout</button> : <Link to="/signup">
                    <button className='bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Sign Up</button>
                </Link>}
            </div>
            {/* Mobile menu button */}
            <div className='md:hidden flex items-center'>
                <button onClick={() => setIsOpen(!isOpen)} className='text-3xl'>
                    {isOpen ? '✖' : '☰'} {/* Hamburger icon */}
                </button>
            </div>
            {/* Mobile menu */}
            {isOpen && (
                <div className='absolute top-24 left-0 w-full bg-[#18212F] md:hidden'>
                    <div className='flex flex-col space-y-2 px-4 py-2'>
                        {user && <Link to={"/profile"}><button className='bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Profile</button></Link>}
                        {user !== null ? <Link to={"/chat"}><button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Chat</button></Link> : <Link to="/login">
                            <button className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Login</button>
                        </Link>}
                        {user !== null ? <button onClick={handleLogout} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Logout</button> : <Link to="/signup">
                            <button className='bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-300'>Sign Up</button>
                        </Link>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
