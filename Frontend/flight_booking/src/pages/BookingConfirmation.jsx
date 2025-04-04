import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaPlane, FaCalendar, FaUser } from 'react-icons/fa';
import styles from './BookingConfirmation.module.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  
  useEffect(() => {
    if (!location.state?.bookingReference) {
      console.log("No booking reference found, redirecting");
      navigate('/flights');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Handle multiple possible data formats
    if (location.state?.bookingDetails) {
      // Use booking details directly if provided
      setBookingDetails(location.state.bookingDetails);
    } else if (location.state?.selectedOffer && location.state?.passengers) {
      // Create booking details from offer and passenger data
      const offer = location.state.selectedOffer;
      const passengers = location.state.passengers;
      
      setBookingDetails({
        bookingId: `BK${Math.floor(Math.random() * 1000000)}`,
        airline: offer.owner?.name || 'Airline',
        departureCode: offer.slices[0]?.origin?.iata_code || 'N/A',
        departureCity: offer.slices[0]?.origin?.city_name || 'Departure City',
        arrivalCode: offer.slices[0]?.destination?.iata_code || 'N/A',
        arrivalCity: offer.slices[0]?.destination?.city_name || 'Arrival City',
        departureDate: formatDate(offer.slices[0]?.segments[0]?.departing_at),
        departureTime: formatTime(offer.slices[0]?.segments[0]?.departing_at),
        arrivalDate: formatDate(offer.slices[0]?.segments[0]?.arriving_at),
        arrivalTime: formatTime(offer.slices[0]?.segments[0]?.arriving_at),
        passengerName: `${passengers[0]?.firstName || ''} ${passengers[0]?.lastName || ''}`,
        totalAmount: offer.total_amount,
        currency: offer.total_currency,
        paymentMethod: location.state?.paymentMethod || 'Credit Card'
      });
    } else {
      // Fallback to demo data if nothing is provided
      setBookingDetails({
        bookingId: 'DEMO12345',
        airline: 'Demo Airlines',
        departureCode: 'JFK',
        departureCity: 'New York',
        arrivalCode: 'LAX',
        arrivalCity: 'Los Angeles',
        departureDate: '2025-03-25',
        departureTime: '10:00 AM',
        arrivalDate: '2025-03-25',
        arrivalTime: '1:30 PM',
        passengerName: 'John Doe',
        totalAmount: '349.99',
        currency: 'USD',
        paymentMethod: 'Credit Card'
      });
    }
  }, [location]);
  
  if (!bookingDetails) {
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
        <div className={styles.successHeader}>
          <div className={styles.checkmarkCircle}>
            <FaCheckCircle className={styles.checkmark} />
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your flight has been successfully booked.</p>
        </div>
        
        <div className={styles.bookingReference}>
          <span>Booking Reference:</span>
          <span className={styles.reference}>{bookingDetails.bookingId}</span>
        </div>
        
        <div className={styles.flightDetails}>
          <h3><FaPlane className={styles.icon} /> Flight Details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Airline</span>
              <span className={styles.value}>{bookingDetails.airline}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Flight</span>
              <span className={styles.value}>{bookingDetails.airline.substring(0, 2).toUpperCase()}{Math.floor(Math.random() * 1000) + 1000}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>From</span>
              <span className={styles.value}>{bookingDetails.departureCode} - {bookingDetails.departureCity}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>To</span>
              <span className={styles.value}>{bookingDetails.arrivalCode} - {bookingDetails.arrivalCity}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Departure</span>
              <span className={styles.value}>{bookingDetails.departureDate} at {bookingDetails.departureTime}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Arrival</span>
              <span className={styles.value}>{bookingDetails.arrivalDate} at {bookingDetails.arrivalTime}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.passengerDetails}>
          <h3><FaUser className={styles.icon} /> Passenger Information</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Passenger</span>
              <span className={styles.value}>{bookingDetails.passengerName}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Total Price</span>
              <span className={styles.value}>${parseFloat(bookingDetails.totalAmount).toFixed(2)} {bookingDetails.currency}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.nextSteps}>
          <h3>Next Steps</h3>
          <p>A confirmation email has been sent to your email address.</p>
          <p>You can check in online 24 hours before your flight departure.</p>
          <p>Please arrive at the airport at least 2 hours before your scheduled departure time.</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.homeButton}
            onClick={() => window.print()}
          >
            Print Confirmation
          </button>
          <button 
            className={styles.homeButton}
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;