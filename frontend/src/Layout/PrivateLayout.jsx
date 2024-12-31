import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    if (!token) {
        // If the user is not logged in, redirect to the login page or another page
        return <Navigate to="/email" />;
    }

    // If logged in, render the child components (protected routes)
    return (
        <>
            <Header/>
            {children}
            <Footer />
        </>
    );
};

export default PrivateRoute;
