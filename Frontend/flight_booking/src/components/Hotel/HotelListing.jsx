import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaSwimmingPool, 
  FaWifi,
  FaParking,
  FaSpa,
  FaUtensils,
  FaFilter,
  FaSortAmountDown,
  FaMapMarked,
  FaList,
  FaChevronDown,
  FaHeart
} from 'react-icons/fa';
import styles from './Hotel.module.css';

const HotelListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(null);
  const [activeView, setActiveView] = useState('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hoveredHotel, setHoveredHotel] = useState(null);
  
  // Enhanced luxury hotels data
  const luxuryHotels = [
    {
      id: 1,
      name: "Grand Palazzo Royal",
      location: "Upper East Side, New York",
      description: "Experience unparalleled luxury in this five-star urban retreat where timeless elegance meets modern sophistication.",
      rating: 4.9,
      reviewCount: 476,
      price: 589,
      originalPrice: 650,
      discount: 10,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
      ],
      amenities: ["pool", "wifi", "spa", "restaurant", "parking"],
      category: "luxury",
      recommended: true,
      propertyType: "Hotel",
      featured: true,
      distance: 1.2,
      freeCancel: true
    },
    {
      id: 2,
      name: "The Pinnacle Suites",
      location: "Central Park, New York",
      description: "Panoramic views of Central Park from these exclusive designer suites in the heart of Manhattan.",
      rating: 4.8,
      reviewCount: 382,
      price: 749,
      originalPrice: 899,
      discount: 15,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80"
      ],
      amenities: ["pool", "wifi", "spa", "restaurant"],
      category: "luxury",
      recommended: true,
      propertyType: "Suite",
      featured: true,
      distance: 0.8,
      freeCancel: true
    },
    {
      id: 3,
      name: "The Waldorf Collection",
      location: "Midtown, New York",
      description: "Historic luxury property offering timeless elegance and sophisticated accommodations with white-glove service.",
      rating: 4.7,
      reviewCount: 521,
      price: 459,
      originalPrice: null,
      discount: null,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&q=80"
      ],
      amenities: ["wifi", "spa", "restaurant", "parking"],
      category: "classic",
      recommended: true,
      propertyType: "Hotel",
      featured: false,
      distance: 1.5,
      freeCancel: true
    },
    {
      id: 4,
      name: "Metropolitan Boutique",
      location: "SoHo, New York",
      description: "Trendy boutique property featuring contemporary design and personalized service in the heart of SoHo.",
      rating: 4.6,
      reviewCount: 328,
      price: 389,
      originalPrice: 459,
      discount: 15,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80"
      ],
      amenities: ["wifi", "restaurant", "parking"],
      category: "boutique",
      recommended: false,
      propertyType: "Boutique",
      featured: false,
      distance: 2.1,
      freeCancel: true
    },
    {
      id: 5,
      name: "The Peninsula Residence",
      location: "Battery Park, New York",
      description: "Waterfront luxury with spectacular views of the Statue of Liberty and harbor, offering upscale apartments with hotel services.",
      rating: 4.9,
      reviewCount: 217,
      price: 849,
      originalPrice: 999,
      discount: 15,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80"
      ],
      amenities: ["pool", "wifi", "spa", "restaurant", "parking"],
      category: "luxury",
      recommended: true,
      propertyType: "Residence",
      featured: true,
      distance: 3.2,
      freeCancel: false
    },
    {
      id: 6,
      name: "The Nomad Hotel",
      location: "Chelsea, New York",
      description: "Trendsetting hotel with Michelin-starred dining and curated art collection in a restored Beaux-Arts building.",
      rating: 4.7,
      reviewCount: 384,
      price: 419,
      originalPrice: null,
      discount: null,
      image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80"
      ],
      amenities: ["wifi", "restaurant", "parking"],
      category: "boutique",
      recommended: false,
      propertyType: "Hotel",
      featured: false,
      distance: 1.8,
      freeCancel: true
    }
  ];

  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
    }
    
    // Initial filtering of hotels
    setFilteredHotels(luxuryHotels);
  }, [location]);
  
  useEffect(() => {
    // Apply filters when they change
    let filtered = [...luxuryHotels];
    
    // Filter by price range
    filtered = filtered.filter(hotel => hotel.price >= priceRange[0] && hotel.price <= priceRange[1]);
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => 
        selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }
    
    // Sort hotels
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    }
    
    setFilteredHotels(filtered);
  }, [priceRange, selectedAmenities, sortBy]);
  
  const handleViewHotel = (id) => {
    navigate(`/hotels/details/${id}`);
  };
  
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
      setActiveFilters(activeFilters.filter(a => a !== getAmenityName(amenity)));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
      setActiveFilters([...activeFilters, getAmenityName(amenity)]);
    }
  };
  
  const getAmenityName = (code) => {
    switch (code) {
      case 'pool': return 'Pool';
      case 'wifi': return 'WiFi';
      case 'spa': return 'Spa';
      case 'restaurant': return 'Restaurant';
      case 'parking': return 'Parking';
      default: return code;
    }
  };
  
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'pool': return <FaSwimmingPool />;
      case 'wifi': return <FaWifi />;
      case 'spa': return <FaSpa />;
      case 'restaurant': return <FaUtensils />;
      case 'parking': return <FaParking />;
      default: return null;
    }
  };
  
  const handlePriceChange = (e) => {
    setPriceRange([Number(e.target.value), priceRange[1]]);
  };
  
  const handleMaxPriceChange = (e) => {
    setPriceRange([priceRange[0], Number(e.target.value)]);
  };
  
  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedAmenities([]);
    setActiveFilters([]);
    setSortBy('recommended');
  };
  
  const removeFilter = (filter) => {
    // If it's an amenity filter
    const amenityCode = Object.keys(getAmenityMapping()).find(key => getAmenityMapping()[key] === filter);
    if (amenityCode) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenityCode));
    }
    setActiveFilters(activeFilters.filter(a => a !== filter));
  };
  
  const getAmenityMapping = () => {
    return {
      'pool': 'Pool',
      'wifi': 'WiFi',
      'spa': 'Spa',
      'restaurant': 'Restaurant',
      'parking': 'Parking'
    };
  };
  
  return (
    <div className={styles.luxuryListingContainer}>
      {/* Header */}
      <div className={styles.luxuryListingHeader}>
        <div className={styles.headerContent}>
          <h1>Luxury Stays in {searchParams?.destination || "New York"}</h1>
          <p className={styles.resultCount}>{filteredHotels.length} exceptional properties</p>
        </div>
      </div>
      
      {/* Filter and View Controls */}
      <div className={styles.filterControls}>
        <div className={styles.filterGroup}>
          <div className={styles.filterDropdown}>
            <button className={styles.filterButton} onClick={() => setFilterOpen(!filterOpen)}>
              <FaFilter /> Filter <FaChevronDown className={filterOpen ? styles.rotateChevron : ''} />
            </button>
            
            {filterOpen && (
              <div className={styles.dropdownContent}>
                <div className={styles.filterSection}>
                  <h3>Price Range</h3>
                  <div className={styles.priceInputs}>
                    <div className={styles.priceField}>
                      <label>Min</label>
                      <div className={styles.priceInputWrapper}>
                        <span>$</span>
                        <input 
                          type="number" 
                          value={priceRange[0]} 
                          onChange={handlePriceChange}
                          min="0"
                          max={priceRange[1]}
                        />
                      </div>
                    </div>
                    <div className={styles.priceField}>
                      <label>Max</label>
                      <div className={styles.priceInputWrapper}>
                        <span>$</span>
                        <input 
                          type="number" 
                          value={priceRange[1]} 
                          onChange={handleMaxPriceChange}
                          min={priceRange[0]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.priceRangeSlider}>
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      value={priceRange[0]} 
                      onChange={handlePriceChange}
                      className={styles.slider}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      value={priceRange[1]} 
                      onChange={handleMaxPriceChange}
                      className={styles.slider}
                    />
                  </div>
                </div>
                
                <div className={styles.filterSection}>
                  <h3>Amenities</h3>
                  <div className={styles.amenitiesGrid}>
                    <div className={`${styles.amenityOption} ${selectedAmenities.includes('pool') ? styles.selectedAmenity : ''}`} onClick={() => toggleAmenity('pool')}>
                      <FaSwimmingPool />
                      <span>Pool</span>
                    </div>
                    <div className={`${styles.amenityOption} ${selectedAmenities.includes('wifi') ? styles.selectedAmenity : ''}`} onClick={() => toggleAmenity('wifi')}>
                      <FaWifi />
                      <span>WiFi</span>
                    </div>
                    <div className={`${styles.amenityOption} ${selectedAmenities.includes('spa') ? styles.selectedAmenity : ''}`} onClick={() => toggleAmenity('spa')}>
                      <FaSpa />
                      <span>Spa</span>
                    </div>
                    <div className={`${styles.amenityOption} ${selectedAmenities.includes('restaurant') ? styles.selectedAmenity : ''}`} onClick={() => toggleAmenity('restaurant')}>
                      <FaUtensils />
                      <span>Restaurant</span>
                    </div>
                    <div className={`${styles.amenityOption} ${selectedAmenities.includes('parking') ? styles.selectedAmenity : ''}`} onClick={() => toggleAmenity('parking')}>
                      <FaParking />
                      <span>Parking</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.filterActions}>
                  <button className={styles.clearFiltersButton} onClick={clearFilters}>Clear All</button>
                  <button className={styles.applyFiltersButton} onClick={() => setFilterOpen(false)}>Apply Filters</button>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.filterDropdown}>
            <button className={styles.filterButton} onClick={() => setSortOpen(!sortOpen)}>
              <FaSortAmountDown /> Sort By <FaChevronDown className={sortOpen ? styles.rotateChevron : ''} />
            </button>
            
            {sortOpen && (
              <div className={styles.dropdownContent}>
                <div className={styles.sortOptions}>
                  <div 
                    className={`${styles.sortOption} ${sortBy === 'recommended' ? styles.selectedSort : ''}`}
                    onClick={() => {setSortBy('recommended'); setSortOpen(false);}}
                  >
                    Recommended
                  </div>
                  <div 
                    className={`${styles.sortOption} ${sortBy === 'price-low' ? styles.selectedSort : ''}`}
                    onClick={() => {setSortBy('price-low'); setSortOpen(false);}}
                  >
                    Price (Low to High)
                  </div>
                  <div 
                    className={`${styles.sortOption} ${sortBy === 'price-high' ? styles.selectedSort : ''}`}
                    onClick={() => {setSortBy('price-high'); setSortOpen(false);}}
                  >
                    Price (High to Low)
                  </div>
                  <div 
                    className={`${styles.sortOption} ${sortBy === 'rating' ? styles.selectedSort : ''}`}
                    onClick={() => {setSortBy('rating'); setSortOpen(false);}}
                  >
                    Rating
                  </div>
                  <div 
                    className={`${styles.sortOption} ${sortBy === 'distance' ? styles.selectedSort : ''}`}
                    onClick={() => {setSortBy('distance'); setSortOpen(false);}}
                  >
                    Distance
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.viewControls}>
          <button 
            className={`${styles.viewButton} ${activeView === 'list' ? styles.activeView : ''}`}
            onClick={() => setActiveView('list')}
          >
            <FaList /> List
          </button>
          <button 
            className={`${styles.viewButton} ${activeView === 'map' ? styles.activeView : ''}`}
            onClick={() => setActiveView('map')}
          >
            <FaMapMarked /> Map
          </button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersContainer}>
            <span className={styles.activeFiltersLabel}>Active Filters:</span>
            {activeFilters.map(filter => (
              <div key={filter} className={styles.activeFilterTag}>
                {filter}
                <button onClick={() => removeFilter(filter)} className={styles.removeFilterButton}>×</button>
              </div>
            ))}
            <button className={styles.clearAllButton} onClick={clearFilters}>Clear All</button>
          </div>
        </div>
      )}
      
      {/* Featured Properties Section */}
      {filteredHotels.some(hotel => hotel.featured) && (
        <div className={styles.featuredSection}>
          <h2 className={styles.featuredHeading}>Featured Properties</h2>
          <div className={styles.featuredGrid}>
            {filteredHotels
              .filter(hotel => hotel.featured)
              .slice(0, 3)
              .map(hotel => (
                <div 
                  key={hotel.id} 
                  className={styles.featuredCard}
                  onClick={() => handleViewHotel(hotel.id)}
                  onMouseEnter={() => setHoveredHotel(hotel.id)}
                  onMouseLeave={() => setHoveredHotel(null)}
                >
                  <div className={styles.featuredImageContainer}>
                    <img src={hotel.image} alt={hotel.name} className={styles.featuredImage} />
                    <button 
                      className={`${styles.favoriteButton} ${favorites.includes(hotel.id) ? styles.favorited : ''}`}
                      onClick={(e) => toggleFavorite(hotel.id, e)}
                    >
                      <FaHeart />
                    </button>
                    {hotel.discount && (
                      <div className={styles.discountBadge}>Save {hotel.discount}%</div>
                    )}
                  </div>
                  <div className={styles.featuredContent}>
                    <div className={styles.featuredHeader}>
                      <h3 className={styles.featuredName}>{hotel.name}</h3>
                      <div className={styles.featuredRating}>
                        <span>{hotel.rating}</span>
                        <FaStar />
                      </div>
                    </div>
                    <div className={styles.featuredLocation}>
                      <FaMapMarkerAlt />
                      <span>{hotel.location}</span>
                    </div>
                    <div className={styles.featuredAmenities}>
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <div key={index} className={styles.featuredAmenity}>
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <div className={styles.amenityMore}>+{hotel.amenities.length - 3}</div>
                      )}
                    </div>
                    <div className={styles.featuredPricing}>
                      {hotel.originalPrice && (
                        <span className={styles.originalPrice}>${hotel.originalPrice}</span>
                      )}
                      <div className={styles.currentPrice}>
                        <span className={styles.amount}>${hotel.price}</span>
                        <span className={styles.night}>per night</span>
                      </div>
                    </div>
                    <button 
                      className={`${styles.viewDetailsButton} ${hoveredHotel === hotel.id ? styles.buttonHovered : ''}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Main Hotel Listing */}
      <div className={styles.luxuryHotelsList}>
        {filteredHotels.map(hotel => (
          <div 
            key={hotel.id} 
            className={styles.luxuryHotelCard}
            onClick={() => handleViewHotel(hotel.id)}
            onMouseEnter={() => setHoveredHotel(hotel.id)}
            onMouseLeave={() => setHoveredHotel(null)}
          >
            <div className={styles.hotelImageContainer}>
              <img src={hotel.image} alt={hotel.name} className={styles.hotelMainImage} />
              <button 
                className={`${styles.favoriteButton} ${favorites.includes(hotel.id) ? styles.favorited : ''}`}
                onClick={(e) => toggleFavorite(hotel.id, e)}
              >
                <FaHeart />
              </button>
              {hotel.discount && (
                <div className={styles.discountBadge}>Save {hotel.discount}%</div>
              )}
              {hotel.freeCancel && (
                <div className={styles.freeCancelBadge}>Free Cancellation</div>
              )}
            </div>
            
            <div className={styles.hotelCardContent}>
              <div className={styles.hotelMainInfo}>
                <div className={styles.hotelNameCategory}>
                  <span className={styles.propertyCategory}>
                    {hotel.propertyType}
                  </span>
                  <h2 className={styles.hotelName}>{hotel.name}</h2>
                </div>
                <div className={styles.hotelRatingReviews}>
                  <div className={styles.ratingDisplay}>
                    <span className={styles.ratingValue}>{hotel.rating}</span>
                    <FaStar className={styles.ratingStar} />
                  </div>
                  <span className={styles.reviewCount}>({hotel.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className={styles.hotelLocation}>
                <FaMapMarkerAlt className={styles.locationPin} />
                <span className={styles.locationText}>{hotel.location}</span>
                <span className={styles.distanceBadge}>{hotel.distance} miles from center</span>
              </div>
              
              <p className={styles.hotelDescription}>{hotel.description}</p>
              
              <div className={styles.hotelAmenities}>
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className={styles.amenityBadge}>
                    {getAmenityIcon(amenity)}
                    <span>{getAmenityName(amenity)}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.hotelCardFooter}>
                <div className={styles.hotelPricing}>
                  {hotel.originalPrice && (
                    <span className={styles.originalPrice}>${hotel.originalPrice}</span>
                  )}
                  <div className={styles.currentPrice}>
                    <span className={styles.priceAmount}>${hotel.price}</span>
                    <span className={styles.perNight}>per night</span>
                  </div>
                  <div className={styles.taxesNote}>Includes taxes & fees</div>
                </div>
                
                <button 
                  className={`${styles.viewDetailsButton} ${hoveredHotel === hotel.id ? styles.buttonHovered : ''}`}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Map View - Placeholder */}
      {activeView === 'map' && (
        <div className={styles.mapViewContainer}>
          <div className={styles.mapPlaceholder}>
            <FaMapMarked className={styles.mapIcon} />
            <p>Interactive map view would be displayed here with hotel locations</p>
          </div>
        </div>
      )}
      
      {/* "No Results" message if needed */}
      {filteredHotels.length === 0 && (
        <div className={styles.noResultsMessage}>
          <h3>No properties match your current filters</h3>
          <p>Try adjusting your filters or clearing them to see more results</p>
          <button className={styles.clearFiltersButton} onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}
    </div>
  );
};

export default HotelListing;