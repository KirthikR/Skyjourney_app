import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaCalendar, FaUser, FaInfoCircle, FaClock } from 'react-icons/fa';
import { searchFlights } from '../../services/flightApi';
import styles from './Flights.module.css';

export default function Flights() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);

  // Process search params and fetch flights on component mount
  useEffect(() => {
    if (!location.state) {
      navigate('/booking');
      return;
    }

    if (location.state.searchParams) {
      console.log('Duffel search parameters received:', location.state.searchParams);
      setSearchParams(location.state.searchParams);
      
      // If results are already provided (from BookingEmergency), use them directly
      if (location.state.results && Array.isArray(location.state.results)) {
        console.log('Search results already provided:', location.state.results);
        setFlights(location.state.results);
        setLoading(false);
      } else {
        // Otherwise fetch flights using API
        fetchFlights(location.state.searchParams);
      }
    } else {
      setLoading(false);
      setError('No search parameters provided');
    }
  }, [location.state, navigate]);

  // Function to fetch flights from Duffel API
  const fetchFlights = async (params) => {
    setLoading(true);
    setError(null);
    setSearchProgress(10);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    try {
      // Call the Duffel API
      const response = await searchFlights(params);
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      console.log('Duffel flight search results:', response);
      
      if (response.data && response.data.length > 0) {
        setFlights(response.data);
      } else {
        setError('No flights found for your search criteria.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Error fetching Duffel flights:', err);
      setError('Failed to fetch flights: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  // Handle new search
  const handleNewSearch = () => {
    navigate('/booking');
  };

  // Handle flight selection
  const handleSelectFlight = (selectedFlight) => {
    console.log('Selected flight:', selectedFlight);
    
    // Save the selected flight and search parameters
    navigate('/booking/process', {
      state: {
        selectedFlight: selectedFlight,
        searchParams: searchParams,
        passengerCount: searchParams.passengers?.length || 
                        (searchParams.passengers?.adults || 1) +
                        (searchParams.passengers?.children || 0) +
                        (searchParams.passengers?.infants || 0)
      }
    });
  };

  // Add a selectFlight function in your Flights component
  const selectFlight = (flight) => {
    navigate('/flights/details', {  // Change from /flight-details to /flights/details
      state: {
        selectedFlight: flight,
        searchParams
      }
    });
  };

  // Helper functions for formatting
  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (e) {
      return "N/A";
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h2>Searching for flights...</h2>
          <p>This may take a moment as we check multiple airlines.</p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{width: `${searchProgress}%`}}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <FaInfoCircle className={styles.errorIcon} />
          <h2>Unable to find flights</h2>
          <p>{error}</p>
          <button onClick={handleNewSearch} className={styles.primaryButton}>
            Try a new search
          </button>
        </div>
      </div>
    );
  }

  // Render flights
  return (
    <div className={styles.container}>
      <div className={styles.flightsHeader}>
        <h1>Available Flights</h1>
        <button onClick={handleNewSearch} className={styles.newSearchBtn}>
          New Search
        </button>
      </div>

      {searchParams && (
        <div className={styles.searchSummary}>
          <div className={styles.summaryItem}>
            <FaPlane className={styles.summaryIcon} />
            <div>
              <strong>{searchParams.slices[0].origin}</strong> to <strong>{searchParams.slices[0].destination}</strong>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <FaCalendar className={styles.summaryIcon} />
            <div>
              {new Date(searchParams.slices[0].departure_date).toLocaleDateString()}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <FaUser className={styles.summaryIcon} />
            <div>
              {searchParams.passengers.adults + (searchParams.passengers.children || 0) + (searchParams.passengers.infants || 0)} Passenger(s)
            </div>
          </div>
        </div>
      )}

      <div className={styles.resultsCount}>
        Found {flights.length} flight{flights.length !== 1 ? 's' : ''}
      </div>

      <div className={styles.flightsList}>
        {flights.map((flight, index) => {
          // Get airline info
          const airline = flight.owner?.name || "Airline";
          const airlineCode = flight.owner?.iata_code || "XX";
          
          // Get first slice details (outbound)
          const outboundSlice = flight.slices[0];
          const firstSegment = outboundSlice?.segments[0];
          const lastSegment = outboundSlice?.segments[outboundSlice.segments.length - 1];
          
          // Skip if missing essential data
          if (!outboundSlice || !firstSegment || !lastSegment) return null;
          
          const departureTime = formatTime(firstSegment.departing_at);
          const arrivalTime = formatTime(lastSegment.arriving_at);
          const duration = formatDuration(outboundSlice.duration);
          const stops = outboundSlice.segments.length - 1;
          
          return (
            <div key={index} className={styles.flightCard}>
              <div className={styles.flightHeader}>
                <div className={styles.airline}>
                  <img 
                    src={`https://pics.avs.io/200/80/${airlineCode}.png`}
                    alt={airline}
                    className={styles.airlineLogo}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x40?text=Airline';
                    }}
                  />
                  <span>{airline}</span>
                </div>
                <div className={styles.flightPrice}>
                  <span className={styles.price}>${parseFloat(flight.total_amount || 0).toFixed(2)}</span>
                  <span className={styles.perPerson}>per person</span>
                </div>
              </div>
              
              <div className={styles.flightDetails}>
                <div className={styles.departure}>
                  <div className={styles.time}>{departureTime}</div>
                  <div className={styles.airport}>{outboundSlice.origin.iata_code}</div>
                </div>
                
                <div className={styles.flightPath}>
                  <div className={styles.duration}>
                    <FaClock />
                    <span>{duration}</span>
                  </div>
                  <div className={styles.pathLine}></div>
                  <div className={styles.stopInfo}>
                    {stops === 0 ? 'Direct' : `${stops} ${stops === 1 ? 'stop' : 'stops'}`}
                  </div>
                </div>
                
                <div className={styles.arrival}>
                  <div className={styles.time}>{arrivalTime}</div>
                  <div className={styles.airport}>{outboundSlice.destination.iata_code}</div>
                </div>
              </div>
              
              <button 
                className={styles.selectButton}
                onClick={() => selectFlight(flight)}
              >
                Select
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}