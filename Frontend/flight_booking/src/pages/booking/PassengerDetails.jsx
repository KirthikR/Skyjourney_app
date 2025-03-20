import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PassengerDetails.module.css';
import { FaUser, FaChevronLeft, FaPlane } from 'react-icons/fa';

export default function PassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  
  useEffect(() => {
    // Check if we have the required data
    if (!location.state?.selectedOffer) {
      console.error('No selected flight found, redirecting to search');
      navigate('/flights');
      return;
    }
    
    setSelectedOffer(location.state.selectedOffer);
    setPassengerCount(location.state.passengerCount || 1);
    
    // Initialize passengers array
    const initialPassengers = Array(location.state.passengerCount || 1).fill().map((_, index) => ({
      id: index + 1,
      type: 'adult',
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: index === 0 ? '' : undefined, // Only require email for primary passenger
      phone: index === 0 ? '' : undefined, // Only require phone for primary passenger
    }));
    
    setPassengers(initialPassengers);
    
    console.log('PassengerDetails loaded with data:', {
      offer: location.state.selectedOffer,
      count: location.state.passengerCount
    });
  }, [location.state, navigate]);
  
  const handleInputChange = (passengerId, field, value) => {
    setPassengers(prev => 
      prev.map(p => 
        p.id === passengerId ? { ...p, [field]: value } : p
      )
    );
  };
  
  const validatePassengers = () => {
    // Basic validation
    for (const passenger of passengers) {
      // Required for all passengers
      if (!passenger.title || !passenger.firstName || !passenger.lastName || 
          !passenger.dateOfBirth || !passenger.gender) {
        return false;
      }
      
      // Required only for primary passenger
      if (passenger.id === 1) {
        if (!passenger.email || !passenger.phone) {
          return false;
        }
      }
    }
    return true;
  };
  
  const handleContinue = () => {
    if (!validatePassengers()) {
      alert('Please fill out all required passenger information.');
      return;
    }
    
    // Navigate to payment page instead of confirmation
    navigate('/booking/payment', {
      state: {
        selectedOffer,
        passengers
      }
    });
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to flight details
  };
  
  if (!selectedOffer) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading passenger form...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        <FaChevronLeft /> Back to flight details
      </button>
      
      <div className={styles.header}>
        <h1>Passenger Information</h1>
        <p className={styles.subtitle}>Enter details for each traveler</p>
      </div>
      
      <div className={styles.flightSummary}>
        <div className={styles.flightInfo}>
          <div className={styles.route}>
            <FaPlane className={styles.icon} />
            <span>
              {selectedOffer.slices[0]?.origin?.iata_code || 'N/A'} ⟶ {selectedOffer.slices[0]?.destination?.iata_code || 'N/A'}
              {selectedOffer.slices[1] && ` (Round Trip)`}
            </span>
          </div>
          <div className={styles.airline}>{selectedOffer.owner?.name || 'Airline'}</div>
        </div>
        <div className={styles.price}>
          <div className={styles.amount}>{selectedOffer.total_currency || 'USD'} {selectedOffer.total_amount || 'N/A'}</div>
          <div className={styles.passengers}>for {passengerCount} passenger{passengerCount !== 1 ? 's' : ''}</div>
        </div>
      </div>
      
      {passengers.map((passenger, index) => (
        <div key={passenger.id} className={styles.passengerCard}>
          <div className={styles.passengerHeader}>
            <h3><FaUser /> Passenger {index + 1}</h3>
            {index === 0 && <span className={styles.primaryTag}>Primary Contact</span>}
          </div>
          
          <div className={styles.passengerForm}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Title*</label>
                <select 
                  value={passenger.title}
                  onChange={(e) => handleInputChange(passenger.id, 'title', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              
              <div className={styles.formField}>
                <label>Gender*</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => handleInputChange(passenger.id, 'gender', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="U">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>First Name*</label>
                <input
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => handleInputChange(passenger.id, 'firstName', e.target.value)}
                  placeholder="First name as on ID/passport"
                  required
                />
              </div>
              
              <div className={styles.formField}>
                <label>Last Name*</label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => handleInputChange(passenger.id, 'lastName', e.target.value)}
                  placeholder="Last name as on ID/passport"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Date of Birth*</label>
                <input
                  type="date"
                  value={passenger.dateOfBirth}
                  onChange={(e) => handleInputChange(passenger.id, 'dateOfBirth', e.target.value)}
                  required
                />
              </div>
            </div>
            
            {index === 0 && (
              <>
                <div className={styles.contactHeader}>
                  <h4>Contact Information</h4>
                  <p>We'll send flight confirmation and updates to these contacts</p>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Email*</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handleInputChange(passenger.id, 'email', e.target.value)}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label>Phone Number*</label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handleInputChange(passenger.id, 'phone', e.target.value)}
                      placeholder="Mobile phone number"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      
      <div className={styles.actionButtons}>
        <button onClick={handleBack} className={styles.secondaryButton}>
          Back
        </button>
        <button onClick={handleContinue} className={styles.primaryButton}>
          Continue to Review & Payment
        </button>
      </div>
    </div>
  );
}