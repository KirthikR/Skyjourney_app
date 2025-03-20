import React from 'react';
import styles from '../styles/PassengerModal.module.css';

export default function PassengerModal({ isOpen, onClose, passengers, setPassengers, cabinClass, setCabinClass }) {
  const cabinClasses = [
    { id: 'economy', label: 'Economy', description: 'Best value for money' },
    { id: 'premiumEconomy', label: 'Premium Economy', description: 'Extra comfort and service' },
    { id: 'business', label: 'Business Class', description: 'Luxury travel experience' },
    { id: 'first', label: 'First Class', description: 'Ultimate luxury and comfort' }
  ];

  const updatePassengers = (type, operation) => {
    const limits = {
      adults: { min: 1, max: 9 },
      children: { min: 0, max: 9 },
      infants: { min: 0, max: 2 }
    };

    setPassengers(prev => ({
      ...prev,
      [type]: operation === 'add' 
        ? Math.min(prev[type] + 1, limits[type].max)
        : Math.max(prev[type] - 1, limits[type].min)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.section}>
          <h3>Passengers</h3>
          <div className={styles.passengerType}>
            <div className={styles.typeInfo}>
              <h4>Adults</h4>
              <p>Age 12+</p>
            </div>
            <div className={styles.counter}>
              <button 
                onClick={() => updatePassengers('adults', 'subtract')}
                disabled={passengers.adults <= 1}
              >-</button>
              <span>{passengers.adults}</span>
              <button 
                onClick={() => updatePassengers('adults', 'add')}
                disabled={passengers.adults >= 9}
              >+</button>
            </div>
          </div>

          <div className={styles.passengerType}>
            <div className={styles.typeInfo}>
              <h4>Children</h4>
              <p>Age 2-11</p>
            </div>
            <div className={styles.counter}>
              <button 
                onClick={() => updatePassengers('children', 'subtract')}
                disabled={passengers.children <= 0}
              >-</button>
              <span>{passengers.children}</span>
              <button 
                onClick={() => updatePassengers('children', 'add')}
                disabled={passengers.children >= 9}
              >+</button>
            </div>
          </div>

          <div className={styles.passengerType}>
            <div className={styles.typeInfo}>
              <h4>Infants</h4>
              <p>Under 2</p>
            </div>
            <div className={styles.counter}>
              <button 
                onClick={() => updatePassengers('infants', 'subtract')}
                disabled={passengers.infants <= 0}
              >-</button>
              <span>{passengers.infants}</span>
              <button 
                onClick={() => updatePassengers('infants', 'add')}
                disabled={passengers.infants >= 2}
              >+</button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Cabin Class</h3>
          <div className={styles.cabinClasses}>
            {cabinClasses.map(cabin => (
              <div 
                key={cabin.id}
                className={`${styles.cabinOption} ${cabinClass === cabin.id ? styles.active : ''}`}
                onClick={() => setCabinClass(cabin.id)}
              >
                <div className={styles.cabinInfo}>
                  <h4>{cabin.label}</h4>
                  <p>{cabin.description}</p>
                </div>
                <div className={styles.radioButton}>
                  <div className={styles.inner} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.doneButton} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}