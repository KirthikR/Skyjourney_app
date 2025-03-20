import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/FlightSearch.module.css';

export default function FlightSearch() {
  const navigate = useNavigate();
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'economy'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (e.g. passengers.adults)
      const [parent, child] = name.split('.');
      setSearchParams(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || 0
        }
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare slices for the API
    const slices = [
      {
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departureDate
      }
    ];
    
    // Add return flight if round trip
    if (isRoundTrip && searchParams.returnDate) {
      slices.push({
        origin: searchParams.destination,
        destination: searchParams.origin,
        departure_date: searchParams.returnDate
      });
    }
    
    // Prepare passengers
    const passengers = [];
    for (let i = 0; i < searchParams.passengers.adults; i++) {
      passengers.push({ type: 'adult' });
    }
    for (let i = 0; i < searchParams.passengers.children; i++) {
      passengers.push({ type: 'child' });
    }
    for (let i = 0; i < searchParams.passengers.infants; i++) {
      passengers.push({ type: 'infant_without_seat' });
    }
    
    // Prepare search data for API
    const searchData = {
      slices,
      passengers,
      cabinClass: searchParams.cabinClass
    };
    
    // Navigate to results page with search parameters
    navigate('/flight-results', { state: { searchData } });
  };
  
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTabs}>
        <button 
          className={isRoundTrip ? styles.activeTab : ''} 
          onClick={() => setIsRoundTrip(true)}
        >
          Round Trip
        </button>
        <button 
          className={!isRoundTrip ? styles.activeTab : ''} 
          onClick={() => setIsRoundTrip(false)}
        >
          One Way
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="origin">From</label>
            <input
              type="text"
              id="origin"
              name="origin"
              placeholder="City or Airport"
              value={searchParams.origin}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="destination">To</label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="City or Airport"
              value={searchParams.destination}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="departureDate">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          {isRoundTrip && (
            <div className={styles.formGroup}>
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleInputChange}
                min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                required={isRoundTrip}
              />
            </div>
          )}
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Passengers</label>
            <div className={styles.passengersContainer}>
              <div className={styles.passengerType}>
                <label htmlFor="adults">Adults</label>
                <input
                  type="number"
                  id="adults"
                  name="passengers.adults"
                  min="1"
                  max="9"
                  value={searchParams.passengers.adults}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.passengerType}>
                <label htmlFor="children">Children (2-12)</label>
                <input
                  type="number"
                  id="children"
                  name="passengers.children"
                  min="0"
                  max="9"
                  value={searchParams.passengers.children}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.passengerType}>
                <label htmlFor="infants">Infants (0-2)</label>
                <input
                  type="number"
                  id="infants"
                  name="passengers.infants"
                  min="0"
                  max="4"
                  value={searchParams.passengers.infants}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="cabinClass">Cabin Class</label>
            <select
              id="cabinClass"
              name="cabinClass"
              value={searchParams.cabinClass}
              onChange={handleInputChange}
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className={styles.searchButton}>
          Search Flights
        </button>
      </form>
    </div>
  );
}