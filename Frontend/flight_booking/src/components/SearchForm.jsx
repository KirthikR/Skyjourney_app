import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFlights } from '../services/api';
import styles from '../styles/SearchForm.module.css';
import { FaPlane, FaCalendarAlt, FaUserFriends } from 'react-icons/fa';

export default function SearchForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    tripType: 'return', // or 'oneWay'
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    cabinClass: 'economy',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format data for Duffel API
      const duffelRequest = {
        slices: [
          {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departure_date: searchParams.departDate
          }
        ],
        passengers: [],
        cabin_class: searchParams.cabinClass
      };
      
      // Add return flight if round trip
      if (searchParams.tripType === 'return' && searchParams.returnDate) {
        duffelRequest.slices.push({
          origin: searchParams.destination,
          destination: searchParams.origin,
          departure_date: searchParams.returnDate
        });
      }
      
      // Add passengers
      for (let i = 0; i < searchParams.passengers.adults; i++) {
        duffelRequest.passengers.push({ type: 'adult' });
      }
      
      for (let i = 0; i < searchParams.passengers.children; i++) {
        duffelRequest.passengers.push({ type: 'child' });
      }
      
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        duffelRequest.passengers.push({ type: 'infant_without_seat' });
      }
      
      // Call API and navigate to results
      const response = await searchFlights(duffelRequest);
      navigate('/search-results', { 
        state: { 
          offerRequestId: response.data.id,
          searchParams: searchParams 
        } 
      });
    } catch (error) {
      console.error('Error searching flights:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render your search form UI
  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      {/* Your form fields here */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search Flights'}
      </button>
    </form>
  );
}