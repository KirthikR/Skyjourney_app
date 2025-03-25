import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Flights.module.css';
import { FaArrowRight, FaExchangeAlt, FaPlane, FaClock, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

export default function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get results from location state or use empty array
  const { results, searchDetails } = location.state || { 
    results: { data: [] }, 
    searchDetails: {} 
  };
  
  // Verify we have the location state on component mount
  useEffect(() => {
    if (!location.state) {
      console.warn("FlightResults: No location state provided");
      setError("Flight search data is missing. Please try a new search.");
    } else {
      console.log("Flight results received:", results);
      console.log("Search details:", searchDetails);
    }
  }, [location.state]);
  
  // Handle missing data case
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Link to="/booking" className={styles.backButton}>
          <FaSearch /> New Search
        </Link>
      </div>
    );
  }

  // Handle no results case
  if (!results || !results.data || results.data.length === 0) {
    return (
      <div className={styles.noResults}>
        <FaPlane className={styles.noResultsIcon} />
        <h2>No flights found</h2>
        <p>We couldn't find any flights matching your search criteria.</p>
        <Link to="/booking" className={styles.backButton}>Try another search</Link>
      </div>
    );
  }
  
  // Display the search summary
  const renderSearchSummary = () => {
    if (!searchDetails) return null;
    
    return (
      <div className={styles.searchSummary}>
        <div className={styles.route}>
          <span className={styles.airport}>{searchDetails.origin}</span>
          {searchDetails.tripType === 'roundtrip' ? (
            <FaExchangeAlt className={styles.directionIcon} />
          ) : (
            <FaArrowRight className={styles.directionIcon} />
          )}
          <span className={styles.airport}>{searchDetails.destination}</span>
        </div>
        
        <div className={styles.searchDetails}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Departure:</span>
            <span className={styles.value}>{new Date(searchDetails.departureDate).toLocaleDateString()}</span>
          </div>
          
          {searchDetails.returnDate && (
            <div className={styles.detailItem}>
              <span className={styles.label}>Return:</span>
              <span className={styles.value}>{new Date(searchDetails.returnDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className={styles.detailItem}>
            <span className={styles.label}>Passengers:</span>
            <span className={styles.value}>{searchDetails.passengers}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.label}>Class:</span>
            <span className={styles.value}>{searchDetails.travelClass}</span>
          </div>
        </div>
        
        <button 
          className={styles.modifyButton}
          onClick={() => navigate('/booking', { state: { prefill: searchDetails } })}
        >
          Modify Search
        </button>
      </div>
    );
  };
  
  return (
    <div className={styles.flightResultsContainer}>
      <h1 className={styles.resultsTitle}>Available Flights</h1>
      
      {renderSearchSummary()}
      
      <div className={styles.flightsList}>
        {results.data.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.flightHeader}>
              <div className={styles.airline}>
                <img 
                  src={flight.airline.logo || 'https://via.placeholder.com/40'} 
                  alt={flight.airline.name} 
                  className={styles.airlineLogo} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
                <span>{flight.airline.name}</span>
              </div>
              <div className={styles.flightPrice}>
                <span className={styles.price}>${flight.price}</span>
                <span className={styles.perPerson}>per person</span>
              </div>
            </div>
            
            <div className={styles.flightDetails}>
              <div className={styles.departure}>
                <div className={styles.time}>{flight.departureTime}</div>
                <div className={styles.airport}>{flight.origin}</div>
              </div>
              
              <div className={styles.flightPath}>
                <div className={styles.duration}>
                  <FaClock />
                  <span>{flight.duration}</span>
                </div>
                <div className={styles.pathLine}></div>
                <div className={styles.stopInfo}>
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                </div>
              </div>
              
              <div className={styles.arrival}>
                <div className={styles.time}>{flight.arrivalTime}</div>
                <div className={styles.airport}>{flight.destination}</div>
              </div>
            </div>
            
            <button 
              className={styles.selectButton}
              onClick={() => navigate('/checkout', { 
                state: { selectedFlight: flight, searchDetails } 
              })}
            >
              Select Flight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}