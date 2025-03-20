import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentForm.module.css';
import { FaLock, FaCreditCard, FaPaypal, FaApplePay, FaChevronLeft, FaPlane } from 'react-icons/fa';

export default function PaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [processing, setProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  useEffect(() => {
    // Check if we have the required data
    if (!location.state?.selectedOffer || !location.state?.passengers) {
      console.error('Missing booking data, redirecting to search');
      navigate('/booking');
      return;
    }
    
    setSelectedOffer(location.state.selectedOffer);
    setPassengers(location.state.passengers);
    
    console.log('Payment page loaded with data:', {
      offer: location.state.selectedOffer,
      passengers: location.state.passengers
    });
  }, [location.state, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!paymentDetails.cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Invalid card number';
    }
    
    if (!paymentDetails.cardName) {
      errors.cardName = 'Name on card is required';
    }
    
    if (!paymentDetails.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    }
    
    if (!paymentDetails.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = 'Invalid CVV';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Show processing state
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Proceed to confirmation
      navigate('/booking/confirmation', {
        state: {
          selectedOffer,
          passengers,
          paymentMethod,
          paymentConfirmed: true
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setFormErrors({
        ...formErrors,
        form: 'There was an error processing your payment. Please try again.'
      });
      setProcessing(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to passenger details
  };
  
  if (!selectedOffer) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }
  
  const primaryPassenger = passengers[0] || {};
  const totalPassengers = passengers.length;
  
  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton} disabled={processing}>
        <FaChevronLeft /> Back to passenger details
      </button>
      
      <div className={styles.header}>
        <h1>Payment</h1>
        <p className={styles.subtitle}>Complete your booking by providing payment details</p>
      </div>
      
      <div className={styles.columns}>
        <div className={styles.paymentColumn}>
          <div className={styles.securePayment}>
            <FaLock className={styles.lockIcon} />
            <span>Secure payment</span>
          </div>
          
          <div className={styles.paymentMethodTabs}>
            <button 
              className={`${styles.methodTab} ${paymentMethod === 'creditCard' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('creditCard')}
            >
              <FaCreditCard /> Credit Card
            </button>
            <button 
              className={`${styles.methodTab} ${paymentMethod === 'paypal' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <FaPaypal /> PayPal
            </button>
            <button 
              className={`${styles.methodTab} ${paymentMethod === 'applePay' ? styles.active : ''}`}
              onClick={() => setPaymentMethod('applePay')}
            >
              <FaApplePay /> Apple Pay
            </button>
          </div>
          
          {paymentMethod === 'creditCard' && (
            <form onSubmit={handleSubmit} className={styles.paymentForm}>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number*</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  disabled={processing}
                  className={formErrors.cardNumber ? styles.inputError : ''}
                />
                {formErrors.cardNumber && <div className={styles.errorText}>{formErrors.cardNumber}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cardName">Name on Card*</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="John Smith"
                  value={paymentDetails.cardName}
                  onChange={handleInputChange}
                  disabled={processing}
                  className={formErrors.cardName ? styles.inputError : ''}
                />
                {formErrors.cardName && <div className={styles.errorText}>{formErrors.cardName}</div>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate">Expiry Date*</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={handleInputChange}
                    maxLength="5"
                    disabled={processing}
                    className={formErrors.expiryDate ? styles.inputError : ''}
                  />
                  {formErrors.expiryDate && <div className={styles.errorText}>{formErrors.expiryDate}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="cvv">CVV*</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={handleInputChange}
                    maxLength="4"
                    disabled={processing}
                    className={formErrors.cvv ? styles.inputError : ''}
                  />
                  {formErrors.cvv && <div className={styles.errorText}>{formErrors.cvv}</div>}
                </div>
              </div>
              
              <div className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={paymentDetails.saveCard}
                  onChange={handleInputChange}
                  disabled={processing}
                />
                <label htmlFor="saveCard">Save card for future bookings</label>
              </div>
              
              {formErrors.form && <div className={styles.formError}>{formErrors.form}</div>}
              
              <button 
                type="submit" 
                className={styles.paymentButton}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className={styles.miniSpinner}></div>
                    Processing...
                  </>
                ) : (
                  `Pay ${selectedOffer.total_currency} ${selectedOffer.total_amount}`
                )}
              </button>
            </form>
          )}
          
          {paymentMethod === 'paypal' && (
            <div className={styles.alternativePayment}>
              <p>You'll be redirected to PayPal to complete your payment.</p>
              <button 
                className={styles.paymentButton}
                onClick={handleSubmit}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className={styles.miniSpinner}></div>
                    Processing...
                  </>
                ) : (
                  'Continue to PayPal'
                )}
              </button>
            </div>
          )}
          
          {paymentMethod === 'applePay' && (
            <div className={styles.alternativePayment}>
              <p>Complete your purchase with Apple Pay.</p>
              <button 
                className={`${styles.paymentButton} ${styles.applePayButton}`}
                onClick={handleSubmit}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className={styles.miniSpinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaApplePay className={styles.applePayIcon} /> Pay
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.summaryColumn}>
          <div className={styles.orderSummary}>
            <h3>Booking Summary</h3>
            
            <div className={styles.flightSummary}>
              <div className={styles.flightRoute}>
                <FaPlane className={styles.icon} />
                <span>
                  {selectedOffer.slices[0]?.origin?.iata_code || 'N/A'} ⟶ {selectedOffer.slices[0]?.destination?.iata_code || 'N/A'}
                  {selectedOffer.slices[1] && ` (Round Trip)`}
                </span>
              </div>
              <div className={styles.airline}>{selectedOffer.owner?.name || 'Airline'}</div>
            </div>
            
            <div className={styles.passengersSummary}>
              <h4>Passengers</h4>
              <div className={styles.primaryPassenger}>
                <strong>Primary: </strong>
                {primaryPassenger.title} {primaryPassenger.firstName} {primaryPassenger.lastName}
              </div>
              <div className={styles.totalPassengers}>{totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}</div>
            </div>
            
            <div className={styles.priceSummary}>
              <div className={styles.priceRow}>
                <span>Base fare</span>
                <span>{selectedOffer.total_currency} {Number(selectedOffer.total_amount) * 0.8}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Taxes & fees</span>
                <span>{selectedOffer.total_currency} {Number(selectedOffer.total_amount) * 0.2}</span>
              </div>
              <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                <span>Total</span>
                <span>{selectedOffer.total_currency} {selectedOffer.total_amount}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.securityNote}>
            <FaLock className={styles.icon} />
            <p>Your payment information is encrypted and secure. We never store your full credit card details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}