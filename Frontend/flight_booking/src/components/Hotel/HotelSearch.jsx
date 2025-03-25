import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaSearch, 
  FaStar, 
  FaConciergeBell, // Fixed capitalization (was FaConciergebell)
  FaGlassMartiniAlt, 
  FaSwimmingPool,
  FaSpa
} from 'react-icons/fa';
import styles from './Hotel.module.css';

const HotelSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('search');
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  // Luxury background images
  const backgrounds = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80'
  ];
  
  // Featured luxury experiences
  const luxuryExperiences = [
    {
      id: 1,
      title: 'Italian Riviera Getaway',
      location: 'Amalfi Coast, Italy',
      price: 589,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1548059686-8e5e9e632537?auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Overwater Bungalows',
      location: 'Bora Bora, French Polynesia',
      price: 1249,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Desert Oasis Retreat',
      location: 'Dubai, UAE',
      price: 899,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?auto=format&fit=crop&q=80'
    }
  ];

  // Cycle through backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prev => (prev + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!searchParams.destination || !searchParams.checkIn || !searchParams.checkOut) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      navigate('/hotels/listing', { 
        state: { searchParams }
      });
    } catch (err) {
      console.error('Error searching for hotels:', err);
      setError('Failed to search for hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedClick = (id) => {
    const experience = luxuryExperiences.find(exp => exp.id === id);
    setSearchParams({
      ...searchParams,
      destination: experience.location.split(',')[0]
    });
    setActiveSection('search');
  };

  return (
    <div 
      className={styles.luxuryContainer}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${backgrounds[backgroundIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background 1.5s ease-in-out'
      }}
    >
      <div className={styles.luxuryOverlay}>
        <div className={styles.luxuryHeader}>
          <h1 className={styles.luxuryHeading}>Discover Extraordinary Stays</h1>
          <div className={styles.goldDivider}></div>
          <p className={styles.luxurySubheading}>Indulge in world-class luxury accommodations curated for discerning travelers</p>
        </div>
        
        <div className={styles.luxuryTabs}>
          <button 
            className={`${styles.tabButton} ${activeSection === 'search' ? styles.activeTab : ''}`} 
            onClick={() => setActiveSection('search')}
          >
            <FaSearch /> Find Your Stay
          </button>
          <button 
            className={`${styles.tabButton} ${activeSection === 'experiences' ? styles.activeTab : ''}`}
            onClick={() => setActiveSection('experiences')}
          >
            <FaSpa /> Luxury Experiences
          </button>
          <button 
            className={`${styles.tabButton} ${activeSection === 'concierge' ? styles.activeTab : ''}`}
            onClick={() => setActiveSection('concierge')}
          >
            <FaConciergeBell /> Concierge Service
          </button>
        </div>
        
        <div className={styles.luxuryContent}>
          {activeSection === 'search' && (
            <div className={styles.searchGlassCard}>
              <form onSubmit={handleSearch} className={styles.luxurySearchForm}>
                <div className={styles.luxurySearchRow}>
                  <div className={styles.luxuryFormGroup}>
                    <label htmlFor="destination">
                      <FaMapMarkerAlt className={styles.luxuryIcon} /> Destination
                    </label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      placeholder="Where would you like to go?"
                      value={searchParams.destination}
                      onChange={handleInputChange}
                      required
                      className={styles.luxuryInput}
                    />
                  </div>
                </div>
                
                <div className={styles.luxurySearchRow}>
                  <div className={styles.luxuryFormGroup}>
                    <label htmlFor="checkIn">
                      <FaCalendarAlt className={styles.luxuryIcon} /> Check-in
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={searchParams.checkIn}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={styles.luxuryInput}
                    />
                  </div>
                  
                  <div className={styles.luxuryFormGroup}>
                    <label htmlFor="checkOut">
                      <FaCalendarAlt className={styles.luxuryIcon} /> Check-out
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={searchParams.checkOut}
                      onChange={handleInputChange}
                      min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                      required
                      className={styles.luxuryInput}
                    />
                  </div>
                </div>
                
                <div className={styles.luxurySearchRow}>
                  <div className={styles.luxuryFormGroup}>
                    <label htmlFor="guests">
                      <FaUser className={styles.luxuryIcon} /> Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={searchParams.guests}
                      onChange={handleInputChange}
                      className={styles.luxurySelect}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.luxuryFormGroup}>
                    <label htmlFor="rooms">
                      <FaUser className={styles.luxuryIcon} /> Rooms
                    </label>
                    <select
                      id="rooms"
                      name="rooms"
                      value={searchParams.rooms}
                      onChange={handleInputChange}
                      className={styles.luxurySelect}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.luxurySearchRow}>
                  <div className={styles.luxuryAmenities}>
                    <div className={styles.luxuryAmenity}>
                      <input type="checkbox" id="pool" />
                      <label htmlFor="pool"><FaSwimmingPool /> Pool</label>
                    </div>
                    <div className={styles.luxuryAmenity}>
                      <input type="checkbox" id="spa" />
                      <label htmlFor="spa"><FaSpa /> Spa</label>
                    </div>
                    <div className={styles.luxuryAmenity}>
                      <input type="checkbox" id="bar" />
                      <label htmlFor="bar"><FaGlassMartiniAlt /> Bar</label>
                    </div>
                  </div>
                </div>
                
                {error && <div className={styles.luxuryError}>{error}</div>}
                
                <button 
                  type="submit" 
                  className={styles.luxurySearchButton}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : (
                    <>
                      <FaSearch /> Discover Luxury Accommodations
                    </>
                  )}
                </button>
              </form>
              
              <div className={styles.luxuryPopularDestinations}>
                <h3>Trending Destinations</h3>
                <div className={styles.luxuryDestinationGrid}>
                  {['Santorini', 'Maldives', 'Monaco', 'Beverly Hills', 'Lake Como', 'St. Barths'].map(city => (
                    <button 
                      key={city}
                      className={styles.luxuryDestinationButton}
                      onClick={() => {
                        setSearchParams({
                          ...searchParams,
                          destination: city
                        });
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'experiences' && (
            <div className={styles.experiencesContainer}>
              <h2>Curated Luxury Experiences</h2>
              <div className={styles.experiencesGrid}>
                {luxuryExperiences.map(experience => (
                  <div 
                    key={experience.id} 
                    className={styles.experienceCard}
                    onClick={() => handleFeaturedClick(experience.id)}
                  >
                    <div className={styles.experienceImage} style={{backgroundImage: `url(${experience.image})`}}>
                      <div className={styles.experienceOverlay}>
                        <span className={styles.experiencePrice}>${experience.price}/night</span>
                      </div>
                    </div>
                    <div className={styles.experienceContent}>
                      <h3>{experience.title}</h3>
                      <p>{experience.location}</p>
                      <div className={styles.experienceRating}>
                        <span>{experience.rating}</span>
                        <FaStar />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeSection === 'concierge' && (
            <div className={styles.conciergeContainer}>
              <h2>Personal Concierge Service</h2>
              <p>Our team of travel experts is ready to create your perfect luxury getaway</p>
              
              <form className={styles.conciergeForm}>
                <div className={styles.luxuryFormGroup}>
                  <label>Your Name</label>
                  <input type="text" placeholder="Enter your full name" className={styles.luxuryInput} />
                </div>
                
                <div className={styles.luxuryFormGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" className={styles.luxuryInput} />
                </div>
                
                <div className={styles.luxuryFormGroup}>
                  <label>Tell us about your dream vacation</label>
                  <textarea 
                    rows="4" 
                    placeholder="Describe your ideal experience, preferences, and any special requests" 
                    className={styles.luxuryTextarea}
                  ></textarea>
                </div>
                
                <button type="button" className={styles.conciergeButton}>
                  <FaConciergeBell /> Connect with Concierge
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
