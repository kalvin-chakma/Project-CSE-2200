import React, { useEffect } from 'react';
import { refreshTokens } from '../utills/auth';

const TokenRefresher = () => {
  useEffect(() => {
    const handleStorage = (event) => {
      // Check if any of the tokens were removed
      if (
        (event.key === 'accessToken' || event.key === 'refreshToken' || event.key === 'token') 
        && event.newValue === null
      ) {
        console.log('Token removed, refreshing...');
        refreshTokens();
      }
    };

    window.addEventListener('storage', handleStorage);

    // Optionally, you can add a periodic check
    const checkTokens = setInterval(() => {
      if (!localStorage.getItem('accessToken') || !localStorage.getItem('token')) {
        refreshTokens();
      }
    }, 600); // Check every minute

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(checkTokens);
    };
  }, []);

  return null;
};

export default TokenRefresher;