import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FaStar, FaHeart } from 'react-icons/fa';
import styles from './Hotel.module.css';

// Default map styling for luxury look
const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
};

// Custom map styles for a luxury look
const mapStyles = [
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
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{"color": "#dedede"}, {"lightness": 21}]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
  }
];

const LuxuryHotelMap = ({ hotels, favorites, toggleFavorite, handleViewHotel }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg' // use your own API key
  });

  const [map, setMap] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to New York
  const [markers, setMarkers] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  
  const mapRef = useRef(null);
  const markersRef = useRef({});
  
  // Convert hotel locations to geocoded coordinates
  useEffect(() => {
    if (hotels.length > 0) {
      // In a real implementation, you would use geocoding to get lat/lng
      // For this example, we'll simulate with random coordinates around New York
      const hotelWithCoords = hotels.map(hotel => {
        // In real app you would use geocoding for each location
        // This is just for demo - adding random coordinates near New York
        const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
        const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
        
        return {
          ...hotel,
          position: { lat, lng }
        };
      });
      
      setMarkers(hotelWithCoords);
      
      // Center map on first hotel
      if (hotelWithCoords.length > 0) {
        setCenter(hotelWithCoords[0].position);
      }
      
      setMapLoading(false);
    }
  }, [hotels]);
  
  const onLoad = useCallback(map => {
    mapRef.current = map;
    setMap(map);
  }, []);
  
  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);
  
  const handleMarkerClick = (hotel) => {
    setSelectedHotel(hotel);
  };
  
  const handleInfoWindowClose = () => {
    setSelectedHotel(null);
  };
  
  const fitBounds = useCallback(() => {
    if (map && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.position));
      map.fitBounds(bounds);
      
      // Don't zoom in too far on single marker or small clusters
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, markers]);
  
  useEffect(() => {
    if (map && markers.length > 0) {
      fitBounds();
    }
  }, [map, markers, fitBounds]);
  
  // Generate a custom marker price label
  const getPriceMarkerLabel = (price) => {
    return {
      text: `$${price}`,
      className: styles.markerPriceLabel,
      color: '#ffffff',
      fontWeight: '700',
      fontSize: '12px',
    };
  };

  return isLoaded ? (
    <div className={styles.luxuryMapContainer}>
      <div className={styles.mapControls}>
        <button 
          className={styles.fitMapButton}
          onClick={fitBounds}
        >
          View All Hotels
        </button>
        <div className={styles.mapFilterTabs}>
          <button className={`${styles.mapFilterTab} ${styles.activeTab}`}>All ({markers.length})</button>
          <button className={styles.mapFilterTab}>Luxury ({markers.filter(h => h.category === 'luxury').length})</button>
          <button className={styles.mapFilterTab}>Boutique ({markers.filter(h => h.category === 'boutique').length})</button>
        </div>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          scrollwheel: true,
          fullscreenControl: false
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map(hotel => (
          <Marker
            key={hotel.id}
            position={hotel.position}
            onClick={() => handleMarkerClick(hotel)}
            icon={{
              path: "M22-48h-44v43h16l6 5 6-5h16z",
              fillColor: hotel.category === 'luxury' ? '#b8860b' : '#1e293b',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 1,
              scale: 0.7,
              labelOrigin: new google.maps.Point(0, -25),
            }}
            label={getPriceMarkerLabel(hotel.price)}
            ref={ref => {
              if (ref) markersRef.current[hotel.id] = ref;
            }}
            animation={window.google.maps.Animation.DROP}
          />
        ))}

        {selectedHotel && (
          <InfoWindow
            position={selectedHotel.position}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              maxWidth: 320,
            }}
          >
            <div className={styles.mapInfoWindow}>
              <div className={styles.infoImageContainer}>
                <img 
                  src={selectedHotel.image} 
                  alt={selectedHotel.name} 
                  className={styles.infoImage} 
                />
                <button 
                  className={`${styles.infoFavoriteButton} ${favorites.includes(selectedHotel.id) ? styles.favorited : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(selectedHotel.id, e);
                  }}
                >
                  <FaHeart />
                </button>
                {selectedHotel.discount && (
                  <div className={styles.infoDiscountBadge}>-{selectedHotel.discount}%</div>
                )}
              </div>
              
              <div className={styles.infoContent}>
                <div className={styles.infoHeader}>
                  <h3 className={styles.infoHotelName}>{selectedHotel.name}</h3>
                  <div className={styles.infoRating}>
                    <span>{selectedHotel.rating}</span>
                    <FaStar />
                  </div>
                </div>
                
                <div className={styles.infoLocation}>{selectedHotel.location}</div>
                
                <div className={styles.infoPricing}>
                  {selectedHotel.originalPrice && (
                    <span className={styles.infoOriginalPrice}>${selectedHotel.originalPrice}</span>
                  )}
                  <div className={styles.infoCurrentPrice}>
                    <span className={styles.infoAmount}>${selectedHotel.price}</span>
                    <span className={styles.infoNight}>/night</span>
                  </div>
                </div>
                
                <button 
                  className={styles.infoViewButton}
                  onClick={() => handleViewHotel(selectedHotel.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {mapLoading && (
        <div className={styles.mapLoading}>
          <div className={styles.mapLoadingSpinner}></div>
          <p>Loading luxury properties...</p>
        </div>
      )}
      
      <div className={styles.mapListToggle}>
        <div className={styles.mapHotelsList}>
          {markers.slice(0, 3).map(hotel => (
            <div 
              key={hotel.id} 
              className={styles.mapHotelCard}
              onClick={() => {
                handleMarkerClick(hotel);
                map.panTo(hotel.position);
                map.setZoom(15);
              }}
            >
              <div className={styles.mapCardImage}>
                <img src={hotel.image} alt={hotel.name} />
                <div className={styles.mapCardPrice}>${hotel.price}</div>
              </div>
              <div className={styles.mapCardContent}>
                <h4>{hotel.name}</h4>
                <div className={styles.mapCardRating}>
                  <span>{hotel.rating}</span>
                  <FaStar />
                  <span className={styles.mapReviewCount}>({hotel.reviewCount})</span>
                </div>
              </div>
            </div>
          ))}
          {markers.length > 3 && (
            <button className={styles.mapViewMoreButton}>
              View All {markers.length} Properties
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.mapLoading}>
      <div className={styles.mapLoadingSpinner}></div>
      <p>Loading luxury map experience...</p>
    </div>
  );
};

export default LuxuryHotelMap;