import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaPlane } from 'react-icons/fa';
import styles from '../styles/TrendingDeals.module.css';

export default function TrendingDeals() {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const deals = [
    {
      id: 1,
      from: 'New York',
      to: 'Paris',
      price: 499,
      savings: '30%',
      airline: 'Air France',
      date: 'Dec 2025',
      imageUrl: '/daniele-la-rosa-messina-fRs9nxlXu2o-unsplash.jpg'
    },
    {
      id: 2,
      from: 'London',
      to: 'Dubai',
      price: 599,
      savings: '25%',
      airline: 'Emirates',
      date: 'april 2025',
      imageUrl: 'david-henderson-sHLhv8971iE-unsplash.jpg'
    },
    {
      id: 3,
      from: 'Tokyo',
      to: 'Singapore',
      price: 399,
      savings: '35%',
      airline: 'Singapore Airlines',
      date: 'may 2025',
      imageUrl: '/julien-de-salaberry-viwdmfrbXfI-unsplash.jpg'
    },
    {
      id: 4,
      from: 'Los Angeles',
      to: 'Tokyo',
      price: 799,
      savings: '20%',
      airline: 'JAL',
      date: 'july 2025',
      imageUrl: '/cedric-dhaenens--foTTNNe7Ak-unsplash.jpg'
    },
    {
      id: 5,
      from: 'Chicago',
      to: 'Rome',
      price: 649,
      savings: '28%',
      airline: 'Alitalia',
      date: 'oct 2025',
      imageUrl: '/sawyer-bengtson-tnv84LOjes4-unsplash.jpg'
    }
  ];

  const scroll = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    // Update arrow visibility after scroll
    setTimeout(() => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }, 300);
  };

  return (
    <section className={styles.trendingSection}>
      <div className={styles.sectionHeader}>
        <h2>🔥 Trending Deals</h2>
        <p className={styles.subtitle}>Exclusive offers for your next adventure</p>
      </div>

      <div className={styles.sliderContainer}>
        {showLeftArrow && (
          <button 
            className={`${styles.scrollButton} ${styles.scrollLeft}`}
            onClick={() => scroll('left')}
          >
            <FaChevronLeft />
          </button>
        )}

        <div className={styles.dealSlider} ref={sliderRef}>
          {deals.map((deal) => (
            <div key={deal.id} className={styles.dealCard}>
              <div className={styles.dealImage}>
                <img src={deal.imageUrl} alt={`${deal.from} to ${deal.to}`} />
                <div className={styles.savings}>Save {deal.savings}</div>
              </div>
              <div className={styles.dealInfo}>
                <div className={styles.route}>
                  <FaPlane className={styles.planeIcon} />
                  <h3>{deal.from} → {deal.to}</h3>
                </div>
                <p className={styles.price}>${deal.price}</p>
                <div className={styles.details}>
                  <p className={styles.airline}>{deal.airline}</p>
                  <p className={styles.date}>{deal.date}</p>
                </div>
                <Link 
                  to="/booking" 
                  className={styles.grabButton}
                  state={{ from: deal.from, to: deal.to }}
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button 
            className={`${styles.scrollButton} ${styles.scrollRight}`}
            onClick={() => scroll('right')}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}