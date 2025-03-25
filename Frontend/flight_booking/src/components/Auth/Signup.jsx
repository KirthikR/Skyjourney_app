import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaCheckCircle } from 'react-icons/fa';
import styles from './Auth.module.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [step, setStep] = useState(1);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This would normally connect to your backend
    console.log('Signup form submitted:', formData);
    nextStep();
  };
  
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {step === 1 && (
          <>
            <div className={styles.authHeader}>
              <h1>Create Your Account</h1>
              <p>Join SkyJourney for exclusive premium travel experiences</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <div className={styles.inputWithIcon}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Your first name"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <div className={styles.inputWithIcon}>
                    <FaIdCard className={styles.inputIcon} />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Your last name"
                    />
                  </div>
                </div>
              </div>
              
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
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton}>
                  Continue
                </button>
              </div>
            </form>
            
            <div className={styles.authFooter}>
              <p>Already have an account? <Link to="/login" className={styles.authLink}>Sign In</Link></p>
            </div>
          </>
        )}
        
        {step === 2 && (
          <>
            <div className={styles.authHeader}>
              <h1>Secure Your Account</h1>
              <p>Create a strong password to protect your SkyJourney experience</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Create Password</label>
                <div className={styles.inputWithIcon}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a secure password"
                    minLength="8"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <div className={styles.inputWithIcon}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              
              <div className={styles.passwordRequirements}>
                <p>Password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? styles.fulfilled : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? styles.fulfilled : ''}>
                    At least one uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? styles.fulfilled : ''}>
                    At least one number
                  </li>
                </ul>
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.secondaryButton} onClick={prevStep}>
                  Back
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={
                    !formData.password || 
                    formData.password !== formData.confirmPassword ||
                    formData.password.length < 8 ||
                    !/[A-Z]/.test(formData.password) ||
                    !/[0-9]/.test(formData.password)
                  }
                >
                  Create Account
                </button>
              </div>
            </form>
          </>
        )}
        
        {step === 3 && (
          <div className={styles.successStep}>
            <div className={styles.successIcon}>
              <FaCheckCircle />
            </div>
            <h1>Account Created Successfully!</h1>
            <p>Welcome to SkyJourney Premium. You can now access exclusive travel experiences and personalized services.</p>
            <Link to="/login" className={styles.primaryButton}>
              Sign In to Your Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;