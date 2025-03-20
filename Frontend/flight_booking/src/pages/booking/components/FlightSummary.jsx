import React from 'react';
import { FaPlane, FaCalendarDay, FaClock, FaLuggageCart, FaUtensils } from 'react-icons/fa';
import styles from './FlightSummary.module.css';

export default function FlightSummary({ flight, bookingData, currentStep }) {
  if (!flight) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate total price based on flight price and add-ons
  const calculateTotalPrice = () => {
    if (!flight) return 0;
    
    // Start with base flight price
    let total = parseFloat(flight.total_amount);
    
    // Add add-ons costs if they exist
    if (bookingData.addOns) {
      // Bags
      if (bookingData.addOns.bags?.includes('extra_bag')) {
        total += 35;
      }
      if (bookingData.addOns.bags?.includes('overweight_bag')) {
        total += 45;
      }
      
      // Meals
      if (bookingData.addOns.meals?.includes('standard_meal')) {
        total += 15;
      }
      if (bookingData.addOns.meals?.includes('premium_meal')) {
        total += 25;
      }
      
      // Other options
      if (bookingData.addOns.insurance) {
        total += 20;
      }
      if (bookingData.addOns.priority) {
        total += 15;
      }
    }
    
    return total.toFixed(2);
  };
  
  return (
    <div className={styles.flightSummary}>
      <h3>Flight Summary</h3>
      
      {flight.slices && flight.slices.map((slice, index) => (
        <div key={index} className={styles.flightCard}>
          <div className={styles.flightHeader}>
            <div className={styles.airline}>
              <span>{flight.owner?.name || 'Airline'}</span>
            </div>
            <div className={styles.flightType}>
              {index === 0 ? 'Outbound' : 'Return'} Flight
            </div>
          </div>
          
          <div className={styles.route}>
            <div className={styles.airport}>
              <div className={styles.code}>{slice.origin?.iata_code}</div>
              <div className={styles.time}>{formatTime(slice.departing_at)}</div>
              <div className={styles.date}>{formatDate(slice.departing_at)}</div>
            </div>
            
            <div className={styles.flightLine}>
              <div className={styles.duration}>
                {Math.floor(slice.duration / 60)}h {slice.duration % 60}m
              </div>
              <div className={styles.line}></div>
              <FaPlane className={styles.planeIcon} />
            </div>
            
            <div className={styles.airport}>
              <div className={styles.code}>{slice.destination?.iata_code}</div>
              <div className={styles.time}>{formatTime(slice.arriving_at)}</div>
              <div className={styles.date}>{formatDate(slice.arriving_at)}</div>
            </div>
          </div>
        </div>
      ))}
      
      {currentStep >= 2 && (
        <div className={styles.passengerInfo}>
          <h4>Passengers</h4>
          <div className={styles.passengerCount}>
            {bookingData.passengers.length} {bookingData.passengers.length === 1 ? 'Passenger' : 'Passengers'}
          </div>
        </div>
      )}
      
      {currentStep >= 3 && bookingData.addOns && (
        <div className={styles.addOnsInfo}>
          <h4>Selected Add-ons</h4>
          
          {bookingData.addOns.seats.length > 0 && (
            <div className={styles.addOnItem}>
              <FaCouch />
              <span>Selected Seats: {bookingData.addOns.seats.length}</span>
            </div>
          )}
          
          {bookingData.addOns.bags.length > 0 && (
            <div className={styles.addOnItem}>
              <FaLuggageCart />
              <span>Extra Bags: {bookingData.addOns.bags.length}</span>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.priceSummary}>
        <h4>Price Summary</h4>
        <div className={styles.priceRow}>
          <span>Flight Price</span>
          <span>${parseFloat(flight.total_amount).toFixed(2)}</span>
        </div>
        
        {currentStep >= 3 && (
          <div className={styles.priceRow}>
            <span>Add-ons</span>
            <span>${(calculateTotalPrice() - parseFloat(flight.total_amount)).toFixed(2)}</span>
          </div>
        )}
        
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>${calculateTotalPrice()}</span>
        </div>
      </div>
    </div>
  );
}