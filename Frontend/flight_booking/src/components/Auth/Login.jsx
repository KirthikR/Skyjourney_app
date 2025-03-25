import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // This would normally validate with your backend
      if (formData.email && formData.password) {
        // Login success
        console.log('Login successful:', formData);
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 1500);
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
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
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
                checked={formData.rememberMe}
                onChange={handleChange}
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