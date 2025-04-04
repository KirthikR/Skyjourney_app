import React, { useState } from 'react';
import { FaGoogle, FaFacebook, FaApple, FaLinkedin } from 'react-icons/fa';
import styles from '../styles/LoginModal.module.css';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  loginWithApple,
  loginWithLinkedIn
} from '../services/auth';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const user = await loginWithEmail(formData.email, formData.password);
      handleLoginSuccess(user);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    switch(provider) {
      case 'Google':
        loginWithGoogle();
        break;
      case 'Facebook':
        loginWithFacebook();
        break;
      case 'Apple':
        loginWithApple();
        break;
      case 'LinkedIn':
        loginWithLinkedIn();
        break;
      default:
        console.error('Unknown provider:', provider);
    }
  };

  const handleLoginSuccess = (user) => {
    // Your existing login success logic
    
    // Identify the user in PostHog
    if (window.posthog) {
      window.posthog.identify(
        user.id, // Unique user ID
        {
          email: user.email,
          name: user.name,
          account_type: user.accountType,
          signup_date: user.signupDate,
        }
      );
      
      console.log('User identified in PostHog:', user.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2>Login</h2>
        <p className={styles.subtitle}>Get the full experience</p>
        
        <div className={styles.socialButtons}>
          <button 
            onClick={() => handleSocialLogin('Google')}
            className={`${styles.socialButton} ${styles.google}`}
          >
            <FaGoogle /> Continue with Google
          </button>
          <button 
            onClick={() => handleSocialLogin('Facebook')}
            className={`${styles.socialButton} ${styles.facebook}`}
          >
            <FaFacebook /> Continue with Facebook
          </button>
          <button 
            onClick={() => handleSocialLogin('Apple')}
            className={`${styles.socialButton} ${styles.apple}`}
          >
            <FaApple /> Continue with Apple
          </button>
          <button 
            onClick={() => handleSocialLogin('LinkedIn')}
            className={`${styles.socialButton} ${styles.linkedin}`}
          >
            <FaLinkedin /> Continue with LinkedIn
          </button>
        </div>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="rememberMe">🔄 Remember me</label>
          </div>

          <div className={styles.forgotPassword}>
            <a href="#">🔑 Forgot Password?</a>
          </div>

          <button type="submit" className={styles.loginButton}>
            {isLoading ? 'Loading...' : '✉️ Continue with Email'}
          </button>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.termsText}>
            By continuing you agree to flight booking{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </div>

          <div className={styles.benefits}>
            <p>💰 Track prices</p>
            <p>✈️ Make trip planning easier</p>
            <p>⚡ Enjoy faster booking</p>
          </div>
        </form>
      </div>
    </div>
  );
}