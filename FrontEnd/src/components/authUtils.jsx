import { useNavigate } from 'react-router-dom';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const navigate = useNavigate();

  if (!refreshToken) {
    navigate("/LogInPage");
    return null;
  }

  try {
    const url = "https://project-cse-2200.vercel.app/auth/refresh-token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return result.accessToken;
    } else {
      navigate("/LogInPage");
      return null;
    }
  } catch (err) {
    console.error('Token refresh error:', err);
    navigate("/LogInPage");
    return null;
  }
};

export const logout = async () => {
  const navigate = useNavigate();
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const url = "https://project-cse-2200.vercel.app/auth/logout";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('userEmail');
      navigate("/LogInPage");
    } else {
      alert(result.message);
    }
  } catch (err) {
    alert(err.message);
    console.error('Logout error:', err);
  }
};