import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Flights.module.css';
import { FaArrowRight, FaExchangeAlt, FaPlane, FaClock, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

export default function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [searchDetails, setSearchDetails] = useState({}); 
  
  // Get results from location state or use empty array
  const { searchParams } = location.state || {};

  // Initialize search details on component mount
  useEffect(() => {
    if (searchParams) {
      setSearchDetails({
        origin: searchParams.origin || '',
        destination: searchParams.destination || '',
        departureDate: searchParams.departDate || new Date().toISOString(),
        returnDate: searchParams.returnDate,
        tripType: searchParams.tripType || 'oneway',
        passengers: `${searchParams.passengers?.adults || 1} Adult${
          searchParams.passengers?.adults !== 1 ? 's' : ''
        }${
          searchParams.passengers?.children 
            ? `, ${searchParams.passengers?.children} Child${
                searchParams.passengers?.children !== 1 ? 'ren' : ''
              }` 
            : ''
        }${
          searchParams.passengers?.infants 
            ? `, ${searchParams.passengers?.infants} Infant${
                searchParams.passengers?.infants !== 1 ? 's' : ''
              }` 
            : ''
        }`,
        travelClass: searchParams.cabinClass || 'Economy'
      });
    }
  }, [searchParams]);
  
  // Verify we have the location state on component mount
  useEffect(() => {
    if (!location.state) {
      console.warn("FlightResults: No location state provided");
      setError("Flight search data is missing. Please try a new search.");
    } else {
      console.log("Flight results received:", results);
      console.log("Search details:", searchDetails);
    }
  }, [location.state, results, searchDetails]);

  useEffect(() => {
    console.log("FlightResults component mounted");
    console.log("Location state:", location.state);
    
    if (!location.state || !location.state.results) {
      console.error("No flight data in location state");
      setError("No flight search results found. Please try a new search.");
      setLoading(false);
      return;
    }
    
    const { results } = location.state;
    
    // Handle both data structures (direct flights array or nested in .flights)
    const flightData = results.flights || results;
    setResults(flightData);
    setLoading(false);
  }, [location]);
  
  // Handle missing data case
  if (loading) {
    return <div className={styles.loading}>Loading flights...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/booking')}
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className={styles.noResults}>
        <h2>No Flights Found</h2>
        <p>We couldn't find any flights matching your criteria.</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/booking')}
        >
          Try a New Search
        </button>
      </div>
    );
  }
  
  // Display the search summary
  const renderSearchSummary = () => {
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
            <span className={styles.value}>
              {new Date(searchDetails.departureDate).toLocaleDateString()}
            </span>
          </div>
          
          {searchDetails.returnDate && (
            <div className={styles.detailItem}>
              <span className={styles.label}>Return:</span>
              <span className={styles.value}>
                {new Date(searchDetails.returnDate).toLocaleDateString()}
              </span>
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
          onClick={() => navigate('/booking', { state: { prefill: searchParams } })}
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
        {(results || []).map((flight, index) => {
          // Map Duffel API structure to expected display format
          const departureSegment = flight.slices?.[0]?.segments?.[0] || {};
          const arrivalSegment = flight.slices?.[0]?.segments?.[flight.slices?.[0]?.segments?.length - 1] || {};
          
          const formattedFlight = {
            id: flight.id,
            airline: {
              name: flight.owner?.name || 'Airline',
              logo: `https://daisycon.io/images/airline/?width=100&height=50&color=ffffff&iata=${flight.owner?.iata_code || 'XX'}`
            },
            price: parseFloat(flight.total_amount || 0),
            origin: departureSegment.origin?.iata_code || flight.slices?.[0]?.origin?.iata_code || 'XXX',
            destination: arrivalSegment.destination?.iata_code || flight.slices?.[0]?.destination?.iata_code || 'XXX',
            departureTime: new Date(departureSegment.departing_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            arrivalTime: new Date(arrivalSegment.arriving_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            duration: `${Math.floor(flight.slices?.[0]?.duration / 60)}h ${flight.slices?.[0]?.duration % 60}m`,
            stops: (flight.slices?.[0]?.segments?.length || 1) - 1
          };
        
          return (
            <div key={index} className={styles.flightCard}>
              <div className={styles.flightHeader}>
                <div className={styles.airline}>
                  <img 
                    src={formattedFlight.airline.logo}
                    alt={formattedFlight.airline.name} 
                    className={styles.airlineLogo} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40?text=Airline';
                    }}
                  />
                  <span>{formattedFlight.airline.name}</span>
                </div>
                <div className={styles.flightPrice}>
                  <span className={styles.price}>${formattedFlight.price.toFixed(2)}</span>
                  <span className={styles.perPerson}>per person</span>
                </div>
              </div>
              
              <div className={styles.flightDetails}>
                <div className={styles.departure}>
                  <div className={styles.time}>{formattedFlight.departureTime}</div>
                  <div className={styles.airport}>{formattedFlight.origin}</div>
                </div>
                
                <div className={styles.flightPath}>
                  <div className={styles.duration}>
                    <FaClock />
                    <span>{formattedFlight.duration}</span>
                  </div>
                  <div className={styles.pathLine}></div>
                  <div className={styles.stopInfo}>
                    {formattedFlight.stops === 0 ? 'Direct' : `${formattedFlight.stops} ${formattedFlight.stops === 1 ? 'stop' : 'stops'}`}
                  </div>
                </div>
                
                <div className={styles.arrival}>
                  <div className={styles.time}>{formattedFlight.arrivalTime}</div>
                  <div className={styles.airport}>{formattedFlight.destination}</div>
                </div>
              </div>
              
              <button 
                className={styles.selectButton}
                onClick={() => {
                  console.log("Selected flight:", flight);
                  navigate(`/flight/${flight.id}`, { 
                    state: { 
                      selectedFlight: flight, 
                      searchParams: searchParams 
                    } 
                  });
                }}
              >
                Select Flight
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}