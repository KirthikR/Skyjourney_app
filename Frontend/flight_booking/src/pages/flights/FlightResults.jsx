import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './FlightResults.module.css';
import { FaArrowRight, FaExchangeAlt, FaPlane, FaClock } from 'react-icons/fa';

export default function FlightResults() {
  const location = useLocation();
  const { results } = location.state || { results: { data: [] } };
  
  if (!results || !results.data || results.data.length === 0) {
    return (
      <div className={styles.noResults}>
        <FaPlane className={styles.noResultsIcon} />
        <h2>No flights found</h2>
        <p>We couldn't find any flights matching your search criteria.</p>
        <Link to="/" className={styles.backButton}>Try another search</Link>
      </div>
    );
  }
  
  return (
    <div className={styles.flightResultsContainer}>
      <h1 className={styles.resultsTitle}>Available Flights</h1>
      
      <div className={styles.flightsList}>
        {results.data.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.flightHeader}>
              <div className={styles.airline}>
                <img 
                  src={flight.airline.logo || 'https://via.placeholder.com/40'} 
                  alt={flight.airline.name} 
                  className={styles.airlineLogo} 
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
            
            <button className={styles.selectButton}>
              Select Flight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}