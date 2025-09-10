import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('jwtToken')) {
            setIsAuthenticated(true);
            // If authenticated and on root, send to Home. Allow access to Login/Register explicitly.
            if (location.pathname === '/') {
                navigate('/Home', { replace: false });
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [location, navigate, setIsAuthenticated])

    return (
        null
    )
}

export default RefrshHandler