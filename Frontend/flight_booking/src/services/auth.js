import axios from 'axios';

const AUTH_API = 'http://localhost:3002/auth';
const USER_KEY = 'flight_user';
const TOKEN_KEY = 'flight_token';

// Simple auth service for demo/development purposes

// Helper functions
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuth = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// Auth functions
export const loginWithEmail = async (email, password) => {
  try {
    // For demo purposes, simulating API call
    // In production, this would be a real API call
    if (email && password) {
      // Mock successful login
      const mockUser = { 
        id: Math.random().toString(36).substring(2),
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      
      const mockToken = `mock-token-${Date.now()}`;
      
      setUser(mockUser);
      setToken(mockToken);
      
      return mockUser;
    }
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => {
  clearAuth();
};

export const loginWithGoogle = () => {
  window.open('http://localhost:3002/auth/google', '_self');
};

export const loginWithFacebook = () => {
  window.open('http://localhost:3002/auth/facebook', '_self');
};

export const loginWithApple = () => {
  window.open('http://localhost:3002/auth/apple', '_self');
};

export const loginWithLinkedIn = () => {
  window.open('http://localhost:3002/auth/linkedin', '_self');
};