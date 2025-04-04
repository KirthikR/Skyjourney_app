import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaPlane, FaCalendarAlt, FaUser, FaChair, FaCreditCard } from 'react-icons/fa';
import styles from './BookingConfirmation.module.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const {
    bookingId,
    bookingDate,
    paymentInfo,
    selectedFlight,
    flight,  // Handle both naming conventions
    searchParams,
    passengers,
    selectedSeats
  } = location.state || {};

  // Use either selectedFlight or flight, whichever exists
  const flightData = selectedFlight || flight;

  useEffect(() => {
    // Check for data in sessionStorage if location.state is empty
    if (!location.state) {
      try {
        const storedData = sessionStorage.getItem('confirmationData');
        if (storedData) {
          console.log("Found stored confirmation data");
          const parsedData = JSON.parse(storedData);
          // Now you'd need to manually update all the destructured variables
          // or re-render with this data
        }
      } catch (e) {
        console.error("Failed to parse stored confirmation data", e);
      }
    }
    
    console.log("BookingConfirmation component mounted");
    console.log("location.state:", location.state);
    console.log("flightData:", selectedFlight || flight);
  }, []);

  useEffect(() => {
    console.log("BookingConfirmation received state:", location.state);
    
    if (!location.state || !flightData) {
      console.error("Missing booking data in confirmation page");
    }
  }, [location.state, flightData]);

  // If no data was passed, show an error
  if (!location.state || !flightData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>Error: Missing booking information</h2>
          <p>We couldn't find your booking details. Please try again or contact customer service.</p>
          <Link to="/" className={styles.homeButton}>Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaCheckCircle className={styles.successIcon} />
        <h1>Booking Confirmed!</h1>
        <p>Your flight has been successfully booked.</p>
      </div>
      
      <div className={styles.bookingInfo}>
        <div className={styles.bookingId}>
          <span>Booking Reference:</span>
          <strong>{bookingId || 'BK123456'}</strong>
        </div>
        
        <div className={styles.bookingDate}>
          <span>Booking Date:</span>
          <strong>{new Date(bookingDate).toLocaleDateString()}</strong>
        </div>
      </div>
      
      <div className={styles.detailsContainer}>
        <div className={styles.flightDetails}>
          <h3><FaPlane className={styles.icon} /> Flight Details</h3>
          <div className={styles.flightInfo}>
            <div className={styles.route}>
              <div className={styles.airport}>
                <div className={styles.code}>{flightData.origin || flightData.slices?.[0]?.origin?.iata_code}</div>
                <div className={styles.city}>
                  {flightData.originCity || flightData.slices?.[0]?.origin?.city_name || 'Departure City'}
                </div>
              </div>
              
              <div className={styles.flightLine}>
                <div className={styles.plane}><FaPlane /></div>
              </div>
              
              <div className={styles.airport}>
                <div className={styles.code}>{flightData.destination || flightData.slices?.[0]?.destination?.iata_code}</div>
                <div className={styles.city}>
                  {flightData.destinationCity || flightData.slices?.[0]?.destination?.city_name || 'Arrival City'}
                </div>
              </div>
            </div>
            
            <div className={styles.flightDetails}>
              <div>
                <FaCalendarAlt className={styles.smallIcon} />
                <span>
                  {new Date(flightData.departureTime || flightData.slices?.[0]?.segments?.[0]?.departing_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div>Flight {flightData.flightNumber || 'Unknown'}</div>
            </div>
          </div>
        </div>
        
        <div className={styles.passengerDetails}>
          <h3><FaUser className={styles.icon} /> Passenger Information</h3>
          <ul className={styles.passengerList}>
            {(passengers || []).map((passenger, index) => (
              <li key={index} className={styles.passenger}>
                <div className={styles.passengerName}>
                  {passenger.details?.title || ''} {passenger.details?.given_name || ''} {passenger.details?.family_name || ''}
                </div>
                {selectedSeats && selectedSeats[index] && (
                  <div className={styles.seatInfo}>
                    <FaChair className={styles.smallIcon} />
                    <span>Seat {selectedSeats[index]}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.paymentDetails}>
          <h3><FaCreditCard className={styles.icon} /> Payment Information</h3>
          <div className={styles.paymentInfo}>
            <div className={styles.paymentRow}>
              <span>Payment Method:</span>
              <span>Credit Card **** **** **** {paymentInfo?.cardLast4 || '1234'}</span>
            </div>
            <div className={styles.paymentRow}>
              <span>Amount Paid:</span>
              <span className={styles.amount}>
                ${paymentInfo?.amount?.toFixed(2) || (flightData.total_amount || flightData.price || '0.00')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.nextSteps}>
        <h3>Next Steps</h3>
        <div className={styles.stepsList}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Check your email</h4>
              <p>A confirmation has been sent to your email address</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Online check-in</h4>
              <p>Available 24 hours before your flight</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>At the airport</h4>
              <p>Arrive at least 2 hours before departure</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <Link to="/" className={styles.homeButton}>
          Return to Home
        </Link>
        <Link to="/manage-booking" className={styles.manageButton}>
          Manage Booking
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;