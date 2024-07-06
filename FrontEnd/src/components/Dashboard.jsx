import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        const email = localStorage.getItem('userEmail');
        if (user) setLoggedInUser(user);
        if (email) {
            setUserEmail(email);
        } else {
            console.log('Email not found in localStorage');
            // You might want to fetch the email from your backend here
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userEmail');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/Home');
        }, 1000);
    };

    const handleSuccess = (message) => {
        // Implement your success message handling here
        console.log(message);
    };

    if (!loggedInUser) return <div>Loading...</div>;

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <p><strong>Name:</strong> <span className="text-red-600">{loggedInUser}</span></p>
                <p><strong>Email:</strong> <span className="text-red-600">
                    {userEmail || 'Email not available'}
                </span></p>
            </div>
            <button 
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;