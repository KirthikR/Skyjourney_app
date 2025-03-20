import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChair, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './SeatSelection.module.css';

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get data from previous step
  const { selectedFlight, searchParams, passengers } = location.state || {};
  
  // Generate rows and seats for demonstration
  const getSeats = () => {
    // Creating a simple 10 rows x 6 seats layout
    const rows = [];
    for (let i = 1; i <= 10; i++) {
      const row = {
        rowNumber: i,
        seats: []
      };
      
      // Add 6 seats per row (A-F)
      for (let j = 0; j < 6; j++) {
        const seatLetter = String.fromCharCode(65 + j);
        const seatNumber = `${i}${seatLetter}`;
        const isAisle = j === 2 || j === 3;
        const randomAvailability = Math.random() > 0.2; // 20% chance seat is taken
        
        row.seats.push({
          id: seatNumber,
          number: seatNumber,
          isAisle,
          available: randomAvailability,
          price: isAisle ? 25 : 20,
        });
      }
      
      rows.push(row);
    }
    
    return rows;
  };
  
  const [seatMap, setSeatMap] = useState(getSeats());
  
  // Handle seat selection
  const handleSeatSelect = (seat) => {
    if (!seat.available) return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < passengers.length) {
      // Select seat
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setError(`You can only select ${passengers.length} seats`);
    }
  };
  
  // Navigate back to passenger details
  const handleBack = () => {
    navigate('/booking/passengers', {
      state: {
        selectedFlight,
        searchParams,
        passengers
      }
    });
  };
  
  // Continue to add-ons
  const handleContinue = () => {
    if (selectedSeats.length < passengers.length) {
      setError(`Please select ${passengers.length} seats`);
      return;
    }
    
    navigate('/booking/confirmation', {
      state: {
        selectedFlight,
        searchParams,
        passengers,
        selectedSeats: selectedSeats.map(seat => seat.number)
      }
    });
  };

  // Redirect if no flight selected
  useEffect(() => {
    if (!selectedFlight) {
      navigate('/flights');
    }
  }, [selectedFlight, navigate]);
  
  if (!selectedFlight || !passengers) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><FaChair className={styles.icon} /> Select Your Seats</h1>
        <p>Choose {passengers.length} seats for your flight</p>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.seatSelectionContainer}>
        <div className={styles.aircraftInfo}>
          <div className={styles.aircraftName}>
            {selectedFlight.aircraft || 'Boeing 737'}
          </div>
          <div className={styles.seatLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.available}`}></div>
              <span>Available</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.selected}`}></div>
              <span>Selected</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.seat} ${styles.unavailable}`}></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>
        
        <div className={styles.cabinLayout}>
          <div className={styles.rowLabels}>
            {seatMap.map(row => (
              <div key={`row-${row.rowNumber}`} className={styles.rowNumber}>
                {row.rowNumber}
              </div>
            ))}
          </div>
          
          <div className={styles.seatMap}>
            {seatMap.map(row => (
              <div key={`seats-${row.rowNumber}`} className={styles.row}>
                {row.seats.map((seat, index) => (
                  <React.Fragment key={seat.id}>
                    <div 
                      className={`
                        ${styles.seat} 
                        ${seat.available ? styles.available : styles.unavailable}
                        ${selectedSeats.find(s => s.id === seat.id) ? styles.selected : ''}
                      `}
                      onClick={() => handleSeatSelect(seat)}
                    >
                      {seat.number.substring(1)}
                    </div>
                    {seat.isAisle && index === 2 && <div className={styles.aisle}></div>}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.selectionSummary}>
          <h3>Your Selection</h3>
          <div className={styles.selectedSeatsList}>
            {selectedSeats.length === 0 ? (
              <p>No seats selected yet</p>
            ) : (
              <ul>
                {selectedSeats.map((seat, index) => (
                  <li key={seat.id}>
                    Seat {seat.number} - ${seat.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.seatTotal}>
            <span>Total for Seats:</span>
            <span className={styles.price}>
              ${selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          type="button" 
          className={styles.backButton}
          onClick={handleBack}
        >
          <FaArrowLeft /> Back to Passenger Details
        </button>
        <button 
          type="button" 
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={selectedSeats.length !== passengers.length}
        >
          Continue to Confirmation <FaArrowRight />
        </button>
      </div>
    </div>
  );
}