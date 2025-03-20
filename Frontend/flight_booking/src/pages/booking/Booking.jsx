import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Booking.module.css';
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

export default function BookingEmergency() {
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
  
  // Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearchProgress(0);
    
    // Progress simulation for Duffel API (which can take 15-30 seconds)
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 1000);
    
    try {
      // Format search parameters according to Duffel API requirements
      const formattedParams = {
        data: {
          slices: [
            {
              origin: origin,
              destination: destination,
              departure_date: departDate
            }
          ],
          passengers: [
            ...Array(passengers.adults).fill().map(() => ({ type: 'adult' })),
            ...Array(passengers.children).fill().map(() => ({ type: 'child' })),
            ...Array(passengers.infants).fill().map(() => ({ type: 'infant_without_seat' }))
          ],
          cabin_class: cabinClass.toLowerCase().replace(' ', '_')
        }
      };
      
      // Add return flight if round trip
      if (tripType === 'roundTrip' && returnDate) {
        formattedParams.data.slices.push({
          origin: destination,
          destination: origin,
          departure_date: returnDate
        });
      }
      
      console.log("Searching flights with params:", formattedParams);
      
      // Make API request with error handling
      try {
        const response = await fetch(`${apiUrl}/api/flights/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedParams),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          throw new Error(`API error ${response.status}: ${errorData.error || response.statusText}`);
        }
        
        const results = await response.json();
        
        // Complete progress bar
        clearInterval(progressInterval);
        setSearchProgress(100);
        
        if (!results.data || !Array.isArray(results.data)) {
          console.error('Invalid API response format:', results);
          throw new Error('The server returned an invalid response format');
        }
        
        // Navigate to results page with real API data
        navigate('/flights', { 
          state: { 
            results: results,
            searchParams: formattedParams.data,
            isMockData: false // Explicitly set this
          } 
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Search error:", err);
      setError(`We couldn't find any flights: ${err.message}`);
    } finally {
      setLoading(false);
    }
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