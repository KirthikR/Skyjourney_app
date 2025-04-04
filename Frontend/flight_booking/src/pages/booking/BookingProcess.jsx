import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from './components/Payment';
import { trackBookingEvent, BOOKING_EVENTS } from '../../utils/analytics';
import styles from './BookingProcess.module.css';

const BookingProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchParams, passengers } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  
  useEffect(() => {
    // Check if we have the necessary data
    if (!flight || !passengers || passengers.length === 0) {
      navigate('/booking', { replace: true });
    }
    
    // Track payment initiated event
    if (flight) {
      trackBookingEvent(BOOKING_EVENTS.PAYMENT_INITIATED, {
        flight_id: flight.id,
        total_amount: flight.price * passengers.length
      });
    }
  }, [flight, passengers, navigate]);
  
  // Calculate total price
  const totalPrice = flight ? flight.price * passengers.length : 0;
  
  // Handle payment submission
  const handlePaymentSubmit = async (paymentDetails) => {
    setLoading(true);
    
    try {
      // In a real app, you would make an API call to process payment here
      
      // For demo purposes, simulate an API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random booking reference
      const reference = 'BK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      setBookingReference(reference);
      
      // Track payment completed event
      trackBookingEvent(BOOKING_EVENTS.PAYMENT_COMPLETED, {
        flight_id: flight.id,
        total_amount: totalPrice,
        payment_method: paymentDetails.cardType
      });
      
      // Track booking confirmed event
      trackBookingEvent(BOOKING_EVENTS.BOOKING_CONFIRMED, {
        flight_id: flight.id,
        booking_reference: reference,
        passenger_count: passengers.length
      });
      
      setBookingComplete(true);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect to confirmation page after successful booking
  useEffect(() => {
    if (bookingComplete && bookingReference) {
      // Navigate to confirmation page
      setTimeout(() => {
        navigate('/confirmation', {
          state: {
            flight,
            passengers,
            bookingReference,
            totalPrice
          }
        });
      }, 2000);
    }
  }, [bookingComplete, bookingReference, navigate, flight, passengers, totalPrice]);
  
  if (!flight) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <div className={styles.bookingProcessContainer}>
      <h2>Complete Your Booking</h2>
      
      <div className={styles.bookingSummary}>
        <h3>Flight Summary</h3>
        
        <div className={styles.flightDetails}>
          <div className={styles.route}>
            <span className={styles.origin}>{flight.origin}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.destination}>{flight.destination}</span>
          </div>
          
          <div className={styles.flightInfo}>
            <p><strong>Date:</strong> {new Date(flight.departureTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {flight.departureTime} - {flight.arrivalTime}</p>
            <p><strong>Airline:</strong> {flight.airline?.name || flight.airline}</p>
            <p><strong>Flight:</strong> {flight.flightNumber}</p>
            <p><strong>Class:</strong> {searchParams?.cabinClass}</p>
          </div>
        </div>
        
        <div className={styles.passengerSummary}>
          <h4>Passengers</h4>
          <ul>
            {passengers.map((passenger, idx) => (
              <li key={idx}>
                {passenger.title} {passenger.firstName} {passenger.lastName} ({passenger.type})
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.priceSummary}>
          <div className={styles.priceRow}>
            <span>Flight price per person:</span>
            <span>${flight.price?.toFixed(2)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Passengers:</span>
            <span>x {passengers.length}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.paymentSection}>
        <h3>Payment Details</h3>
        <PaymentForm 
          amount={totalPrice} 
          onSubmit={handlePaymentSubmit} 
          loading={loading}
          bookingComplete={bookingComplete}
        />
      </div>
    </div>
  );
};

export default BookingProcess;