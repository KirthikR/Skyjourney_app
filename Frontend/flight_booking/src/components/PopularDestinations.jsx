import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../styles/PopularDestinations.module.css';

const destinations = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    image: "louis-paulin-6DOTNYlLi4Y-unsplash.jpg",
    price: "from $499",
    description: "City of Love & Lights",
    rating: 4.8
  },
  {
    id: 2,
    city: "Tokyo",
    country: "Japan",
    image: "jezael-melgoza-To5wAJDt1IM-unsplash.jpg",
    price: "from $799",
    description: "Modern meets Traditional",
    rating: 4.9
  },
  {
    id: 3,
    city: "Bali",
    country: "Indonesia",
    image: "alec-favale-Bi_5VsaOLnI-unsplash.jpg",
    price: "from $599",
    description: "Paradise Island",
    rating: 4.7
  },
  {
    id: 4,
    city: "Dubai",
    country: "UAE",
    image: "/darcey-beau-q8D7WZc40eA-unsplash.jpg",
    price: "from $699",
    description: "Luxury & Adventure",
    rating: 4.8
  },
  {
    id: 5,
    city: "New York",
    country: "USA",
    image: "/jonathan-roger-LY1eyQMFeyo-unsplash.jpg",
    price: "from $399",
    description: "The City That Never Sleeps",
    rating: 4.6
  },
  {
    id: 6,
    city: "Santorini",
    country: "Greece",
    image: "/massimiliano-morosinotto-mC8dmDg4YUo-unsplash.jpg",
    price: "from $549",
    description: "Mediterranean Paradise",
    rating: 4.9
  },
  {
    id: 7,
    city: "Delhi",
    country: "India",
    image: "/axp-photography-fbxrghcuGCY-unsplash.jpg",
    price: "from $700",
    description: "Rich cultural heritage",
    rating: 4.9
  },
  {
    id: 8,
    city: "London",
    country: "United Kingdom",
    image: "/paul-silvan-cRC-TvUX4OA-unsplash.jpg",
    price: "from $499",
    description: "Historical & Modern",
    rating: 4.8
  },
];

export default function PopularDestinations() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById('destinationSlider');
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  return (
    <section className={styles.destinationsSection}>
      <h2>Popular Destinations</h2>
      <div className={styles.sliderContainer}>
        <button 
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => scroll('left')}
        >
          <FaChevronLeft />
        </button>
        
        <div className={styles.destinationSlider} id="destinationSlider">
          {destinations.map((dest) => (
            <div key={dest.id} className={styles.destinationCard}>
              <div className={styles.imageContainer}>
                <img src={dest.image} alt={`${dest.city}, ${dest.country}`} />
                <div className={styles.priceTag}>{dest.price}</div>
              </div>
              <div className={styles.cardContent}>
                <h3>{dest.city}</h3>
                <p className={styles.country}>{dest.country}</p>
                <p className={styles.description}>{dest.description}</p>
                <div className={styles.rating}>
                  ⭐️ {dest.rating}
                </div>
                <button 
                  className={styles.bookButton}
                  onClick={() => navigate('/booking', {
                    state: { destination: dest.city }
                  })}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => scroll('right')}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}