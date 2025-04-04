import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackBookingEvent, BOOKING_EVENTS } from '../../utils/analytics';
import styles from './Flights.module.css';
import FlightDetails from './FlightDetails';

const Flights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search parameters and results from location state
  const { searchParams, results } = location.state || {};
  
  // Define state variables
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({
    airlines: [],
    priceRange: [0, 2000],
    stops: 'any'
  });
  const [selectedFlight, setSelectedFlight] = useState(null);
  
  // Add this debugging code at the beginning of your component
  useEffect(() => {
    // Check if we received flight data
    console.log("Flights component received state:", location.state);
    
    if (location.state?.searchResults) {
      console.log(`Displaying ${location.state.searchResults.length} flights`);
      setFlights(location.state.searchResults);
      setSearchParams(location.state.searchParams);
    } else {
      console.log("No flight data in state, checking localStorage");
      // Try localStorage
      const storedFlights = localStorage.getItem('searchResults');
      if (storedFlights) {
        try {
          const parsed = JSON.parse(storedFlights);
          console.log(`Found ${parsed.length} flights in localStorage`);
          setFlights(parsed);
          
          const storedParams = localStorage.getItem('lastFlightSearch');
          if (storedParams) {
            setSearchParams(JSON.parse(storedParams));
          }
        } catch (e) {
          console.error("Error parsing stored flights:", e);
          navigate('/booking');
        }
      } else {
        // No flights found, go back to search
        console.log("No flights in localStorage either, returning to booking");
        navigate('/booking');
      }
    }
  }, [location, navigate]);

  // Process the flight data on component mount
  useEffect(() => {
    try {
      setLoading(true);
      
      if (!results) {
        setError("No flight results available");
        setLoading(false);
        return;
      }
      
      // Determine the structure of the results and extract the array
      let flightsArray = [];
      
      // Check if results is directly an array
      if (Array.isArray(results)) {
        flightsArray = results;
      } 
      // Check if results.data is an array
      else if (results.data && Array.isArray(results.data)) {
        flightsArray = results.data;
      } 
      // Check if it's another structure that might contain flights
      else if (typeof results === 'object') {
        console.log("Results structure:", results);
        // Try to find an array property in the results object
        const potentialArrays = Object.values(results).filter(Array.isArray);
        if (potentialArrays.length > 0) {
          flightsArray = potentialArrays[0]; // Use the first array found
        }
      }
      
      console.log("Processed flights array:", flightsArray);
      
      // Set the flights state with the extracted array
      setFlights(flightsArray);
      
      // Track the event only if we have actual flight results
      if (flightsArray.length > 0) {
        trackBookingEvent(BOOKING_EVENTS.SEARCH_RESULTS_VIEWED, {
          result_count: flightsArray.length,
          search_params: searchParams,
          filters_applied: currentFilters
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error processing flight results:", err);
      setError("Error processing flight results");
      setLoading(false);
    }
  }, [results, searchParams]);
  
  // Handle flight selection
  const handleFlightSelection = (flight) => {
    console.log("Selected flight:", flight); // Debug log
    
    // Store the flight in localStorage as backup
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
    
    // Navigate to the next page in the booking flow
    navigate('/booking/details', { 
      state: { 
        selectedFlight: flight,
        searchParams 
      } 
    });
    console.log("Navigation triggered to /booking/details");
  };

  const handleSelectFlight = (flight) => {
    navigate(`/flight/${flight.id}`, {
      state: {
        selectedFlight: flight,
        searchParams: searchParams
      }
    });
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Searching for the best flights...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error Loading Flights</h3>
        <p>{error}</p>
        <button 
          className={styles.backToSearch}
          onClick={() => navigate('/booking')}
        >
          Back to Search
        </button>
      </div>
    );
  }
  
  if (!flights || flights.length === 0) {
    return (
      <div className={styles.noFlightsContainer}>
        <h3>No Flights Found</h3>
        <p>We couldn't find any flights matching your search criteria.</p>
        <button 
          className={styles.backToSearch}
          onClick={() => navigate('/booking')}
        >
          Try Another Search
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.flightsContainer}>
      <h2>Flight Search Results</h2>
      <div className={styles.searchSummary}>
        <p>
          <strong>{searchParams?.origin}</strong> to <strong>{searchParams?.destination}</strong>
          <span className={styles.dateInfo}>
            {new Date(searchParams?.departDate).toLocaleDateString()}
            {searchParams?.returnDate && 
              ` - ${new Date(searchParams?.returnDate).toLocaleDateString()}`
            }
          </span>
        </p>
      </div>
      
      {selectedFlight ? (
        <FlightDetails 
          flight={selectedFlight} 
          onBack={() => setSelectedFlight(null)}
          onContinue={(flight) => {
            console.log("About to navigate with state:", {
              flight: selectedFlight,
              searchParams: searchParams,
              passengerCount: passengerCount
            });
            navigate('/booking/details', { state: { selectedFlight: flight }})
          }}
        />
      ) : (
        <div className={styles.flightsList}>
          {/* Now safely using flights.map since we know flights is an array */}
          {flights.map((flight, index) => (
            <div key={index} className={styles.flightCard}>
              <div className={styles.airline}>
                <span>{flight.airline?.name || flight.airline || 'Airline'}</span>
                <span className={styles.flightNumber}>{flight.flightNumber}</span>
              </div>
              
              <div className={styles.flightInfo}>
                <div className={styles.departure}>
                  <div className={styles.time}>{flight.departureTime}</div>
                  <div className={styles.airport}>{flight.origin}</div>
                </div>
                
                <div className={styles.flightDuration}>
                  <div className={styles.durationLine}></div>
                  <div className={styles.duration}>
                    {flight.duration}
                    {flight.stops > 0 && <span> • {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}</span>}
                  </div>
                </div>
                
                <div className={styles.arrival}>
                  <div className={styles.time}>{flight.arrivalTime}</div>
                  <div className={styles.airport}>{flight.destination}</div>
                </div>
              </div>
              
              <div className={styles.price}>
                ${typeof flight.price === 'number' ? flight.price.toFixed(2) : flight.price}
              </div>
              
              <button 
                className={styles.selectButton}
                onClick={() => {
                  console.log("Select button clicked", flight);
                  handleSelectFlight(flight);
                }}
              >
                Select Flight
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flights;