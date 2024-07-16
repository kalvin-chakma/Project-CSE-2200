import axios from 'axios';

let isRefreshing = false;

export const refreshTokens = async () => {
  if (isRefreshing) return;
  
  try {
    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const response = await axios.post('https://project-cse-2200.vercel.app/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, jwtToken } = response.data;

    console.log('New Access Token:', accessToken);
    console.log('New Refresh Token:', newRefreshToken);
    console.log('New JWT Token:', jwtToken);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('token', jwtToken);
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    // If refresh fails, clear all tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  } finally {
    isRefreshing = false;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('https://project-cse-2200.vercel.app/auth/login', credentials);
    const { accessToken, refreshToken, jwtToken } = response.data;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('JWT Token:', jwtToken);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('token', jwtToken);

    return { success: true };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};