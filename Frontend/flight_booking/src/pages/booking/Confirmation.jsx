import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/Confirmation.module.css';
import { FaCheckCircle, FaPlane, FaUser, FaCalendar, FaDownload, FaEnvelope, FaHome } from 'react-icons/fa';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking details from state
  const { 
    bookingReference,
    selectedFlight, 
    passengers, 
    totalPrice,
    email = "user@example.com" // Default email if not provided
  } = location.state || {};
  
  // If no booking data is available, redirect to home
  if (!bookingReference || !selectedFlight) {
    setTimeout(() => navigate('/'), 2000);
    return <div className={styles.errorContainer}>Booking data not found. Redirecting...</div>;
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.confirmationHeader}>
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>
        <h1>Booking Confirmed!</h1>
        <p>Your flight has been successfully booked. A confirmation email has been sent to {email}.</p>
        <div className={styles.bookingRef}>
          <span>Booking Reference:</span>
          <strong>{bookingReference}</strong>
        </div>
      </div>
      
      <div className={styles.confirmationCard}>
        <h2>Flight Details</h2>
        
        {selectedFlight.slices.map((slice, index) => (
          <div key={index} className={styles.flightSegment}>
            <div className={styles.segmentHeader}>
              <h3>{index === 0 ? 'Outbound Flight' : 'Return Flight'}</h3>
              <span className={styles.airline}>{selectedFlight.owner.name}</span>
            </div>
            
            <div className={styles.flightRoute}>
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{slice.origin.iata_code}</div>
                <div className={styles.time}>{formatTime(slice.departing_at)}</div>
                <div className={styles.date}>{formatDate(slice.departing_at)}</div>
              </div>
              
              <div className={styles.routeLine}>
                <div className={styles.duration}>
                  {Math.floor(slice.duration / 60)}h {slice.duration % 60}m
                </div>
                <div className={styles.line}></div>
                <FaPlane className={styles.planeIcon} />
              </div>
              
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{slice.destination.iata_code}</div>
                <div className={styles.time}>{formatTime(slice.arriving_at)}</div>
                <div className={styles.date}>{formatDate(slice.arriving_at)}</div>
              </div>
            </div>
          </div>
        ))}
        
        <div className={styles.passengerSection}>
          <h3>Passengers</h3>
          <div className={styles.passengerList}>
            {passengers && passengers.map((passenger, index) => (
              <div key={index} className={styles.passenger}>
                <FaUser className={styles.passengerIcon} />
                <div className={styles.passengerName}>
                  {passenger.firstName} {passenger.lastName}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.totalPrice}>
          <span>Total Paid:</span>
          <strong>{selectedFlight.total_currency} {totalPrice || selectedFlight.total_amount}</strong>
        </div>
      </div>
      
      <div className={styles.nextSteps}>
        <h2>Next Steps</h2>
        
        <div className={styles.stepGrid}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaDownload />
            </div>
            <h3>Download Ticket</h3>
            <p>Save your e-ticket for easy access at the airport</p>
            <button className={styles.stepButton}>
              Download E-Ticket
            </button>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaEnvelope />
            </div>
            <h3>Check Your Email</h3>
            <p>We've sent all your booking details to your email</p>
            <button className={styles.stepButton}>
              Resend Email
            </button>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaCalendar />
            </div>
            <h3>Online Check-in</h3>
            <p>Available 24 hours before your flight</p>
            <button className={styles.stepButton}>
              Set Reminder
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.homeButton} 
          onClick={() => navigate('/')}
        >
          <FaHome /> Return to Homepage
        </button>
      </div>
    </div>
  );
}