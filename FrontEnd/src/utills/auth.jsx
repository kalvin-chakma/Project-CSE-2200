import axios from 'axios';

export const refreshTokens = async () => {
  try {
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
  }
};
