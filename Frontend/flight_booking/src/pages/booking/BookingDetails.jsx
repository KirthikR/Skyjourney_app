import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaArrowRight } from 'react-icons/fa';
import styles from './BookingDetails.module.css';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    // Get flight details from location state or localStorage
    const flightFromState = location.state?.selectedFlight;
    const paramsFromState = location.state?.searchParams;
    
    // Try to get from localStorage if not available in state
    const storedFlight = localStorage.getItem('selectedFlight') 
      ? JSON.parse(localStorage.getItem('selectedFlight')) 
      : null;
    const storedParams = localStorage.getItem('searchParams')
      ? JSON.parse(localStorage.getItem('searchParams'))
      : null;
    
    if (flightFromState) {
      setSelectedFlight(flightFromState);
      localStorage.setItem('selectedFlight', JSON.stringify(flightFromState));
    } else if (storedFlight) {
      setSelectedFlight(storedFlight);
    } else {
      // Redirect to flights if no flight data is available
      navigate('/flights');
      return;
    }
    
    if (paramsFromState) {
      setSearchParams(paramsFromState);
      localStorage.setItem('searchParams', JSON.stringify(paramsFromState));
    } else if (storedParams) {
      setSearchParams(storedParams);
    }
  }, [location, navigate]);

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return 'N/A';
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'N/A';
    }
  };
  
  const handleContinue = () => {
    console.log('Navigating to passenger details with:', selectedFlight);
    
    // Navigate to passenger details with the flight info
    navigate('/booking/passengers', { 
      state: { 
        selectedFlight: selectedFlight,
        searchParams: searchParams 
      } 
    });
  };

  if (!selectedFlight) {
    return <div className={styles.loading}>Loading flight details...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><FaPlane className={styles.icon} /> Flight Details</h1>
        <p>Please review your flight details before proceeding</p>
      </div>
      
      <div className={styles.flightDetails}>
        {/* Add null check for slices array */}
        {selectedFlight.slices && Array.isArray(selectedFlight.slices) ? (
          selectedFlight.slices.map((slice, index) => (
            <div key={index} className={styles.flightCard}>
              <div className={styles.flightHeader}>
                <h3>{index === 0 ? 'Outbound Flight' : 'Return Flight'}</h3>
                <span className={styles.airline}>{selectedFlight.owner?.name || 'Airline'}</span>
              </div>
              
              <div className={styles.flightRoute}>
                <div className={styles.routePoint}>
                  <div className={styles.airportCode}>{slice.origin?.iata_code || 'N/A'}</div>
                  <div className={styles.time}>{formatTime(slice.departing_at)}</div>
                  <div className={styles.date}>{formatDate(slice.departing_at)}</div>
                </div>
                
                <div className={styles.routeLine}>
                  <div className={styles.duration}>
                    {Math.floor((slice.duration || 0) / 60)}h {(slice.duration || 0) % 60}m
                  </div>
                  <div className={styles.line}></div>
                  <FaPlane className={styles.planeIcon} />
                </div>
                
                <div className={styles.routePoint}>
                  <div className={styles.airportCode}>{slice.destination?.iata_code || 'N/A'}</div>
                  <div className={styles.time}>{formatTime(slice.arriving_at)}</div>
                  <div className={styles.date}>{formatDate(slice.arriving_at)}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // If slice data is not in expected format, show alternative view
          <div className={styles.flightCard}>
            <div className={styles.flightHeader}>
              <h3>Flight</h3>
              <span className={styles.airline}>
                {selectedFlight.airline?.name || selectedFlight.owner?.name || 'Airline'}
              </span>
            </div>
            
            <div className={styles.flightRoute}>
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{selectedFlight.origin || 'N/A'}</div>
                <div className={styles.time}>{selectedFlight.departureTime || 'N/A'}</div>
              </div>
              
              <div className={styles.routeLine}>
                <div className={styles.duration}>
                  {selectedFlight.duration || 'N/A'}
                </div>
                <div className={styles.line}></div>
                <FaPlane className={styles.planeIcon} />
              </div>
              
              <div className={styles.routePoint}>
                <div className={styles.airportCode}>{selectedFlight.destination || 'N/A'}</div>
                <div className={styles.time}>{selectedFlight.arrivalTime || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.priceSection}>
          <h3>Price Summary</h3>
          <div className={styles.priceRow}>
            <span>Base Fare:</span>
            <span>
              ${typeof selectedFlight.total_amount !== 'undefined' 
                ? parseFloat(selectedFlight.total_amount).toFixed(2)
                : typeof selectedFlight.price !== 'undefined'
                ? parseFloat(selectedFlight.price).toFixed(2)
                : '0.00'}
            </span>
          </div>
          <div className={styles.priceRow}>
            <span>Taxes & Fees:</span>
            <span>Included</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total:</span>
            <span>
              ${typeof selectedFlight.total_amount !== 'undefined' 
                ? parseFloat(selectedFlight.total_amount).toFixed(2)
                : typeof selectedFlight.price !== 'undefined'
                ? parseFloat(selectedFlight.price).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          onClick={handleContinue} 
          className={styles.continueButton}
        >
          Continue to Passenger Details <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default BookingDetails;