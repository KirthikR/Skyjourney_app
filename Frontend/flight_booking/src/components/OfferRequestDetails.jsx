import React from 'react';
import { useParams } from 'react-router-dom';
import useOfferRequest from '../hooks/useOfferRequest';
import styles from './OfferRequestDetails.module.css';

const OfferRequestDetails = () => {
  // Get ID from URL params
  const { id } = useParams();
  const { offerRequest, loading, error } = useOfferRequest(id);

  if (loading) {
    return <div className={styles.loading}>Loading offer request details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!offerRequest) {
    return <div className={styles.notFound}>Offer request not found</div>;
  }

  // Render the offer request data
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Offer Request Details</h2>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h3>Request #{offerRequest.data.id}</h3>
          <span className={styles.status}>{offerRequest.data.live_mode ? 'Live' : 'Test'}</span>
        </div>
        
        <div className={styles.details}>
          <div className={styles.section}>
            <h4>Passenger Information</h4>
            <div className={styles.passengersList}>
              {offerRequest.data.passengers.map((passenger, index) => (
                <div key={passenger.id} className={styles.passenger}>
                  <span className={styles.passengerType}>{passenger.type}</span>
                  <span>Passenger {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>Requested Slices</h4>
            <div className={styles.slicesList}>
              {offerRequest.data.slices.map((slice, index) => (
                <div key={index} className={styles.slice}>
                  <div className={styles.route}>
                    <span className={styles.airport}>{slice.origin.iata_code}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.airport}>{slice.destination.iata_code}</span>
                  </div>
                  <div className={styles.date}>
                    {new Date(slice.departure_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>Additional Details</h4>
            <div className={styles.additionalInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Cabin Class:</span>
                <span>{offerRequest.data.cabin_class}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Created:</span>
                <span>{new Date(offerRequest.data.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferRequestDetails;