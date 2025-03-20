import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingDetails.module.css';
import { format, parseISO } from 'date-fns';
import { FaPlane, FaArrowRight, FaCalendar, FaClock, FaChevronLeft } from 'react-icons/fa';

export default function BookingDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  
  useEffect(() => {
    // Check if we have the required data
    if (!location.state?.selectedOffer) {
      console.error('No selected flight found, redirecting to search');
      navigate('/flights');
      return;
    }
    
    setSelectedOffer(location.state.selectedOffer);
    setSearchParams(location.state.searchParams);
    
    // Calculate total passengers
    let totalPassengers = 0;
    if (location.state.searchParams?.passengers) {
      if (Array.isArray(location.state.searchParams.passengers)) {
        totalPassengers = location.state.searchParams.passengers.length;
      } else if (typeof location.state.searchParams.passengers === 'object') {
        // Handle object format: { adults: 1, children: 0, infants: 0 }
        const passengers = location.state.searchParams.passengers;
        totalPassengers = (passengers.adults || 0) + (passengers.children || 0) + (passengers.infants || 0);
      }
    }
    setPassengerCount(totalPassengers || 1);
    
    // Log data for debugging
    console.log('BookingDetails loaded with data:', {
      offer: location.state.selectedOffer,
      params: location.state.searchParams
    });
  }, [location.state, navigate]);
  
  // Helper functions for formatting
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      return 'N/A';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'EEE, MMMM d, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };
  
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const handleContinue = () => {
    // Navigate to passenger details with the selected flight info
    navigate('/booking/passengers', {
      state: {
        selectedOffer,
        searchParams,
        passengerCount
      }
    });
  };
  
  const handleBackToFlights = () => {
    navigate(-1); // Go back to the previous page (flights)
  };
  
  // If no data, show loading
  if (!selectedOffer) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading flight details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <button onClick={handleBackToFlights} className={styles.backButton}>
        <FaChevronLeft /> Back to flights
      </button>
      
      <div className={styles.header}>
        <h1>Flight Details</h1>
        <p className={styles.subtitle}>Review your selected flight before continuing</p>
      </div>
      
      <div className={styles.flightCard}>
        <div className={styles.airlineHeader}>
          <h2>{selectedOffer.owner?.name || 'Airline'}</h2>
          <span className={styles.flightNumber}>
            Flight #{selectedOffer.id?.substring(0, 8) || 'N/A'}
          </span>
        </div>
        
        <div className={styles.price}>
          <span className={styles.priceLabel}>Total Price:</span>
          <span className={styles.priceValue}>
            {selectedOffer.total_currency || 'USD'} {selectedOffer.total_amount || 'N/A'}
          </span>
          <span className={styles.pricePassengers}>
            for {passengerCount} passenger{passengerCount !== 1 ? 's' : ''}
          </span>
        </div>
        
        {selectedOffer.slices && selectedOffer.slices.map((slice, index) => (
          <div key={index} className={styles.segment}>
            <div className={styles.segmentHeader}>
              <h3>{index === 0 ? 'Outbound Flight' : 'Return Flight'}</h3>
              <span className={styles.segmentDate}>
                <FaCalendar /> {formatDate(slice?.departing_at)}
              </span>
            </div>
            
            <div className={styles.flightPath}>
              <div className={styles.departure}>
                <div className={styles.airport}>{slice?.origin?.iata_code || 'N/A'}</div>
                <div className={styles.time}>{formatTime(slice?.departing_at)}</div>
                <div className={styles.city}>{slice?.origin?.city?.name || slice?.origin?.city_name || 'N/A'}</div>
              </div>
              
              <div className={styles.flightInfo}>
                <div className={styles.duration}>
                  <FaClock /> {formatDuration(slice?.duration)}
                </div>
                <div className={styles.flightLine}>
                  <div className={styles.dot}></div>
                  <div className={styles.line}></div>
                  <div className={styles.airplane}><FaPlane /></div>
                  <div className={styles.line}></div>
                  <div className={styles.dot}></div>
                </div>
                <div className={styles.stops}>
                  {slice?.segments?.length > 1 
                    ? `${slice.segments.length - 1} stop(s)` 
                    : 'Direct flight'}
                </div>
              </div>
              
              <div className={styles.arrival}>
                <div className={styles.airport}>{slice?.destination?.iata_code || 'N/A'}</div>
                <div className={styles.time}>{formatTime(slice?.arriving_at)}</div>
                <div className={styles.city}>{slice?.destination?.city?.name || slice?.destination?.city_name || 'N/A'}</div>
              </div>
            </div>
            
            {/* Show segments (connections) if any */}
            {slice?.segments?.length > 1 && (
              <div className={styles.connections}>
                <h4>Connections</h4>
                {slice.segments.map((segment, segIndex) => (
                  <div key={segIndex} className={styles.connection}>
                    <div className={styles.connectionDetails}>
                      <span>{segment?.origin?.iata_code || 'N/A'}</span>
                      <FaArrowRight className={styles.arrow} />
                      <span>{segment?.destination?.iata_code || 'N/A'}</span>
                    </div>
                    <div className={styles.connectionTime}>
                      {formatDuration(segment?.duration)}
                    </div>
                    <div className={styles.connectionAirline}>
                      {segment?.operating_carrier?.name || 'Airline'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className={styles.fareDetails}>
          <h3>Fare Details</h3>
          <div className={styles.fareBreakdown}>
            <div className={styles.fareItem}>
              <span>Base fare:</span>
              <span>{selectedOffer.base_currency || 'USD'} {selectedOffer.base_amount || 'N/A'}</span>
            </div>
            <div className={styles.fareItem}>
              <span>Taxes & fees:</span>
              <span>{selectedOffer.tax_currency || 'USD'} {selectedOffer.tax_amount || 'N/A'}</span>
            </div>
            <div className={`${styles.fareItem} ${styles.fareTotal}`}>
              <span>Total per passenger:</span>
              <span>{selectedOffer.total_currency || 'USD'} {(selectedOffer.total_amount / passengerCount).toFixed(2) || 'N/A'}</span>
            </div>
            <div className={`${styles.fareItem} ${styles.fareGrandTotal}`}>
              <span>Total for {passengerCount} passenger{passengerCount !== 1 ? 's' : ''}:</span>
              <span>{selectedOffer.total_currency || 'USD'} {selectedOffer.total_amount || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button onClick={handleBackToFlights} className={styles.secondaryButton}>
            Back to flights
          </button>
          <button onClick={handleContinue} className={styles.primaryButton}>
            Continue to Passenger Information
          </button>
        </div>
      </div>
    </div>
  );
}