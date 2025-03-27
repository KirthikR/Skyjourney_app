import React, { useState, useEffect } from 'react';
import { 
  FaCar, FaMapMarkerAlt, FaCalendarAlt, FaSearch, 
  FaTachometerAlt, FaGasPump, FaCogs, FaUsers, 
  FaSuitcase, FaSnowflake, FaWifi, FaShieldAlt, 
  FaChevronDown, FaChevronUp, FaStar, FaCheckCircle,
  FaClock, FaChevronRight, FaGlobe, FaHandshake,
  FaCommentDollar, FaHeadset
} from 'react-icons/fa';
import styles from './CarHire.module.css';

const CarHire = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState('all');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    vehicleCategory: 'all'
  });

  // Animation on load
  useEffect(() => {
    setIsLoaded(true);
    setFeaturedCars(luxuryVehicles);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVehicleCategoryChange = (category) => {
    setSelectedVehicleCategory(category);
    setFormData({
      ...formData,
      vehicleCategory: category
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search parameters:', formData);
    // In real application, this would trigger API call and route to search results
    alert('Search functionality will be implemented in the next sprint!');
  };

  // Luxury vehicle data
  const luxuryVehicles = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class',
      category: 'luxury-sedan',
      image: 'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fallbackImage: 'https://images.unsplash.com/photo-1622037022788-6fd2d172c05e?auto=format&fit=crop&q=80&w=1000',
      price: 299,
      rating: 4.9,
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      features: ['Leather interior', 'Panoramic roof', 'Massage seats', 'Driver assistance'],
      availableLocations: ['New York', 'Los Angeles', 'Miami', 'Las Vegas'],
      discount: 0
    },
    {
      id: 2,
      name: 'Range Rover Autobiography',
      category: 'luxury-suv',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fallbackImage: 'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=1200',
      price: 349,
      rating: 4.8,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      features: ['Off-road capability', 'Premium audio', 'Heated seats', 'Advanced 4x4'],
      availableLocations: ['London', 'Dubai', 'Geneva', 'Paris'],
      discount: 10
    },
    {
      id: 3,
      name: 'Ferrari 488 Spider',
      category: 'sports',
      image: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fallbackImage: 'https://images.pexels.com/photos/6894427/pexels-photo-6894427.jpeg?auto=compress&cs=tinysrgb&w=1200',
      price: 899,
      rating: 5.0,
      seats: 2,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      features: ['Convertible roof', 'Carbon fiber interior', 'Sport mode', 'Track-ready'],
      availableLocations: ['Monaco', 'Miami', 'Dubai', 'Los Angeles'],
      discount: 0
    },
    {
      id: 4,
      name: 'Bentley Continental GT',
      category: 'luxury-coupe',
      image: 'https://images.pexels.com/photos/6894428/pexels-photo-6894428.jpeg?auto=compress&cs=tinysrgb&w=1200',
      fallbackImage: 'https://images.pexels.com/photos/9607196/pexels-photo-9607196.jpeg?auto=compress&cs=tinysrgb&w=1200',
      price: 649,
      rating: 4.9,
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      features: ['Handcrafted interior', 'Bentley Dynamic Ride', 'Bang & Olufsen audio', 'All-wheel drive'],
      availableLocations: ['London', 'New York', 'Paris', 'Geneva'],
      discount: 5
    }
  ];

  // Popular destinations
  const popularDestinations = [
    { name: 'London', icon: '🇬🇧' },
    { name: 'Paris', icon: '🇫🇷' },
    { name: 'New York', icon: '🇺🇸' },
    { name: 'Dubai', icon: '🇦🇪' },
    { name: 'Tokyo', icon: '🇯🇵' },
    { name: 'Rome', icon: '🇮🇹' }
  ];

  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackSrc;
  };

  return (
    <div className={styles.carHireContainer}>
      {/* Hero Section with Parallax Effect */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroText} ${isLoaded ? styles.loaded : ''}`}>
            <h1>Luxury Car Hire</h1>
            <p>Experience the extraordinary with our premium fleet of vehicles</p>
          </div>
        </div>
        <div className={styles.heroDivider}></div>
      </div>

      {/* Search Panel */}
      <div className={styles.searchPanelWrapper}>
        <div className={styles.searchPanel}>
          <div className={styles.searchPanelHeader}>
            <h2>Find Your Perfect Ride</h2>
            <p>Exclusive selection of premium and luxury vehicles</p>
          </div>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  Pick-up Location
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="City, airport or station"
                  required
                />
              </div>
              
              <div className={styles.dateTimeGroup}>
                <div className={styles.formGroup}>
                  <label>
                    <FaCalendarAlt className={styles.inputIcon} />
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Time</label>
                  <select
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={`pickup-${i}`} value={`${i < 10 ? '0' + i : i}:00`}>
                        {`${i < 10 ? '0' + i : i}:00`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>
                  <FaMapMarkerAlt className={styles.inputIcon} />
                  Return Location
                </label>
                <input
                  type="text"
                  name="returnLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Same as pick-up"
                />
              </div>
              
              <div className={styles.dateTimeGroup}>
                <div className={styles.formGroup}>
                  <label>
                    <FaCalendarAlt className={styles.inputIcon} />
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required
                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Time</label>
                  <select
                    name="returnTime"
                    value={formData.returnTime}
                    onChange={handleInputChange}
                    required
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={`return-${i}`} value={`${i < 10 ? '0' + i : i}:00`}>
                        {`${i < 10 ? '0' + i : i}:00`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.vehicleCategories}>
              <div className={styles.categoryHeader}>
                <h3>Vehicle Category</h3>
                <p>Select your preferred type of vehicle</p>
              </div>
              
              <div className={styles.categoryOptions}>
                <div 
                  className={`${styles.categoryOption} ${selectedVehicleCategory === 'all' ? styles.selectedCategory : ''}`}
                  onClick={() => handleVehicleCategoryChange('all')}
                >
                  <FaCar className={styles.categoryIcon} />
                  <span>All</span>
                </div>
                
                <div 
                  className={`${styles.categoryOption} ${selectedVehicleCategory === 'luxury-sedan' ? styles.selectedCategory : ''}`}
                  onClick={() => handleVehicleCategoryChange('luxury-sedan')}
                >
                  <FaCar className={styles.categoryIcon} />
                  <span>Luxury Sedan</span>
                </div>
                
                <div 
                  className={`${styles.categoryOption} ${selectedVehicleCategory === 'luxury-suv' ? styles.selectedCategory : ''}`}
                  onClick={() => handleVehicleCategoryChange('luxury-suv')}
                >
                  <FaCar className={styles.categoryIcon} />
                  <span>Luxury SUV</span>
                </div>
                
                <div 
                  className={`${styles.categoryOption} ${selectedVehicleCategory === 'sports' ? styles.selectedCategory : ''}`}
                  onClick={() => handleVehicleCategoryChange('sports')}
                >
                  <FaCar className={styles.categoryIcon} />
                  <span>Sports</span>
                </div>
                
                <div 
                  className={`${styles.categoryOption} ${selectedVehicleCategory === 'luxury-coupe' ? styles.selectedCategory : ''}`}
                  onClick={() => handleVehicleCategoryChange('luxury-coupe')}
                >
                  <FaCar className={styles.categoryIcon} />
                  <span>Luxury Coupé</span>
                </div>
              </div>
            </div>
            
            <button type="submit" className={styles.searchButton}>
              <FaSearch /> Find Available Vehicles
            </button>
            
            <div className={styles.popularDestinations}>
              <p>Popular destinations:</p>
              <div className={styles.destinationTags}>
                {popularDestinations.map((destination, index) => (
                  <button
                    key={index}
                    type="button"
                    className={styles.destinationTag}
                    onClick={() => setFormData({...formData, pickupLocation: destination.name})}
                  >
                    <span>{destination.icon}</span> {destination.name}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Vehicles */}
      <div className={styles.featuredVehicles}>
        <div className={styles.sectionHeader}>
          <h2>Featured Luxury Vehicles</h2>
          <p>Handpicked premium vehicles for an extraordinary journey</p>
        </div>
        
        <div className={styles.vehicleGrid}>
          {featuredCars.map((car) => (
            <div key={car.id} className={styles.vehicleCard}>
              <div className={styles.vehicleImageContainer}>
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className={styles.vehicleImage} 
                  onError={(e) => handleImageError(e, car.fallbackImage)}
                />
                {car.discount > 0 && (
                  <div className={styles.discountBadge}>
                    {car.discount}% OFF
                  </div>
                )}
                <div className={styles.ratingBadge}>
                  <FaStar className={styles.starIcon} />
                  <span>{car.rating}</span>
                </div>
              </div>
              
              <div className={styles.vehicleDetails}>
                <h3 className={styles.vehicleName}>{car.name}</h3>
                <div className={styles.vehicleSpecs}>
                  <div className={styles.specItem}>
                    <FaUsers className={styles.specIcon} />
                    <span>{car.seats} seats</span>
                  </div>
                  <div className={styles.specItem}>
                    <FaCogs className={styles.specIcon} />
                    <span>{car.transmission}</span>
                  </div>
                  <div className={styles.specItem}>
                    <FaGasPump className={styles.specIcon} />
                    <span>{car.fuelType}</span>
                  </div>
                </div>
                
                <div className={styles.vehicleFeatures}>
                  {car.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                      <FaCheckCircle className={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {car.features.length > 2 && (
                    <div className={styles.moreFeatures}>
                      +{car.features.length - 2} more
                    </div>
                  )}
                </div>
                
                <div className={styles.availableLocations}>
                  <FaMapMarkerAlt className={styles.locationIcon} />
                  <span>Available in: </span>
                  <span className={styles.locationsList}>
                    {car.availableLocations.slice(0, 2).join(', ')}
                    {car.availableLocations.length > 2 && ` +${car.availableLocations.length - 2}`}
                  </span>
                </div>
                
                <div className={styles.vehiclePricing}>
                  <div className={styles.priceDisplay}>
                    {car.discount > 0 && (
                      <span className={styles.originalPrice}>
                        ${Math.round(car.price / (1 - car.discount / 100))}
                      </span>
                    )}
                    <span className={styles.currentPrice}>
                      ${car.price}
                    </span>
                    <span className={styles.priceQualifier}>
                      per day
                    </span>
                  </div>
                  
                  <button className={styles.viewDetailsButton}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className={styles.viewAllButton}>View All Luxury Vehicles</button>
      </div>

      {/* Benefits Section */}
      <div className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <h2>Premium Experience, Guaranteed</h2>
          <p>Why choose our luxury car hire service</p>
        </div>
        
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaShieldAlt />
            </div>
            <h3>Premium Insurance</h3>
            <p>Comprehensive coverage with zero excess options for complete peace of mind</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaTachometerAlt />
            </div>
            <h3>Unlimited Mileage</h3>
            <p>Drive as far as you want with no hidden charges or extra fees</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaSuitcase />
            </div>
            <h3>Door-to-Door Delivery</h3>
            <p>Vehicle delivered to your hotel, airport or any location of your choice</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaCheckCircle />
            </div>
            <h3>24/7 Support</h3>
            <p>Premium assistance from our dedicated concierge team, anytime you need</p>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className={styles.testimonialSection}>
        <div className={styles.testimonialContent}>
          <div className={styles.testimonialQuote}>
            <blockquote>
              "SkyJourney's car hire service exceeded all my expectations. The Range Rover was immaculately prepared and delivered directly to my hotel. The entire process was seamless from start to finish."
            </blockquote>
            <div className={styles.testimonialAuthor}>
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="James Wilson" 
                className={styles.authorAvatar} 
              />
              <div className={styles.authorInfo}>
                <h4>James Wilson</h4>
                <p>London, UK</p>
                <div className={styles.authorRating}>
                  <FaStar className={styles.starIcon} />
                  <FaStar className={styles.starIcon} />
                  <FaStar className={styles.starIcon} />
                  <FaStar className={styles.starIcon} />
                  <FaStar className={styles.starIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Destination Explorer Section */}
      <div className={styles.destinationExplorerSection}>
        <div className={styles.sectionHeader}>
          <h2>Luxury Car Hire by Destination</h2>
          <p>Discover premium vehicles available at exclusive destinations worldwide</p>
        </div>
        
        <div className={styles.destinationSearchWrapper}>
          <div className={styles.destinationSearchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search any destination..." 
              className={styles.destinationSearchInput}
              onChange={(e) => console.log('Search for:', e.target.value)}
            />
            <button className={styles.advancedSearchButton}>
              Explore <FaChevronRight className={styles.buttonIcon} />
            </button>
          </div>
          <p className={styles.searchHint}>We search over 30,000 locations and include major car operators worldwide</p>
        </div>
        
        <div className={styles.featuredDestinations}>
          <div className={styles.destinationGrid}>
            {[
              {
                name: 'London',
                image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
                country: 'United Kingdom',
                featured: true,
                vehicles: 52
              },
              {
                name: 'Dubai',
                image: 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=1200',
                country: 'United Arab Emirates',
                featured: true,
                vehicles: 78
              },
              {
                name: 'Paris',
                image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1200',
                country: 'France',
                featured: false,
                vehicles: 41
              },
              {
                name: 'Milan',
                image: 'https://images.pexels.com/photos/3933627/pexels-photo-3933627.jpeg?auto=compress&cs=tinysrgb&w=1200',
                country: 'Italy',
                featured: false,
                vehicles: 35
              }
            ].map((destination) => (
              <div 
                key={destination.name} 
                className={`${styles.destinationCard} ${destination.featured ? styles.featuredDestination : ''}`}
                onClick={() => console.log(`Selected ${destination.name}`)}
              >
                <div className={styles.destinationImageOverlay}></div>
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className={styles.destinationImage} 
                />
                <div className={styles.destinationDetails}>
                  <h3>{destination.name}</h3>
                  <p>{destination.country}</p>
                  <span className={styles.vehicleCount}>
                    {destination.vehicles} luxury vehicles
                  </span>
                  {destination.featured && (
                    <div className={styles.featuredBadge}>
                      <FaStar className={styles.featuredIcon} /> Featured
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.popularDestinations}>
          <h3>Popular Destinations</h3>
          <div className={styles.destinationTabs}>
            <div className={styles.destinationsTabList}>
              <button className={`${styles.destinationTab} ${styles.activeTab}`}>Global</button>
              <button className={styles.destinationTab}>Europe</button>
              <button className={styles.destinationTab}>Americas</button>
              <button className={styles.destinationTab}>Middle East</button>
              <button className={styles.destinationTab}>Asia Pacific</button>
            </div>
            
            <div className={styles.destinationsList}>
              {[
                'London', 'Orlando', 'Tirana', 'Alicante', 'Paris', 
                'Birmingham', 'Dubai', 'Edinburgh', 'Málaga', 'Antalya', 
                'Manchester', 'Glasgow', 'Faro', 'Lisbon', 'Milan'
              ].map(city => (
                <a key={city} href="#" className={styles.destinationLink}>
                  <FaMapMarkerAlt className={styles.destinationIcon} /> {city} car hire
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.destinationFeatures}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaGlobe />
            </div>
            <h3>Global Coverage</h3>
            <p>Access to premium vehicles across 30,000+ locations worldwide</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaHandshake />
            </div>
            <h3>Price Guarantee</h3>
            <p>Best price guaranteed with our price match promise</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaCommentDollar />
            </div>
            <h3>No Hidden Fees</h3>
            <p>Complete transparency with all costs clearly displayed</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaHeadset />
            </div>
            <h3>Concierge Support</h3>
            <p>Dedicated support team for all your luxury car hire needs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarHire;