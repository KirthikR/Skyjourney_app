import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import styles from './Hotel.module.css';

const HotelConfirmation = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.container}>
      <div className={styles.confirmationBox}>
        <div className={styles.confirmationIcon}>
          <FaCheckCircle />
        </div>
        <h1>Booking Confirmed!</h1>
        <p>Your hotel reservation has been successfully confirmed.</p>
        <p>A confirmation email has been sent to your email address.</p>
        
        <div className={styles.bookingDetails}>
          <h2>Booking Details</h2>
          <div className={styles.detailRow}>
            <span>Booking Reference:</span>
            <strong>HB{Math.floor(Math.random() * 1000000)}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Hotel:</span>
            <strong>Luxury Palace Hotel</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Check-in:</span>
            <strong>March 26, 2025</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Check-out:</span>
            <strong>March 30, 2025</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Guests:</span>
            <strong>2 Adults</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Total Amount:</span>
            <strong>$1,156.00</strong>
          </div>
        </div>
        
        <button 
          className={styles.homeButton}
          onClick={() => navigate('/')}
        >
          <FaHome /> Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default HotelConfirmation;