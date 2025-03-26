import React from 'react';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import styles from './Hotel.module.css';

const HotelCard = ({ hotel, favorites = [], toggleFavorite, onHover, isHovered, handleViewHotel }) => {
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

  return (
    <div 
      className={styles.hotelCard}
      onClick={() => handleViewHotel(hotel.id)}
      onMouseEnter={() => onHover && onHover(hotel.id)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <div className={styles.hotelImageContainer}>
        <img src={hotel.image} alt={hotel.name} className={styles.hotelImage} />
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
      <div className={styles.hotelContent}>
        <div className={styles.hotelHeader}>
          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <div className={styles.hotelRating}>
            <span>{hotel.rating}</span>
            <FaStar />
          </div>
        </div>
        <div className={styles.hotelLocation}>
          <FaMapMarkerAlt />
          <span>{hotel.location}</span>
        </div>
        <div className={styles.hotelAmenities}>
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className={styles.hotelAmenity}>
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {hotel.amenities.length > 3 && (
            <div className={styles.amenityMore}>+{hotel.amenities.length - 3}</div>
          )}
        </div>
        <div className={styles.hotelPricing}>
          {hotel.originalPrice && (
            <span className={styles.originalPrice}>${hotel.originalPrice}</span>
          )}
          <div className={styles.currentPrice}>
            <span className={styles.amount}>${hotel.price}</span>
            <span className={styles.night}>per night</span>
          </div>
        </div>
        <button 
          className={`${styles.viewDetailsButton} ${isHovered === hotel.id ? styles.buttonHovered : ''}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default HotelCard;