import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Extras.module.css';
import { FaSuitcase, FaUtensils, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function Extras() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedFlight = location.state?.selectedFlight;
  const searchParams = location.state?.searchParams;
  const passengers = location.state?.passengers;
  const contactInfo = location.state?.contactInfo;
  
  const [selectedBaggage, setSelectedBaggage] = useState({});
  const [selectedMeals, setSelectedMeals] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Redirect if missing data
  if (!selectedFlight || !passengers) {
    navigate('/flights');
    return null;
  }
  
  const baggageOptions = [
    { id: 'no-baggage', name: 'No Extra Baggage', price: 0 },
    { id: 'extra-1', name: '1 Extra Bag (23kg)', price: 30 },
    { id: 'extra-2', name: '2 Extra Bags (23kg each)', price: 55 }
  ];
  
  const mealOptions = [
    { id: 'standard', name: 'Standard Meal', price: 0 },
    { id: 'vegetarian', name: 'Vegetarian Meal', price: 10 },
    { id: 'vegan', name: 'Vegan Meal', price: 12 },
    { id: 'gluten-free', name: 'Gluten-free Meal', price: 15 }
  ];
  
  const handleBaggageSelect = (passengerId, optionId) => {
    setSelectedBaggage({
      ...selectedBaggage,
      [passengerId]: optionId
    });
  };
  
  const handleMealSelect = (passengerId, optionId) => {
    setSelectedMeals({
      ...selectedMeals,
      [passengerId]: optionId
    });
  };
  
  const calculateExtrasTotal = () => {
    let total = 0;
    
    // Calculate baggage costs
    Object.entries(selectedBaggage).forEach(([passengerId, optionId]) => {
      const option = baggageOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    
    // Calculate meal costs
    Object.entries(selectedMeals).forEach(([passengerId, optionId]) => {
      const option = mealOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    
    return total;
  };
  
  const calculateTotalPrice = () => {
    const flightPrice = parseFloat(selectedFlight.total_amount);
    const extrasPrice = calculateExtrasTotal();
    return (flightPrice + extrasPrice).toFixed(2);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleContinue = () => {
    // Navigate to payment page
    navigate('/booking/payment', {
      state: {
        selectedFlight,
        searchParams,
        passengers,
        contactInfo,
        extras: {
          baggage: selectedBaggage,
          meals: selectedMeals,
          totalExtras: calculateExtrasTotal()
        },
        totalPrice: calculateTotalPrice()
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Optional Extras</h1>
      
      <div className={styles.flightSummary}>
        <div className={styles.summary}>
          <p><strong>Flight:</strong> {selectedFlight.owner.name}</p>
          <p><strong>From:</strong> {selectedFlight.slices[0].origin.iata_code} to {selectedFlight.slices[0].destination.iata_code}</p>
          <p><strong>Date:</strong> {new Date(selectedFlight.slices[0].departing_at).toLocaleDateString()}</p>
        </div>
        <div className={styles.price}>
          <p>Flight Total: {selectedFlight.total_amount} {selectedFlight.total_currency}</p>
        </div>
      </div>
      
      <div className={styles.extrasContainer}>
        {passengers.map((passenger, index) => (
          <div key={passenger.id} className={styles.passengerExtras}>
            <h3>
              {passenger.title} {passenger.firstName} {passenger.lastName}
              {passenger.type !== 'adult' && (
                <span className={styles.passengerType}>
                  {passenger.type === 'child' ? ' (Child)' : ' (Infant)'}
                </span>
              )}
            </h3>
            
            <div className={styles.extrasSection}>
              <div className={styles.extrasHeader}>
                <FaSuitcase className={styles.icon} />
                <h4>Baggage Options</h4>
              </div>
              
              <div className={styles.optionsGrid}>
                {baggageOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`${styles.optionCard} ${selectedBaggage[passenger.id] === option.id ? styles.selected : ''}`}
                    onClick={() => handleBaggageSelect(passenger.id, option.id)}
                  >
                    <div className={styles.optionName}>{option.name}</div>
                    <div className={styles.optionPrice}>
                      {option.price > 0 ? `+${option.price} ${selectedFlight.total_currency}` : 'Included'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.extrasSection}>
              <div className={styles.extrasHeader}>
                <FaUtensils className={styles.icon} />
                <h4>Meal Preferences</h4>
              </div>
              
              <div className={styles.optionsGrid}>
                {mealOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`${styles.optionCard} ${selectedMeals[passenger.id] === option.id ? styles.selected : ''}`}
                    onClick={() => handleMealSelect(passenger.id, option.id)}
                  >
                    <div className={styles.optionName}>{option.name}</div>
                    <div className={styles.optionPrice}>
                      {option.price > 0 ? `+${option.price} ${selectedFlight.total_currency}` : 'Included'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.totalSection}>
        <div className={styles.totalDetails}>
          <div className={styles.totalRow}>
            <span>Flight Price:</span>
            <span>{selectedFlight.total_amount} {selectedFlight.total_currency}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Selected Extras:</span>
            <span>{calculateExtrasTotal()} {selectedFlight.total_currency}</span>
          </div>
          <div className={styles.totalRowFinal}>
            <span>Total Price:</span>
            <span>{calculateTotalPrice()} {selectedFlight.total_currency}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          type="button" 
          className={styles.backButton}
          onClick={handleBack}
        >
          <FaArrowLeft /> Back
        </button>
        
        <button 
          type="button" 
          className={styles.continueButton}
          onClick={handleContinue}
        >
          Continue to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );
}