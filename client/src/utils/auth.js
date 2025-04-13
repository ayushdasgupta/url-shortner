import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ;

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.email
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};