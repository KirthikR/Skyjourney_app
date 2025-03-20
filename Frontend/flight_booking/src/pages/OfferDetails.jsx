import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOfferDetails } from '../services/api';
import styles from './OfferDetails.module.css';

export default function OfferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await getOfferDetails(id);
        setOffer(response.data);
      } catch (error) {
        setError('Failed to load offer details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOfferDetails();
  }, [id]);
  
  const handleBookNow = () => {
    navigate(`/booking-form/${id}`, { state: { offer } });
  };
  
  if (loading) return <div className={styles.loading}>Loading offer details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!offer) return <div className={styles.error}>No offer details available.</div>;
  
  return (
    <div className={styles.offerDetailsContainer}>
      <h1>Flight Details</h1>
      
      <div className={styles.offerSummary}>
        <h2>{offer.owner.name}</h2>
        <div className={styles.totalPrice}>
          Total: {offer.total_amount} {offer.total_currency}
        </div>
      </div>
      
      {offer.slices.map((slice, index) => (
        <div key={index} className={styles.sliceDetails}>
          <h3>
            {slice.origin.iata_code} to {slice.destination.iata_code}
          </h3>
          
          {slice.segments.map((segment, segIndex) => (
            <div key={segIndex} className={styles.segment}>
              <div className={styles.airline}>
                <img 
                  src={`https://logos.skyscnr.com/images/airlines/favicon/${segment.operating_carrier.iata_code}.png`}
                  alt={segment.operating_carrier.name}
                  className={styles.airlineLogo}
                />
                <span>{segment.operating_carrier.name} {segment.operating_carrier_flight_number}</span>
              </div>
              
              <div className={styles.segmentTimes}>
                <div>
                  <div className={styles.time}>
                    {new Date(segment.departing_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className={styles.airport}>{segment.origin.iata_code}</div>
                  <div className={styles.date}>
                    {new Date(segment.departing_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className={styles.duration}>
                  {Math.floor(segment.duration / 60)}h {segment.duration % 60}m
                </div>
                
                <div>
                  <div className={styles.time}>
                    {new Date(segment.arriving_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className={styles.airport}>{segment.destination.iata_code}</div>
                  <div className={styles.date}>
                    {new Date(segment.arriving_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div className={styles.cabinInfo}>
        <h3>Cabin and Baggage</h3>
        <p>Cabin class: {offer.passenger_identity_documents_required ? 'Required' : 'Not required'}</p>
        <p>Changeable: {offer.conditions?.change_before_departure?.allowed ? 'Yes' : 'No'}</p>
        <p>Refundable: {offer.conditions?.refund_before_departure?.allowed ? 'Yes' : 'No'}</p>
      </div>
      
      <button 
        className={styles.bookButton}
        onClick={handleBookNow}
      >
        Book Now
      </button>
    </div>
  );
}