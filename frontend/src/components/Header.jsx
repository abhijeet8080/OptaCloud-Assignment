import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../store/Reducers/userSlice';
import Avatar from './Avatar';
const AvatarDropdown = ({ onLogout }) => (
  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
    <div className="py-1">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        My Profile
      </Link>
      <Link
        to="/update-profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Update Profile
      </Link>
      <Link
        to="/all-addresses"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        All Addresses
      </Link>
      <button
        onClick={onLogout}
        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  </div>
);

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profile_pic = useSelector((state) => state.user.profile_pic);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    dispatch(logout());
    console.log('User logged out');
    setIsDropdownOpen(false);
    navigate('/email');
  };

  return (
    <div className="navbar bg-base-100 relative">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><Link>Item 1</Link></li>
            <li>
              <Link>Parent</Link>
              <ul className="p-2">
                <li><Link>Submenu 1</Link></li>
                <li><Link>Submenu 2</Link></li>
              </ul>
            </li>
            <li><Link>Item 3</Link></li>
          </ul>
        </div>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <h1 className='text-4xl font-bold text-indigo-600'>
        <Link to={'/'}> <span className='text-2xl text-gray-500 font-medium'>Opta</span>Cloud</Link>
        </h1>
      </header>
      </div>
      <div className="navbar-center space-x-5 hidden lg:flex">
      </div>
      <div className="navbar-end relative">
        {isUserLoggedIn ? (
          <div className="relative">
            <div
              onClick={toggleDropdown}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClose={() => setIsDropdownOpen(false)}
            >
              <Avatar imageUrl={profile_pic} />
            </div>
            {isDropdownOpen && <AvatarDropdown onLogout={handleLogout} />}
          </div>
        ) : (
          <Link to="/email" className="btn">Log In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
