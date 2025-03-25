import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingProcess.module.css';

const BookingProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([]);
  
  useEffect(() => {
    // Log what we received from the previous page
    console.log("BookingProcess received state:", location.state);
    
    if (!location.state || !location.state.selectedOffer) {
      setError("No flight selected. Please go back and select a flight.");
      setLoading(false);
      return;
    }
    
    // Set the selected offer from the location state
    setSelectedOffer(location.state.selectedOffer);
    
    // Set passenger count
    const count = location.state.passengerCount || 1;
    setPassengerCount(count);
    
    // Initialize passenger details array with empty objects
    const initialPassengers = Array(count).fill(null).map(() => ({
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: ''
    }));
    
    setPassengerDetails(initialPassengers);
    setLoading(false);
  }, [location]);
  
  // Function to handle passenger details change
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengerDetails(updatedPassengers);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting passenger details:", passengerDetails);
    
    // Navigate to payment with passenger details and flight info
    navigate('/booking/payment', {
      state: {
        selectedOffer: selectedOffer,
        passengers: passengerDetails
      }
    });
  };
  
  // Handle going back
  const handleBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading passenger details form...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/flights')}>Back to Flights</button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Passenger Details</h1>
      <p className={styles.subtitle}>Please enter the details for all passengers</p>
      
      {/* Flight summary */}
      <div className={styles.flightSummary}>
        <h2>Flight Summary</h2>
        <div className={styles.route}>
          {selectedOffer.slices[0]?.origin?.iata_code || 'Origin'} → 
          {selectedOffer.slices[0]?.destination?.iata_code || 'Destination'}
        </div>
        <div className={styles.airline}>{selectedOffer.owner?.name || 'Airline'}</div>
        <div className={styles.price}>
          {selectedOffer.total_currency} {selectedOffer.total_amount}
        </div>
      </div>
      
      {/* Passenger form */}
      <form onSubmit={handleSubmit}>
        {passengerDetails.map((passenger, index) => (
          <div key={index} className={styles.passengerForm}>
            <h3>Passenger {index + 1} {index === 0 ? '(Primary)' : ''}</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`title-${index}`}>Title*</label>
                <select 
                  id={`title-${index}`}
                  value={passenger.title}
                  onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`firstName-${index}`}>First Name*</label>
                <input
                  type="text"
                  id={`firstName-${index}`}
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`lastName-${index}`}>Last Name*</label>
                <input
                  type="text"
                  id={`lastName-${index}`}
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`dateOfBirth-${index}`}>Date of Birth*</label>
                <input
                  type="date"
                  id={`dateOfBirth-${index}`}
                  value={passenger.dateOfBirth}
                  onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`email-${index}`}>Email*</label>
                <input
                  type="email"
                  id={`email-${index}`}
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                  required={index === 0} // Required for primary passenger
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`phone-${index}`}>Phone*</label>
                <input
                  type="tel"
                  id={`phone-${index}`}
                  value={passenger.phone}
                  onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                  required={index === 0} // Required for primary passenger
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`nationality-${index}`}>Nationality*</label>
                <input
                  type="text"
                  id={`nationality-${index}`}
                  value={passenger.nationality}
                  onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`passportNumber-${index}`}>Passport Number*</label>
                <input
                  type="text"
                  id={`passportNumber-${index}`}
                  value={passenger.passportNumber}
                  onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor={`passportExpiry-${index}`}>Passport Expiry*</label>
                <input
                  type="date"
                  id={`passportExpiry-${index}`}
                  value={passenger.passportExpiry}
                  onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Back to Flight Details
          </button>
          <button type="submit" className={styles.continueButton}>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingProcess;