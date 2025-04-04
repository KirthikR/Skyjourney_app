import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaArrowLeft, FaArrowRight, FaLock } from 'react-icons/fa';
import styles from "./PaymentForm.module.css"; // Make sure this file exists!

export default function PaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add this at the top of your component to debug:
  useEffect(() => {
    console.log("PaymentForm mounted with state:", location.state);
    
    // Check for proper data
    if (!location.state) {
      console.error("No location state in PaymentForm");
    } else {
      console.log("Flight data:", location.state.selectedFlight || location.state.flight);
      console.log("Passengers:", location.state.passengers);
      console.log("Selected seats:", location.state.selectedSeats);
    }
  }, [location.state]);

  // Make sure your component handles both possible prop names:
  const { 
    selectedFlight = location.state?.flight || null,  // Handle both names
    searchParams = {},
    passengers = [], 
    order = null,
    selectedSeats = [] 
  } = location.state || {};
  
  // Log state for debugging
  useEffect(() => {
    console.log("PaymentForm mounted with state:", location.state);
    
    if (!selectedFlight) {
      console.warn("No flight data found in state");
    }
  }, [location.state, selectedFlight]);

  useEffect(() => {
    // Check for debug data in sessionStorage
    const debugData = sessionStorage.getItem('debugPaymentData');
    if (debugData && (!location.state || !location.state.selectedFlight)) {
      try {
        const parsedData = JSON.parse(debugData);
        // Use this data as if it came from location.state
        // You'll need to manually set each piece of state
      } catch (e) {
        console.error("Failed to parse debug data", e);
      }
    }
  }, [location.state]);
  
  // Handle missing data
  useEffect(() => {
    // Check if we're missing critical data
    if (!location.state || !selectedFlight) {
      setError("Missing booking information. Please start again.");
      // Optional: redirect back after a delay
      setTimeout(() => navigate('/booking'), 3000);
    }
  }, [location.state, selectedFlight, navigate]);
  
  // Form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({});
  
  // Process payment
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!cardName) errors.cardName = "Card holder name is required";
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) 
      errors.cardNumber = "Valid card number is required";
    if (!expDate) errors.expDate = "Expiration date is required";
    if (!cvv || cvv.length !== 3) errors.cvv = "Valid CVV is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // Add debugging to see what's happening
    console.log("Processing payment...");
    
    // Simulate payment process
    setTimeout(() => {
      // Create confirmation data
      const confirmationData = {
        bookingId: "BK" + Math.floor(Math.random() * 1000000),
        bookingDate: new Date().toISOString(),
        paymentInfo: {
          cardLast4: cardNumber.slice(-4),
          paymentDate: new Date().toISOString(),
          amount: calculateTotalPrice()
        },
        // Include all necessary data
        selectedFlight: selectedFlight,
        searchParams,
        passengers,
        selectedSeats
      };
      
      console.log("Payment complete, navigating to confirmation with data:", confirmationData);
      
      // Try BOTH navigation paths to see which works
      // First attempt regular navigation:
      navigate('/booking/confirmation', { state: confirmationData });
      
      // If that doesn't work, try this backup approach:
      // window.location.href = '/booking/confirmation';
      // sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
    }, 2000);
  };
  
  // Calculate price
  const calculateTotalPrice = () => {
    // Get base price from flight with fallbacks
    let basePrice = 0;
    
    if (selectedFlight?.total_amount) {
      basePrice = parseFloat(selectedFlight.total_amount);
    } else if (selectedFlight?.price) {
      basePrice = parseFloat(selectedFlight.price);
    } else if (selectedFlight?.base_amount) {
      basePrice = parseFloat(selectedFlight.base_amount);
    }
    
    // Add seat prices if any
    const seatPrice = (selectedSeats || []).reduce((total, seat) => 
      total + (seat?.price || 0), 0
    );
    
    return basePrice + seatPrice;
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length > 0 ? parts.join(' ') : value;
  };
  
  // Return to previous step
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // If we're still loading or there's an error
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>There was a problem</h2>
          <p>{error}</p>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/booking')}
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaCreditCard className={styles.icon} />
          Secure Payment
        </h1>
        <p>Complete your booking by providing your payment details</p>
      </div>
      
      <div className={styles.paymentContainer}>
        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3>Booking Summary</h3>
          
          <div className={styles.flightInfo}>
            <div className={styles.route}>
              {selectedFlight?.origin || selectedFlight?.slices?.[0]?.origin?.iata_code || 'Departure'} → 
              {selectedFlight?.destination || selectedFlight?.slices?.[0]?.destination?.iata_code || 'Arrival'}
            </div>
            <div className={styles.date}>
              {new Date(selectedFlight?.departureTime || 
                selectedFlight?.slices?.[0]?.segments?.[0]?.departing_at || 
                Date.now()).toLocaleDateString()}
            </div>
            <div className={styles.passengers}>
              {passengers?.length || 1} Passenger(s)
            </div>
          </div>
          
          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>Base fare</span>
              <span>${parseFloat(selectedFlight?.base_amount || selectedFlight?.price || 0).toFixed(2)}</span>
            </div>
            {selectedSeats && selectedSeats.length > 0 && (
              <div className={styles.priceRow}>
                <span>Seat selection</span>
                <span>
                  ${selectedSeats.reduce((sum, seat) => sum + (seat?.price || 0), 0).toFixed(2)}
                </span>
              </div>
            )}
            <div className={styles.priceRow}>
              <span>Taxes & fees</span>
              <span>${parseFloat(selectedFlight?.tax_amount || 25.00).toFixed(2)}</span>
            </div>
            <div className={`${styles.priceRow} ${styles.totalPrice}`}>
              <span>Total</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <div className={styles.paymentForm}>
          <div className={styles.securePayment}>
            <FaLock className={styles.lockIcon} /> Secure payment - Your data is encrypted
          </div>
          
          {error && <div className={styles.formError}>{error}</div>}
          
          <form onSubmit={handleSubmitPayment}>
            <div className={styles.formGroup}>
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name as it appears on your card"
              />
              {formErrors.cardName && <div className={styles.fieldError}>{formErrors.cardName}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {formErrors.cardNumber && <div className={styles.fieldError}>{formErrors.cardNumber}</div>}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="expDate">Expiration Date</label>
                <input
                  id="expDate"
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {formErrors.expDate && <div className={styles.fieldError}>{formErrors.expDate}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  maxLength="3"
                />
                {formErrors.cvv && <div className={styles.fieldError}>{formErrors.cvv}</div>}
              </div>
            </div>
            
            <div className={styles.checkbox}>
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the terms & conditions and privacy policy
              </label>
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.backButton}
                onClick={handleGoBack}
              >
                <FaArrowLeft /> Back
              </button>
              
              <button
                type="submit"
                className={styles.payButton}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Payment'}
                {!loading && <FaArrowRight />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}