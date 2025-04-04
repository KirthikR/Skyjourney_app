import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { identifyUser, trackEvent } from '../../utils/analytics';
import { updateUserSegments } from '../../utils/userSegmentation';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add these two functions to fix the errors
  const loginUser = async (email, password) => {
    // Simulate a login API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any email with password length > 5
        if (email && password.length > 5) {
          resolve({
            success: true,
            user: {
              id: '123456',
              email: email,
              name: email.split('@')[0], // Extract name from email
              loginCount: 1,
              createdAt: new Date().toISOString()
            }
          });
        } else {
          resolve({ success: false });
        }
      }, 800);
    });
  };

  const fetchUserData = async (userId) => {
    // Simulate fetching user data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          bookings: 3,
          lastBookingDate: new Date().toISOString(),
          favoriteDestinations: ['NYC', 'LON', 'TYO'],
          premiumMember: true,
          totalSpent: 2450.75
        });
      }, 300);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Your existing login logic
      const response = await loginUser(email, password);

      if (response.success) {
        // After successful login, identify user in PostHog
        identifyUser(response.user.id, {
          email: response.user.email,
          name: response.user.name,
          loginCount: response.user.loginCount,
          accountCreated: response.user.createdAt
        });

        // Fetch user data for segmentation (from your API)
        const userData = await fetchUserData(response.user.id);

        // Update user segments based on behavior
        updateUserSegments(response.user.id, userData);

        // Track login event
        trackEvent('user_logged_in', {
          login_method: 'email'
        });

        // Navigate after login
        navigate('/');
      } else {
        // Handle login error
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Welcome Back</h1>
          <p>Sign in to access your SkyJourney premium account</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </div>
          </div>

          <div className={styles.formOptions}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Sign In <FaArrowRight className={styles.buttonIcon} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className={styles.authFooter}>
          <p>Don't have an account? <Link to="/signup" className={styles.authLink}>Create Account</Link></p>
        </div>

        <div className={styles.securityNote}>
          <p>
            SkyJourney uses industry-standard encryption to protect your personal information.
            By signing in, you agree to our <Link to="/terms" className={styles.textLink}>Terms</Link> and 
            <Link to="/privacy" className={styles.textLink}> Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;