import React, { useEffect } from 'react';
import { refreshTokens } from '../utils/auth';

const TokenRefresher = () => {
  useEffect(() => {
    const handleStorage = () => {
      refreshTokens();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return null;
};

export default TokenRefresher;
