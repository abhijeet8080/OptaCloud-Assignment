import React from 'react';

const AuthLayouts = ({ children }) => {
  return (
    <div className='h-[100vh]'>
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <h1 className='text-4xl font-bold text-indigo-600'>
          <span className='text-2xl text-gray-500 font-medium'>Opta</span>Cloud
        </h1>
      </header>
      {children}
    </div>
  );
};

export default AuthLayouts;
