import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingConfirmation.module.css';
import { FaCheck, FaPlane, FaUser, FaHome } from 'react-icons/fa';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  
  useEffect(() => {
    // Check if payment was confirmed
    if (!location.state?.paymentConfirmed) {
      console.log('Payment not confirmed, redirecting to booking');
      navigate('/booking');
      return;
    }

    if (!location.state?.selectedOffer || !location.state?.passengers) {
      console.error('Missing booking data, redirecting to home');
      navigate('/');
      return;
    }
    
    setBookingData({
      flight: location.state.selectedOffer,
      passengers: location.state.passengers,
      paymentMethod: location.state.paymentMethod || 'Credit Card'
    });
    
    // Simulate booking process
    const timer = setTimeout(() => {
      setBookingComplete(true);
      setBookingReference('SKYB' + Math.floor(100000 + Math.random() * 900000));
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.state, navigate]);
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  const getPrimaryPassenger = () => {
    return bookingData?.passengers[0] || {};
  };
  
  if (!bookingData) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.confirmationCard}>
        {!bookingComplete ? (
          <>
            <div className={styles.processingHeader}>
              <div className={styles.spinner}></div>
              <h2>Processing Your Booking</h2>
              <p>Please wait while we confirm your flight reservation...</p>
            </div>
            
            <div className={styles.flightSummary}>
              <div className={styles.summaryRow}>
                <span>Flight:</span>
                <span>
                  {bookingData.flight.slices[0]?.origin?.iata_code || 'N/A'} to {bookingData.flight.slices[0]?.destination?.iata_code || 'N/A'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Airline:</span>
                <span>{bookingData.flight.owner?.name || 'Airline'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Passengers:</span>
                <span>{bookingData.passengers.length}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total:</span>
                <span>{bookingData.flight.total_currency || 'USD'} {bookingData.flight.total_amount || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.successHeader}>
              <div className={styles.checkmarkCircle}>
                <FaCheck className={styles.checkmark} />
              </div>
              <h1>Booking Confirmed!</h1>
              <p>Your flight has been successfully booked</p>
            </div>
            
            <div className={styles.bookingReference}>
              <span>Booking Reference:</span>
              <span className={styles.reference}>{bookingReference}</span>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.flightDetails}>
              <h3><FaPlane className={styles.icon} /> Flight Details</h3>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>From</span>
                  <span className={styles.value}>
                    {bookingData.flight.slices[0]?.origin?.iata_code || 'N/A'} ({bookingData.flight.slices[0]?.origin?.city_name || 'N/A'})
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>To</span>
                  <span className={styles.value}>
                    {bookingData.flight.slices[0]?.destination?.iata_code || 'N/A'} ({bookingData.flight.slices[0]?.destination?.city_name || 'N/A'})
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Airline</span>
                  <span className={styles.value}>{bookingData.flight.owner?.name || 'Airline'}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Flight Number</span>
                  <span className={styles.value}>{bookingData.flight.id?.substring(0, 8) || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.passengerDetails}>
              <h3><FaUser className={styles.icon} /> Primary Passenger</h3>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>
                    {getPrimaryPassenger().title} {getPrimaryPassenger().firstName} {getPrimaryPassenger().lastName}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{getPrimaryPassenger().email}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{getPrimaryPassenger().phone}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Total Passengers</span>
                  <span className={styles.value}>{bookingData.passengers.length}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.label}>Payment Method</span>
                  <span className={styles.value}>
                    {bookingData.paymentMethod === 'creditCard' ? 'Credit Card' : 
                     bookingData.paymentMethod === 'paypal' ? 'PayPal' : 
                     bookingData.paymentMethod === 'applePay' ? 'Apple Pay' : 
                     bookingData.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.nextSteps}>
              <p>A confirmation email has been sent to {getPrimaryPassenger().email}</p>
              <p>Please check your email for your e-ticket and flight details.</p>
            </div>
            
            <button onClick={handleReturnHome} className={styles.homeButton}>
              <FaHome className={styles.icon} /> Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}