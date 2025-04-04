import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackBookingEvent, BOOKING_EVENTS } from '../../utils/analytics';
import styles from "./Booking.module.css";
import { 
  FaSearch, 
  FaPlane, 
  FaExchangeAlt, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaChevronDown 
} from 'react-icons/fa';
import { 
  trackFlightSearch, 
  trackItineraryView,
  trackBookingStart,
  trackBookingStep,
  trackBookingComplete,
  trackBookingAbandoned
} from "../../utils/eventTracking";
import flightApi from '../../services/flightApi';

const Booking = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundTrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [directOnly, setDirectOnly] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [apiUrl] = useState('http://localhost:3002'); // Your backend URL
  const [bookingState, setBookingState] = useState({
    started: false,
    step: 'search', // search -> results -> selection -> passenger_info -> payment -> confirmation
    startTime: null,
    flightSelected: null,
    completed: false
  });
  const [searchStatus, setSearchStatus] = useState('idle'); // idle, searching, polling, complete, error
  
  // Calculate total passengers
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  
  // Background image rotation
  const backgroundImages = [
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070",
    "https://images.unsplash.com/photo-1544013648-937f48e81472?q=80&w=2070",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070"
  ];
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  // Simple background rotation without complex transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prev => (prev + 1) % backgroundImages.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Close passenger dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPassengerDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Track time spent in booking flow
  useEffect(() => {
    if (bookingState.started && !bookingState.completed) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const startTime = new Date(bookingState.startTime || currentTime);
        const timeSpentSeconds = Math.floor((currentTime - startTime) / 1000);
        
        // Update local state with time spent (optional)
        setBookingState(prev => ({
          ...prev,
          timeSpentSeconds
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [bookingState.started, bookingState.completed, bookingState.startTime]);
  
  // Track abandoned bookings when component unmounts
  useEffect(() => {
    return () => {
      if (bookingState.started && !bookingState.completed) {
        trackBookingAbandoned(bookingState.step, {
          timeSpentSeconds: bookingState.timeSpentSeconds,
          origin: origin,
          destination: destination,
          selectedFlightId: bookingState.flightSelected?.id
        });
      }
    };
  }, [bookingState, origin, destination]);

  // Track component view
  useEffect(() => {
    // Track when a user visits the search page
    trackBookingEvent(BOOKING_EVENTS.SEARCH_INITIATED, {
      source: document.referrer,
    });
  }, []);
  
  // Update passenger count
  const updatePassengerCount = (type, action) => {
    setPassengers(prev => {
      const newCount = {...prev};
      
      if (action === 'add') {
        // Check maximum passengers limit
        if (totalPassengers < 9) {
          newCount[type] += 1;
        }
      } else if (action === 'remove') {
        // Ensure we don't go below minimums
        if (type === 'adults' && newCount.adults > 1) {
          newCount.adults -= 1;
          // Ensure infants don't exceed adults
          if (newCount.infants > newCount.adults) {
            newCount.infants = newCount.adults;
          }
        } else if (type !== 'adults' && newCount[type] > 0) {
          newCount[type] -= 1;
        }
      }
      
      return newCount;
    });
  };
  
  // Update the handleSearch function
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (!origin || !destination || !departDate || (tripType === 'roundTrip' && !returnDate)) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearchProgress(10);
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      // Format search parameters correctly
      const searchParams = {
        origin: origin, // Use your actual state variables
        destination: destination,
        departure_date: departDate,
        return_date: tripType === 'roundTrip' ? returnDate : null,
        adults: passengers.adults,
        children: passengers.children,
        infants: passengers.infants,
        cabin_class: cabinClass.toLowerCase().replace(' ', '_')
      };
      
      console.log("Search params:", searchParams);
      
      // Track search event
      trackFlightSearch(searchParams);
      
      // This is the correct way to call your API
      try {
        // Try the real API first
        const results = await flightApi.searchFlights(searchParams);
        
        setSearchProgress(100);
        clearInterval(progressInterval);
        
        console.log("API results:", results);
        
        // Navigate to results page
        navigate('/flight-results', {
          state: {
            results: results,
            searchParams: {
              ...searchParams,
              tripType: tripType,
              departureDate: departDate,
              returnDate: returnDate,
              passengers: totalPassengers,
              travelClass: cabinClass
            }
          }
        });
      } catch (apiError) {
        console.error("API Error:", apiError);
        
        // Fall back to mock data for demonstration
        console.log("Falling back to mock data");
        const mockFlights = generateMockFlightResults(searchParams);
        
        navigate('/flight-results', {
          state: {
            results: { flights: mockFlights },
            searchParams: {
              origin: origin,
              destination: destination,
              departureDate: departDate,
              returnDate: returnDate,
              passengers: totalPassengers,
              travelClass: cabinClass,
              tripType: tripType === 'roundTrip' ? 'roundtrip' : 'oneway'
            }
          }
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`Search failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      setSearchProgress(100);
    }
  };

  // Add this temporary mock data generator function
  const generateMockFlightResults = (searchParams) => {
    const flights = [];
    const airlines = [
      { name: 'SkyJourney Airways', code: 'SJ' },
      { name: 'Blue Horizon', code: 'BH' },
      { name: 'Global Express', code: 'GX' },
      { name: 'Atlantic Wings', code: 'AW' }
    ];
    
    // Generate 5-10 mock flights
    const numFlights = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < numFlights; i++) {
      const airline = airlines[i % airlines.length];
      const basePrice = Math.floor(Math.random() * 300) + 150;
      const durationMinutes = Math.floor(Math.random() * 180) + 60;
      
      // Create departure and arrival times
      const departDate = new Date(searchParams.departure_date);
      departDate.setHours(7 + i, Math.floor(Math.random() * 50), 0);
      
      const arriveDate = new Date(departDate);
      arriveDate.setMinutes(arriveDate.getMinutes() + durationMinutes);
      
      const flight = {
        id: `mock-flight-${i}`,
        owner: {
          name: airline.name,
          iata_code: airline.code
        },
        slices: [{
          origin: {
            iata_code: searchParams.origin,
            name: `${searchParams.origin} International Airport`
          },
          destination: {
            iata_code: searchParams.destination,
            name: `${searchParams.destination} International Airport`
          },
          duration: durationMinutes,
          segments: [{
            departing_at: departDate.toISOString(),
            arriving_at: arriveDate.toISOString(),
            origin: {
              iata_code: searchParams.origin,
              name: `${searchParams.origin} International Airport`
            },
            destination: {
              iata_code: searchParams.destination,
              name: `${searchParams.destination} International Airport`
            },
            operating_carrier: {
              name: airline.name,
              iata_code: airline.code
            }
          }]
        }],
        total_amount: basePrice,
        total_currency: 'USD'
      };
      
      flights.push(flight);
    }
    
    return flights;
  };

  const handleFlightSelect = (flight) => {
    // Track itinerary view/selection
    trackItineraryView(flight);
    
    // Track booking start
    trackBookingStart(flight);
    
    // Update booking state
    setBookingState({
      ...bookingState,
      step: 'passenger_info',
      flightSelected: flight
    });
    
    // Your existing flight selection logic

    // Track selection event
    if (window.posthog) {
      window.posthog.capture('flight_selected', {
        flightId: flight.id,
        airline: flight.airline,
        price: flight.price,
        origin: flight.origin,
        destination: flight.destination
      });
    }
  };
  
  const handlePassengerInfoSubmit = (passengerData) => {
    // Track passenger info step completion
    trackBookingStep('passenger_info_completed', { 
      passengerCount: passengerData.length
    });
    
    // Update booking state
    setBookingState({
      ...bookingState,
      step: 'payment'
    });
    
    // Your existing passenger info handling logic
  };
  
  const handlePaymentSubmit = (paymentData) => {
    // Track payment step
    trackBookingStep('payment_initiated', {
      paymentMethod: paymentData.method
    });
    
    // Your existing payment processing logic
    processPayment(paymentData).then(result => {
      if (result.success) {
        // Track successful booking
        trackBookingComplete({
          id: result.bookingId,
          amount: result.amount,
          currency: result.currency,
          paymentMethod: paymentData.method,
          passengerCount: bookingState.passengerData?.length || 1,
          origin: origin,
          destination: destination
        });
        
        // Update booking state
        setBookingState({
          ...bookingState,
          step: 'confirmation',
          completed: true
        });

        // Track booking completion
        if (window.posthog) {
          window.posthog.capture('booking_completed', {
            bookingId: result.bookingId,
            totalAmount: result.amount,
            paymentMethod: paymentData.method,
            passengers: bookingState.passengerData?.length || 1
          });
        }
      } else {
        // Track payment failure
        trackBookingAbandoned('payment_failed', {
          errorCode: result.errorCode,
          errorMessage: result.errorMessage,
          timeSpentSeconds: bookingState.timeSpentSeconds
        });
      }
    });
  };

  return (
    <div className={styles.bookingHero} style={{
      backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
    }}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Where Will Your Journey Take You?</h1>
        <p className={styles.heroSubtitle}>Discover amazing flights at the best prices</p>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.tripTypeSelector}>
          <button 
            type="button"
            className={`${styles.tripTypeButton} ${tripType === 'oneWay' ? styles.activeTrip : ''}`}
            onClick={() => setTripType('oneWay')}
          >
            <FaPlane className={styles.tripIcon} />
            <span>One Way</span>
          </button>
          <button 
            type="button"
            className={`${styles.tripTypeButton} ${tripType === 'roundTrip' ? styles.activeTrip : ''}`}
            onClick={() => setTripType('roundTrip')}
          >
            <FaExchangeAlt className={styles.tripIcon} />
            <span>Round Trip</span>
          </button>
          <button 
            type="button"
            className={`${styles.tripTypeButton} ${tripType === 'multiCity' ? styles.activeTrip : ''}`}
            onClick={() => setTripType('multiCity')}
          >
            <FaGlobe className={styles.tripIcon} />
            <span>Multi-City</span>
          </button>
        </div>
      
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.mainSearchGrid}>
            <div className={styles.locationSection}>
              <div className={styles.formField}>
                <label>From</label>
                <div className={styles.inputWithIcon}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <input 
                    type="text" 
                    placeholder="City or Airport"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className={styles.swapButton}
                onClick={() => {
                  const tempOrigin = origin;
                  setOrigin(destination);
                  setDestination(tempOrigin);
                }}
              >
                <FaExchangeAlt />
              </button>
              
              <div className={styles.formField}>
                <label>To</label>
                <div className={styles.inputWithIcon}>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  <input 
                    type="text" 
                    placeholder="City or Airport"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.dateSection}>
              <div className={styles.formField}>
                <label>Depart</label>
                <div className={styles.inputWithIcon}>
                  <FaCalendarAlt className={styles.inputIcon} />
                  <input 
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {tripType === 'roundTrip' && (
                <div className={styles.formField}>
                  <label>Return</label>
                  <div className={styles.inputWithIcon}>
                    <FaCalendarAlt className={styles.inputIcon} />
                    <input 
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required={tripType === 'roundTrip'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.optionsSection}>
            <div className={styles.formField}>
              <label>Travelers</label>
              <div 
                className={styles.passengerSelector} 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPassengerDropdown(prev => !prev);
                }}
              >
                <FaUserFriends className={styles.inputIcon} />
                <div className={styles.passengerInfo}>
                  <span className={styles.passengerCount}>
                    {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
                  </span>
                  <span className={styles.passengerBreakdown}>
                    {passengers.adults} {passengers.adults === 1 ? 'Adult' : 'Adults'}
                    {passengers.children > 0 && `, ${passengers.children} ${passengers.children === 1 ? 'Child' : 'Children'}`}
                    {passengers.infants > 0 && `, ${passengers.infants} ${passengers.infants === 1 ? 'Infant' : 'Infants'}`}
                  </span>
                </div>
                <FaChevronDown className={styles.dropdownIcon} />
              </div>
              
              {showPassengerDropdown && (
                <div 
                  className={styles.passengerDropdown} 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.passengerType}>
                    <div className={styles.passengerTypeInfo}>
                      <span className={styles.passengerTypeTitle}>Adults</span>
                      <span className={styles.passengerTypeSubtitle}>Age 12+</span>
                    </div>
                    <div className={styles.passengerControls}>
                      <button 
                        type="button" 
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('adults', 'remove')}
                        disabled={passengers.adults <= 1}
                      >
                        -
                      </button>
                      <span>{passengers.adults}</span>
                      <button 
                        type="button"
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('adults', 'add')}
                        disabled={totalPassengers >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.passengerType}>
                    <div className={styles.passengerTypeInfo}>
                      <span className={styles.passengerTypeTitle}>Children</span>
                      <span className={styles.passengerTypeSubtitle}>Age 2-11</span>
                    </div>
                    <div className={styles.passengerControls}>
                      <button 
                        type="button"
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('children', 'remove')}
                        disabled={passengers.children <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.children}</span>
                      <button 
                        type="button"
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('children', 'add')}
                        disabled={totalPassengers >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.passengerType}>
                    <div className={styles.passengerTypeInfo}>
                      <span className={styles.passengerTypeTitle}>Infants</span>
                      <span className={styles.passengerTypeSubtitle}>Under 2</span>
                    </div>
                    <div className={styles.passengerControls}>
                      <button 
                        type="button"
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('infants', 'remove')}
                        disabled={passengers.infants <= 0}
                      >
                        -
                      </button>
                      <span>{passengers.infants}</span>
                      <button 
                        type="button"
                        className={styles.passengerButton}
                        onClick={() => updatePassengerCount('infants', 'add')}
                        disabled={totalPassengers >= 9 || passengers.infants >= passengers.adults}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.formField}>
              <label>Cabin Class</label>
              <div className={styles.cabinClassSelector}>
                <select 
                  className={styles.cabinSelect}
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First Class</option>
                </select>
                <FaChevronDown className={styles.selectArrow} />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={directOnly}
                  onChange={() => setDirectOnly(prev => !prev)}
                />
                <span>Direct flights only</span>
              </label>
            </div>
          </div>
          
          <div className={styles.searchButtonContainer}>
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <FaSearch /> Search Flights
                </>
              )}
            </button>
            
            {loading && (
              <div className={styles.searchProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${searchProgress}%` }}
                  ></div>
                </div>
                <p className={styles.progressText}>
                  Searching for the best flights... {searchProgress}%
                </p>
              </div>
            )}
            
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
        </form>
      </div>
      
      <div className={styles.premiumFeatures}>
        <div className={styles.featureBadge}>
          <FaPlane className={styles.featureIcon} />
          <span>Best Price Guarantee</span>
        </div>
        <div className={styles.featureBadge}>
          <FaPlane className={styles.featureIcon} />
          <span>No Hidden Fees</span>
        </div>
        <div className={styles.featureBadge}>
          <FaPlane className={styles.featureIcon} />
          <span>24/7 Customer Support</span>
        </div>
      </div>
    </div>
  );
}

export default Booking;