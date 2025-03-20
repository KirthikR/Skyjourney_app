import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SearchResults.module.css';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (location.state?.results) {
      const { data } = location.state.results;
      if (data?.offers) {
        setOffers(data.offers);
      } else {
        setError('No flight offers found.');
      }
      setLoading(false);
    } else {
      setError('No search results available.');
      setLoading(false);
    }
  }, [location.state]);
  
  const handleSelectOffer = (offerId) => {
    navigate(`/offer/${offerId}`);
  };
  
  if (loading) return <div className={styles.loading}>Loading flight offers...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  return (
    <div className={styles.resultsContainer}>
      <h1>Flight Search Results</h1>
      <p>{offers.length} offers found</p>
      
      <div className={styles.offersList}>
        {offers.map(offer => (
          <div key={offer.id} className={styles.offerCard}>
            <div className={styles.offerHeader}>
              <span>{offer.owner.name}</span>
              <span className={styles.price}>
                {offer.total_amount} {offer.total_currency}
              </span>
            </div>
            
            {offer.slices.map((slice, index) => (
              <div key={index} className={styles.sliceInfo}>
                <div className={styles.airports}>
                  <span>{slice.origin.iata_code}</span>
                  <span>→</span>
                  <span>{slice.destination.iata_code}</span>
                </div>
                <div className={styles.times}>
                  <span>{new Date(slice.segments[0].departing_at).toLocaleString()}</span>
                  <span>-</span>
                  <span>
                    {new Date(slice.segments[slice.segments.length-1].arriving_at).toLocaleString()}
                  </span>
                </div>
                <div className={styles.duration}>
                  Duration: {Math.floor(slice.duration / 60)}h {slice.duration % 60}m
                </div>
              </div>
            ))}
            
            <button 
              className={styles.selectButton}
              onClick={() => handleSelectOffer(offer.id)}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}