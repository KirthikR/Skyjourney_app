import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaStar,
  FaMapMarkerAlt,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaCocktail,
  FaCalendarAlt,
  FaUsers,
  FaArrowLeft,
  FaCheck,
  FaBath,
  FaGlassMartiniAlt,
  FaSpa,
  FaConciergeBell,
  FaShuttleVan,
  FaDumbbell,
  FaBed,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import styles from './Hotel.module.css';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [nights, setNights] = useState(1);
  
  // Enhanced mock hotel data
  const hotel = {
    id: parseInt(id) || 1,
    name: "Grand Palazzo Luxury Resort & Spa",
    location: "Downtown, New York",
    description: "Experience unparalleled luxury in our five-star urban retreat, where timeless elegance meets modern sophistication.",
    longDescription: "Nestled in the heart of the city, our iconic property offers a sanctuary of refined luxury. From the moment you arrive, be captivated by the opulent décor, attentive service, and world-class amenities. Each detail has been meticulously designed to create an unforgettable experience for the most discerning travelers.",
    rating: 4.9,
    price: 589,
    reviews: [
      {id: 1, user: "Michael T.", rating: 5, title: "Exceptional Experience", comment: "Stayed for our anniversary and the staff went above and beyond. The penthouse suite was magnificent with breathtaking views.", date: "2 weeks ago", avatar: "https://randomuser.me/api/portraits/men/32.jpg"},
      {id: 2, user: "Sophia L.", rating: 5, title: "Pure Luxury", comment: "The spa treatments were divine and the culinary offerings at the restaurant were outstanding. Will definitely return.", date: "1 month ago", avatar: "https://randomuser.me/api/portraits/women/44.jpg"},
      {id: 3, user: "James W.", rating: 4, title: "Almost Perfect", comment: "Beautiful property with excellent service. Only minor issue was with the in-room temperature control.", date: "2 months ago", avatar: "https://randomuser.me/api/portraits/men/22.jpg"}
    ],
    amenities: [
      { name: "High-Speed WiFi", icon: "wifi", description: "Complimentary high-speed internet throughout the property" },
      { name: "Infinity Rooftop Pool", icon: "pool", description: "Temperature-controlled infinity pool with panoramic city views" },
      { name: "Valet Parking", icon: "parking", description: "Secure valet parking with 24/7 access" },
      { name: "Michelin-Star Restaurant", icon: "restaurant", description: "Award-winning dining experience with celebrity chef" },
      { name: "Executive Bar & Lounge", icon: "bar", description: "Craft cocktails and premium spirits in an elegant setting" },
      { name: "Luxury Spa Retreat", icon: "spa", description: "Full-service spa offering exclusive treatments and therapies" },
      { name: "24/7 Concierge", icon: "concierge", description: "Personalized concierge services for all guest needs" },
      { name: "Fitness Center", icon: "gym", description: "State-of-the-art fitness equipment and personal trainers" },
      { name: "Airport Shuttle", icon: "shuttle", description: "Complimentary luxury transportation to and from the airport" },
      { name: "Business Center", icon: "business", description: "Premium workspace with meeting rooms and secretarial services" }
    ],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80"
    ],
    rooms: [
      {
        id: 101,
        name: "Deluxe King Suite",
        size: "45 m²",
        beds: "1 King Bed",
        occupancy: "2 Adults",
        view: "City View",
        amenities: ["Premium Linens", "Smart TV", "Rainfall Shower", "Nespresso Machine", "Minibar"],
        price: 589,
        discount: null,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
        description: "Elegant and spacious suite featuring modern décor and premium amenities for the ultimate comfort."
      },
      {
        id: 102,
        name: "Executive Park Suite",
        size: "65 m²",
        beds: "1 King Bed",
        occupancy: "2 Adults, 1 Child",
        view: "Park View",
        amenities: ["Premium Linens", "Smart TV", "Marble Bathroom", "Soaking Tub", "Nespresso Machine", "Minibar", "Work Desk"],
        price: 789,
        discount: 10,
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80",
        description: "Sophisticated suite overlooking the park with separate living area and luxurious amenities."
      },
      {
        id: 103,
        name: "Penthouse Luxury Suite",
        size: "120 m²",
        beds: "1 King Bed + Sofa Bed",
        occupancy: "4 Adults",
        view: "Panoramic City View",
        amenities: ["Premium Linens", "Smart TV", "Jacuzzi Tub", "Rain Shower", "Fully Stocked Bar", "Kitchenette", "Dining Area", "Private Terrace"],
        price: 1289,
        discount: null,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
        description: "Our most exclusive accommodation featuring panoramic views, private terrace, and unparalleled luxury."
      }
    ]
  };
  
  // Calculate nights when check-in/check-out dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [checkIn, checkOut]);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get amenity icon
  const getAmenityIcon = (icon) => {
    switch (icon) {
      case 'wifi': return <FaWifi />;
      case 'pool': return <FaSwimmingPool />;
      case 'parking': return <FaParking />;
      case 'restaurant': return <FaUtensils />;
      case 'bar': return <FaGlassMartiniAlt />;
      case 'spa': return <FaSpa />;
      case 'concierge': return <FaConciergeBell />;
      case 'gym': return <FaDumbbell />;
      case 'shuttle': return <FaShuttleVan />;
      default: return <FaCheck />;
    }
  };
  
  // Navigate gallery
  const navigateGallery = (direction) => {
    if (direction === 'next') {
      setActiveImage((prev) => (prev + 1) % hotel.images.length);
    } else {
      setActiveImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    }
  };
  
  // Handle room selection
  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };
  
  // Handle booking
  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (!selectedRoom) {
      alert('Please select a room type');
      return;
    }
    
    navigate(`/hotels/booking/${hotel.id}`, {
      state: {
        hotel,
        booking: {
          checkIn,
          checkOut,
          guests,
          rooms,
          nights,
          roomId: selectedRoom,
          roomDetails: hotel.rooms.find(r => r.id === selectedRoom)
        }
      }
    });
  };
  
  // Calculate discounted price
  const getDiscountedPrice = (room) => {
    if (!room.discount) return room.price;
    return room.price - (room.price * room.discount / 100);
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY_HERE' // Replace with your Google Maps API key
  });

  // Add a hotel location - for demo purposes
  const hotelPosition = {
    lat: 40.7128,
    lng: -74.0060
  };
  
  return (
    <div className={styles.luxuryHotelDetails}>
      {/* Floating Booking Summary */}
      <div className={`${styles.floatingBookingSummary} ${isScrolled ? styles.visible : ''}`}>
        <div className={styles.floatingSummaryContent}>
          <h3>{hotel.name}</h3>
          <div className={styles.floatingPrice}>
            <span className={styles.priceAmount}>${selectedRoom ? 
              getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) : 
              hotel.price}</span>
            <span className={styles.priceNight}>per night</span>
          </div>
        </div>
        <button 
          className={styles.floatingBookButton}
          onClick={handleBooking}
          disabled={!selectedRoom || !checkIn || !checkOut}
        >
          Reserve Now
        </button>
      </div>
      
      {/* Hotel Header */}
      <div className={styles.luxuryHeader}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => navigate('/hotels')}>
            <FaArrowLeft /> Back to Hotels
          </button>
          
          <h1 className={styles.hotelName}>{hotel.name}</h1>
          
          <div className={styles.hotelMetadata}>
            <div className={styles.luxuryRating}>
              <span className={styles.ratingValue}>{hotel.rating}</span>
              <div className={styles.starContainer}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(hotel.rating) ? styles.goldStar : styles.grayStar} />
                ))}
              </div>
              <span className={styles.reviewCount}>({hotel.reviews.length} reviews)</span>
            </div>
            <div className={styles.locationDisplay}>
              <FaMapMarkerAlt />
              <span>{hotel.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageContainer} style={{backgroundImage: `url(${hotel.images[activeImage]})`}}>
          <button 
            className={`${styles.galleryNav} ${styles.prevNav}`}
            onClick={() => navigateGallery('prev')}
          >
            <FaChevronLeft />
          </button>
          <button 
            className={`${styles.galleryNav} ${styles.nextNav}`}
            onClick={() => navigateGallery('next')}
          >
            <FaChevronRight />
          </button>
          <div className={styles.galleryCounter}>
            {activeImage + 1} / {hotel.images.length}
          </div>
        </div>
        <div className={styles.thumbnailContainer}>
          {hotel.images.map((img, index) => (
            <div 
              key={index}
              className={`${styles.thumbnail} ${activeImage === index ? styles.activeThumbnail : ''}`}
              style={{backgroundImage: `url(${img})`}}
              onClick={() => setActiveImage(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className={styles.contentContainer}>
        <div className={styles.mainContent}>
          {/* Hotel Description */}
          <section className={styles.descriptionSection}>
            <h2>About this luxury property</h2>
            <p className={styles.hotelDescription}>{hotel.description}</p>
            <p className={styles.hotelLongDescription}>{hotel.longDescription}</p>
          </section>
          
          {/* Amenities Section */}
          <section className={styles.amenitiesSection}>
            <h2>Luxury Amenities</h2>
            <div className={styles.amenitiesGrid}>
              {hotel.amenities.slice(0, showAllAmenities ? hotel.amenities.length : 6).map((amenity, index) => (
                <div key={index} className={styles.amenityCard}>
                  <div className={styles.amenityIcon}>{getAmenityIcon(amenity.icon)}</div>
                  <div className={styles.amenityDetails}>
                    <h4>{amenity.name}</h4>
                    <p>{amenity.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {hotel.amenities.length > 6 && (
              <button 
                className={styles.showMoreButton}
                onClick={() => setShowAllAmenities(!showAllAmenities)}
              >
                {showAllAmenities ? 'Show Less' : 'View All Amenities'}
              </button>
            )}
          </section>
          
          {/* Room Selection */}
          <section className={styles.roomsSection}>
            <h2>Select Your Room</h2>
            <div className={styles.roomsContainer}>
              {hotel.rooms.map((room) => {
                const discountedPrice = getDiscountedPrice(room);
                return (
                  <div 
                    key={room.id} 
                    className={`${styles.roomCard} ${selectedRoom === room.id ? styles.selectedRoom : ''}`}
                    onClick={() => handleRoomSelect(room.id)}
                  >
                    <div className={styles.roomImageContainer}>
                      <img src={room.image} alt={room.name} className={styles.roomImage} />
                      {room.discount && (
                        <div className={styles.discountBadge}>Save {room.discount}%</div>
                      )}
                    </div>
                    <div className={styles.roomDetails}>
                      <h3>{room.name}</h3>
                      <div className={styles.roomFeatures}>
                        <div className={styles.roomFeature}>
                          <FaBed /> {room.beds}
                        </div>
                        <div className={styles.roomFeature}>
                          <FaUsers /> {room.occupancy}
                        </div>
                        <div className={styles.roomFeature}>
                          <span>{room.size}</span>
                        </div>
                      </div>
                      <p className={styles.roomDescription}>{room.description}</p>
                      <div className={styles.roomAmenities}>
                        {room.amenities.slice(0, 5).map((amenity, i) => (
                          <span key={i} className={styles.roomAmenity}>
                            <FaCheck /> {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 5 && (
                          <span className={styles.moreAmenities}>+{room.amenities.length - 5} more</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.roomPricing}>
                      {room.discount && (
                        <span className={styles.originalPrice}>${room.price}</span>
                      )}
                      <div className={styles.currentPrice}>
                        <span className={styles.priceAmount}>${discountedPrice}</span>
                        <span className={styles.priceNight}>per night</span>
                      </div>
                      <div className={styles.selectRoom}>
                        {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          
          {/* Reviews Section */}
          <section className={styles.reviewsSection}>
            <h2>Guest Reviews</h2>
            <div className={styles.reviewsContainer}>
              {hotel.reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <img src={review.avatar} alt={review.user} className={styles.reviewerAvatar} />
                      <div>
                        <h4>{review.user}</h4>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      <span>{review.rating}</span>
                      <FaStar className={styles.ratingIcon} />
                    </div>
                  </div>
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.locationSection}>
            <h2>Location</h2>
            <div className={styles.mapContainer}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  center={hotelPosition}
                  zoom={15}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: true,
                    fullscreenControl: true,
                    styles: [
                      {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
                      },
                      {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
                      }
                    ]
                  }}
                >
                  <Marker
                    position={hotelPosition}
                    icon={{
                      path: "M22-48h-44v43h16l6 5 6-5h16z",
                      fillColor: '#b8860b',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 1,
                      scale: 0.7,
                      labelOrigin: new google.maps.Point(0, -25),
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className={styles.mapLoading}>
                  <div className={styles.mapLoadingSpinner}></div>
                  <p>Loading map...</p>
                </div>
              )}
            </div>
            <div className={styles.hotelAddress}>
              <FaMapMarkerAlt />
              <span>123 Luxury Avenue, {hotel.location}</span>
            </div>
            <div className={styles.mapActions}>
              <button className={styles.mapActionButton}>
                Get Directions
              </button>
              <button className={styles.mapActionButton}>
                View in Google Maps
              </button>
            </div>
          </section>
        </div>
        
        {/* Booking Form Sidebar */}
        <div className={styles.bookingSidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <div className={styles.bookingPrice}>
                <span className={styles.priceAmount}>${selectedRoom ? 
                  getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) : 
                  hotel.price}</span>
                <span className={styles.priceNight}>per night</span>
              </div>
              <div className={styles.bookingRating}>
                <span className={styles.ratingValue}>{hotel.rating}</span>
                <FaStar className={styles.ratingIcon} />
                <span className={styles.ratingText}>Exceptional</span>
              </div>
            </div>
            
            <div className={styles.bookingForm}>
              <div className={styles.dateSelector}>
                <div className={styles.dateField}>
                  <label>
                    <FaCalendarAlt className={styles.fieldIcon} /> Check-in
                  </label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.dateField}>
                  <label>
                    <FaCalendarAlt className={styles.fieldIcon} /> Check-out
                  </label>
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className={styles.dateInput}
                  />
                </div>
              </div>
              
              <div className={styles.guestSelector}>
                <div className={styles.guestField}>
                  <label>
                    <FaUsers className={styles.fieldIcon} /> Guests
                  </label>
                  <select 
                    value={guests} 
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className={styles.guestInput}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.guestField}>
                  <label>
                    <FaBed className={styles.fieldIcon} /> Rooms
                  </label>
                  <select 
                    value={rooms} 
                    onChange={(e) => setRooms(parseInt(e.target.value))}
                    className={styles.guestInput}
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedRoom && checkIn && checkOut && (
                <div className={styles.reservationSummary}>
                  <h3>Reservation Summary</h3>
                  <div className={styles.summaryRow}>
                    <span>Room Type</span>
                    <span>{hotel.rooms.find(r => r.id === selectedRoom)?.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Price x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>${getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) * nights}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Taxes & Fees</span>
                    <span>${Math.round(getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) * nights * 0.15)}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <span>${getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) * nights + 
                      Math.round(getDiscountedPrice(hotel.rooms.find(r => r.id === selectedRoom)) * nights * 0.15)}</span>
                  </div>
                </div>
              )}
              
              <button 
                className={styles.reserveButton}
                onClick={handleBooking}
                disabled={!selectedRoom || !checkIn || !checkOut}
              >
                {(!checkIn || !checkOut) ? 'Select dates to continue' : 
                 !selectedRoom ? 'Select a room to continue' : 'Reserve Now'}
              </button>
              
              <p className={styles.noChargeNotice}>
                No charges will be made until check-in
              </p>
            </div>
          </div>
          
          <div className={styles.conciergeCard}>
            <div className={styles.conciergeIcon}>
              <FaConciergeBell />
            </div>
            <div className={styles.conciergeContent}>
              <h3>Personal Concierge</h3>
              <p>Need assistance with restaurant reservations or special arrangements? Our dedicated concierge team is at your service.</p>
              <button className={styles.conciergeButton}>Contact Concierge</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
