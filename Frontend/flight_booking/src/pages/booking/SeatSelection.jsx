import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChair, FaArrowLeft, FaArrowRight, FaPlaneDeparture } from 'react-icons/fa';
import styles from './SeatSelection.module.css';

const SeatSelection = () => {
  // Get data from location
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract all data with default empty values
  const { searchParams = {}, passengers = [], order = null } = location.state || {};
  const flightData = location.state?.flight || null;
  
  // Keep other state variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengersList, setPassengersList] = useState([]); 
  const [flight, setFlight] = useState(flightData); // Initialize with data from location

  // Add this code block right here, after your state declarations
  // Check if data is present
  useEffect(() => {
    if (!location.state?.flight) {
      console.log("No flight data found, redirecting to flights page");
      navigate('/flights');
      return;
    }
  }, [location.state, navigate]);

  useEffect(() => {
    console.log("SeatSelection mounted with state:", location.state);
    // Check if we received passenger data
    if (!location.state?.passengers || !Array.isArray(location.state.passengers)) {
      console.error("Missing passenger data in SeatSelection!");
    }
  }, [location.state]);

  // Example seat data - in a real app, this would come from an API
  const seatMap = {
    rows: 20,
    seatsPerRow: 6,
    aisleAfter: 3, // Aisle after seat C
    seatLetters: ['A', 'B', 'C', 'D', 'E', 'F'],
    unavailableSeats: ['3A', '3B', '7C', '8D', '9F', '12A', '12B', '12C', '15D', '15E', '15F'],
    seatPrice: 9.99
  };

  useEffect(() => {
    // Simulate loading flight and passenger data
    setTimeout(() => {
      try {
        // In a real app, you'd get this from location.state or API
        if (location.state?.flight) {
          setFlight(location.state.flight);
        } else {
          setFlight({
            flightNumber: 'SJ 123',
            origin: 'LAX',
            destination: 'JFK',
            aircraft: 'Boeing 737-800'
          });
        }
        
        if (location.state?.passengers && location.state.passengers.length > 0) {
          setPassengersList(location.state.passengers);
        } else {
          // No fallback data - just show what was entered or nothing
          console.error("No passenger data available");
          setError("Missing passenger information. Please go back and enter passenger details.");
          // You could also redirect back to passenger form
          // navigate('/booking/passengers');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load flight or passenger information');
        setLoading(false);
      }
    }, 1000);
  }, [location]);

  const handleSeatSelection = (seat) => {
    if (isUnavailable(seat)) return;
    
    // Toggle seat selection
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      // Check if all passengers have seats already
      if (selectedSeats.length >= passengersList.length) {
        // Remove the first selected seat
        const newSelection = [...selectedSeats.slice(1), seat];
        setSelectedSeats(newSelection);
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const isUnavailable = (seat) => {
    return seatMap.unavailableSeats.includes(seat);
  };

  const isSelected = (seat) => {
    return selectedSeats.includes(seat);
  };

  const handleContinueToPayment = () => {
    // Now using the defined variables from location.state
    navigate("/booking/payment", { 
      state: {
        selectedFlight: flight,
        searchParams,       // Now properly defined from location.state
        passengers,         // Same here
        order,             // Same here
        selectedSeats      // This comes from your component state
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className={styles.loading}>Loading seat map...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // Generate seat grid
  const renderSeatMap = () => {
    const rows = [];
    
    for (let i = 1; i <= seatMap.rows; i++) {
      const rowSeats = [];
      
      for (let j = 0; j < seatMap.seatsPerRow; j++) {
        const seatLetter = seatMap.seatLetters[j];
        const seatId = `${i}${seatLetter}`;
        
        // Add aisle
        if (j === seatMap.aisleAfter) {
          rowSeats.push(<div key={`aisle-${i}-${j}`} className={styles.aisle}></div>);
        }
        
        let seatClass = styles.seat;
        if (isUnavailable(seatId)) {
          seatClass += ` ${styles.unavailable}`;
        } else if (isSelected(seatId)) {
          seatClass += ` ${styles.selected}`;
        } else {
          seatClass += ` ${styles.available}`;
        }
        
        rowSeats.push(
          <div 
            key={seatId} 
            className={seatClass} 
            onClick={() => handleSeatSelection(seatId)}
          >
            {seatId}
          </div>
        );
      }
      
      rows.push(
        <div key={`row-${i}`} className={styles.row}>
          {rowSeats}
        </div>
      );
    }
    
    return rows;
  };

  // Get passenger names for selected seats
  const getPassengerForSeat = (index) => {
    if (index < passengersList.length) {
      const p = passengersList[index];
      return `${p.details.given_name} ${p.details.family_name}`;
    }
    return 'Passenger';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaChair className={styles.icon} />
          Seat Selection
        </h1>
        <p>Select seats for your flight from {flight.origin} to {flight.destination}</p>
      </div>
      
      <div className={styles.seatSelectionContainer}>
        <div className={styles.aircraftInfo}>
          <div className={styles.aircraftName}>
            {flight.aircraft} · Flight {flight.flightNumber}
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
            {Array.from({ length: seatMap.rows }, (_, i) => (
              <div key={`row-label-${i+1}`} className={styles.rowNumber}>
                {i+1}
              </div>
            ))}
          </div>
          
          <div className={styles.seatMap}>
            {renderSeatMap()}
          </div>
        </div>
        
        <div className={styles.selectionSummary}>
          <h3>Your Seat Selection</h3>
          
          <div className={styles.selectedSeatsList}>
            {selectedSeats.length > 0 ? (
              <ul>
                {selectedSeats.map((seat, index) => (
                  <li key={seat}>
                    Seat {seat} - {getPassengerForSeat(index)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No seats selected yet</p>
            )}
            
            {passengersList.length > selectedSeats.length && (
              <p>Please select {passengersList.length - selectedSeats.length} more seat(s)</p>
            )}
          </div>
          
          <div className={styles.seatTotal}>
            <span>Seat Selection Fee:</span>
            <span className={styles.price}>
              ${(seatMap.seatPrice * selectedSeats.length).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          <FaArrowLeft /> Back
        </button>
        
        <button 
          className={styles.continueButton}
          onClick={handleContinueToPayment}
          disabled={selectedSeats.length < passengersList.length}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;