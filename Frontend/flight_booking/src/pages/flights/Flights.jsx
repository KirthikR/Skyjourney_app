import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Flights.module.css";
import { searchFlights } from "../../services/api";
import { FaPlane, FaCalendar, FaUser, FaMoneyBillWave, FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { format, parseISO, intervalToDuration } from 'date-fns';

export default function Flights() {
  const location = useLocation();
  const navigate = useNavigate();
  const flightListRef = useRef(null);
  
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchProgress, setSearchProgress] = useState(10);
  const [isMockData, setIsMockData] = useState(false);

  // Replace your current useEffect with this version:
  useEffect(() => {
    console.log('Flights component mounted with state:', {
      locationState: location.state,
      hasResults: !!location.state?.results,
      hasSearchParams: !!location.state?.searchParams
    });

    // Only proceed with fetching flights if we have search parameters
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
      fetchFlights();
    } else {
      // Instead of redirecting, just stop loading and clear any existing flights
      setLoading(false);
      setFlights([]);
    }
  }, [location.state]);

  // Update fetchFlights function to handle Duffel API response
  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting real-time flight search with Duffel API');
      console.log('Search parameters:', searchParams);
      
      // Don't attempt search if we don't have data
      if (!location.state) {
        throw new Error('No search data available');
      }
      
      if (location.state?.results) {
        const apiResponse = location.state.results;
        console.log('Duffel API response received successfully');
        
        // Check for Duffel API response format (data is an array of offers)
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          setFlights(apiResponse.data);
          setIsMockData(location.state.isMockData || false);
          console.log(`Found ${apiResponse.data.length} flights`);
        } else {
          console.error('Invalid API response format:', typeof apiResponse);
          throw new Error('The flight data is not in the expected format');
        }
      } else {
        throw new Error('No search results found');
      }
    } catch (err) {
      console.error('Flight search error:', err);
      setError('We couldn\'t load the flight results. Please try searching again.');
    } finally {
      setLoading(false);
    }
  };

  // Add this to your fetchFlights function
  useEffect(() => {
    if (flights && flights.length > 0) {
      // Log the first flight structure to help with debugging
      console.log('Sample flight data structure:', flights[0]);
      
      // Check for potential issues
      flights.forEach((flight, index) => {
        if (!flight.slices || !Array.isArray(flight.slices)) {
          console.warn(`Flight at index ${index} has invalid slices:`, flight.slices);
        } else {
          flight.slices.forEach((slice, sliceIndex) => {
            if (!slice.departing_at) {
              console.warn(`Flight ${index}, slice ${sliceIndex} missing departing_at`);
            }
            if (!slice.arriving_at) {
              console.warn(`Flight ${index}, slice ${sliceIndex} missing arriving_at`);
            }
          });
        }
      });
    }
  }, [flights]);

  const handleNewSearch = () => {
    navigate('/booking');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Update the formatTime and formatDate functions with safer handling
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'; // Handle undefined dates
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Handle undefined dates
    try {
      return format(parseISO(dateString), 'EEE, MMM d');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const handleSelectFlight = (offer) => {
    // Fix the searchParams key name to match what's expected
    navigate('/booking/details', { 
      state: { 
        selectedOffer: offer,
        searchParams: searchParams // Instead of location.state.searchData which doesn't exist
      } 
    });
  };

  const scrollLeft = () => {
    if (flightListRef.current) {
      flightListRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (flightListRef.current) {
      flightListRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Add a progress polling function
  const pollSearchProgress = async (searchId) => {
    let progress = 10;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 95) clearInterval(interval);
      setSearchProgress(progress);
    }, 1000);
    
    // Clear on component unmount
    return () => clearInterval(interval);
  };

  // Add a safer way to render flight segments
  const renderFlightSlices = (flight) => {
    if (!flight.slices || !Array.isArray(flight.slices) || flight.slices.length === 0) {
      return (
        <div className={styles.flightInfo}>
          <p>Flight details unavailable</p>
        </div>
      );
    }

    return flight.slices.map((slice, index) => (
      <div key={index} className={styles.flightInfo}>
        <div className={styles.routeInfo}>
          <div className={styles.timeInfo}>
            <span className={styles.time}>{formatTime(slice?.departing_at)}</span>
            <span className={styles.airport}>{slice?.origin?.iata_code || 'N/A'}</span>
          </div>
          
          <div className={styles.flightDuration}>
            <span>{slice?.duration ? formatDuration(slice.duration) : 'N/A'}</span>
            <div className={styles.durationLine}>
              <div className={styles.plane}><FaPlane /></div>
            </div>
            <span className={styles.stops}>
              {slice?.segments?.length > 1 ? `${slice.segments.length - 1} stop(s)` : 'Direct'}
            </span>
          </div>
          
          <div className={styles.timeInfo}>
            <span className={styles.time}>{formatTime(slice?.arriving_at)}</span>
            <span className={styles.airport}>{slice?.destination?.iata_code || 'N/A'}</span>
          </div>
        </div>
        
        <div className={styles.dateInfo}>
          <span>{formatDate(slice?.departing_at)}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.flightsHeader}>
        <h1>Available Flights</h1>
        <div className={styles.headerButtons}>
          <button onClick={handleNewSearch} className={styles.searchBtn}>
            New Search
          </button>
        </div>
      </div>
      
      {/* Search summary */}
      {searchParams && (
        <div className={styles.searchSummary}>
          <div className={styles.summaryItem}>
            <FaPlane className={styles.summaryIcon} />
            <span>
              {searchParams.slices[0]?.origin} to {searchParams.slices[0]?.destination}
              {searchParams.slices[1] && ` (Round Trip)`}
            </span>
          </div>
          
          <div className={styles.summaryItem}>
            <FaCalendar className={styles.summaryIcon} />
            <span>
              {searchParams.slices[0]?.departure_date}
              {searchParams.slices[1] && ` - ${searchParams.slices[1].departure_date}`}
            </span>
          </div>
          
          <div className={styles.summaryItem}>
            <FaUser className={styles.summaryIcon} />
            <span>{searchParams.passengers?.length} passengers</span>
          </div>
        </div>
      )}

      {/* Mock data banner - keep this for API mock data, not popular flights */}
      {isMockData && (
        <div className={styles.mockDataBanner}>
          <FaInfoCircle />
          <span>Showing demo flights. Connect to your API for real data.</span>
        </div>
      )}

      {/* No search parameters message - show when accessed directly */}
      {!loading && !error && !searchParams && (
        <div className={styles.startSearchContainer}>
          <FaPlane className={styles.bigIcon} />
          <h2>Start Your Flight Search</h2>
          <p>Enter your travel details to find available flights.</p>
          <button onClick={handleNewSearch} className={styles.primaryButton}>
            Search Flights
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{width: `${searchProgress}%`}}
            />
          </div>
          <p>Searching for the best flights... {searchProgress}%</p>
          <span className={styles.loadingSubtext}>
            This may take 15-30 seconds as we check availability with airlines
          </span>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={handleNewSearch} className={styles.primaryButton}>
              Try a Different Search
            </button>
            <button onClick={fetchFlights} className={styles.secondaryButton}>
              Retry Current Search
            </button>
          </div>
        </div>
      )}

      {/* No results state */}
      {!loading && !error && searchParams && flights.length === 0 && (
        <div className={styles.emptyResults}>
          <FaPlane className={styles.bigIcon} />
          <h2>No Flights Found</h2>
          <p>We couldn't find any flights matching your search criteria.</p>
          <button onClick={handleNewSearch} className={styles.primaryButton}>
            Modify Search
          </button>
        </div>
      )}

      {/* Results list */}
      {!loading && !error && flights.length > 0 && (
        <>
          <h2 className={styles.resultsCount}>{flights.length} Flights Available</h2>
          <div className={styles.flightList} ref={flightListRef}>
            {flights.map(flight => (
              <div key={flight.id || Math.random()} className={styles.flightCard} onClick={() => handleSelectFlight(flight)}>
                <div className={styles.airline}>
                  <span>{flight.owner?.name || 'Airline'}</span>
                </div>
                
                {renderFlightSlices(flight)}
                
                <div className={styles.priceInfo}>
                  <span className={styles.price}>
                    {flight.total_currency || 'USD'} {flight.total_amount || 'N/A'}
                  </span>
                  <button className={styles.selectButton}>
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.scrollButtons}>
            <button onClick={scrollLeft} className={styles.scrollButton}>
              <FaChevronLeft />
            </button>
            <button onClick={scrollRight} className={styles.scrollButton}>
              <FaChevronRight />
            </button>
          </div>
          
          <div className={styles.bookingLinkContainer}>
            <button 
              onClick={handleNewSearch}
              className={styles.bookingButton}
            >
              Search New Flights
            </button>
          </div>
        </>
      )}
    </div>
  );
}