import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaClock, FaCalendar, FaUser, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import styles from './FlightDetails.module.css';

const FlightDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  
  useEffect(() => {
    // Get data from location state
    if (location.state?.selectedFlight) {
      setSelectedFlight(location.state.selectedFlight);
      setSearchParams(location.state.searchParams);
    } else {
      // If no flight is selected, go back to flights page
      navigate('/flights');
    }
  }, [location, navigate]);
  
  if (!selectedFlight) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading flight details...</div>
      </div>
    );
  }
  
  // Format date from ISO string
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time from ISO string
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Extract city name safely
  const getLocationName = (location) => {
    // If location is a string, return it directly
    if (typeof location === 'string') return location;
    
    // If location has a city_name property, use that
    if (location?.city_name) return location.city_name;
    
    // If location has a name property, use that
    if (location?.name) return location.name;
    
    // Fallback to standard text
    return 'Location';
  };
  
  // Extract IATA code safely
  const getIataCode = (location) => {
    // If location is a string, return it directly
    if (typeof location === 'string') return location;
    
    // If location has an iata_code property, use that
    if (location?.iata_code) return location.iata_code;
    
    // Fallback to standard text
    return 'XXX';
  };
  
  // Proceed to passenger details
  const handleContinue = () => {
    setLoading(true);
    
    // Log the navigation
    console.log("Navigating to passenger details with flight:", selectedFlight);
    
    navigate('/booking/passengers', {
      state: {
        flight: selectedFlight,  // This key MUST be 'flight'
        searchParams: searchParams
      }
    });
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Flight Details</h1>
      
      <div className={styles.flightCard}>
        <div className={styles.flightHeader}>
          <div className={styles.airline}>
            <h2>{selectedFlight.owner?.name || 'Airline'}</h2>
            <p>Flight #{selectedFlight.owner?.iata_code || 'XX'}{Math.floor(Math.random() * 1000) + 1000}</p>
          </div>
          <div className={styles.priceTag}>
            <h2>${parseFloat(selectedFlight.total_amount).toFixed(2)}</h2>
            <p>{selectedFlight.total_currency}</p>
          </div>
        </div>
        
        {selectedFlight.slices.map((slice, index) => (
          <div key={index} className={styles.slice}>
            {index > 0 && <div className={styles.returnLabel}>Return Flight</div>}
            
            <div className={styles.route}>
              <div className={styles.routePoint}>
                <h3>{getIataCode(slice.origin)}</h3>
                {/* Fix: use the safe getter function instead of directly rendering the object */}
                <p className={styles.city}>{getLocationName(slice.origin)}</p>
              </div>
              
              <div className={styles.flightPath}>
                <div className={styles.duration}>
                  <FaClock /> {formatDuration(slice.duration)}
                </div>
                <div className={styles.line}></div>
                <FaPlane className={styles.planeIcon} />
              </div>
              
              <div className={styles.routePoint}>
                <h3>{getIataCode(slice.destination)}</h3>
                {/* Fix: use the safe getter function instead of directly rendering the object */}
                <p className={styles.city}>{getLocationName(slice.destination)}</p>
              </div>
            </div>
            
            {slice.segments.map((segment, segmentIndex) => (
              <div key={segmentIndex} className={styles.segment}>
                <div className={styles.segmentLabel}>
                  {slice.segments.length > 1 ? 
                    (segmentIndex === 0 ? 'First Flight' : 'Connection Flight') : 'Direct Flight'}
                </div>
                
                <div className={styles.segmentDetails}>
                  <div className={styles.segmentTime}>
                    <div className={styles.timePoint}>
                      <FaCalendar className={styles.icon} />
                      <div>
                        <p>{formatDate(segment.departing_at)}</p>
                        <h4>{formatTime(segment.departing_at)}</h4>
                      </div>
                    </div>
                    
                    <FaArrowRight className={styles.icon} />
                    
                    <div className={styles.timePoint}>
                      <FaCalendar className={styles.icon} />
                      <div>
                        <p>{formatDate(segment.arriving_at)}</p>
                        <h4>{formatTime(segment.arriving_at)}</h4>
                      </div>
                    </div>
                  </div>
                  
                  <p className={styles.operator}>
                    Operated by: {segment.operating_carrier?.name || 'Airline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className={styles.summary}>
          <div className={styles.passengerInfo}>
            <h3><FaUser className={styles.icon} /> Passengers</h3>
            <p>{searchParams?.passengers?.length || 1} {(searchParams?.passengers?.length || 1) === 1 ? 'Passenger' : 'Passengers'}</p>
            <p className={styles.cabinClass}>
              <FaInfoCircle className={styles.icon} /> 
              {/* Fix: safely access cabin_class and convert to readable format */}
              {(searchParams?.cabin_class ? searchParams.cabin_class : 'economy').replace('_', ' ').charAt(0).toUpperCase() + 
               (searchParams?.cabin_class ? searchParams.cabin_class : 'economy').replace('_', ' ').slice(1)}
            </p>
          </div>
          
          <div className={styles.priceSummary}>
            <h3>Price Summary</h3>
            <div className={styles.priceRow}>
              <span>Base fare</span>
              <span>${(parseFloat(selectedFlight.total_amount) * 0.85).toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Taxes and fees</span>
              <span>${(parseFloat(selectedFlight.total_amount) * 0.15).toFixed(2)}</span>
            </div>
            <div className={styles.priceTotal}>
              <span>Total</span>
              <span>${parseFloat(selectedFlight.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/flights')}
          >
            Back to Flights
          </button>
          <button 
            className={styles.bookButton}
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue to Passenger Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;