import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingProgress from './components/BookingProgress';
import FlightSummary from './components/FlightSummary';
import PassengerDetails from './components/PassengerDetails';
// Make sure the path is correct:
import AddOns from './components/AddOns';
import Payment from './components/Payment';
import styles from './BookingProcess.module.css';

export default function BookingProcess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get selected flight from location state 
  const { selectedFlight, searchParams } = location.state || {};
  
  // Redirect to flights page if no flight is selected
  useEffect(() => {
    if (!selectedFlight) {
      navigate('/flights');
    }
  }, [selectedFlight, navigate]);
  
  // State for managing booking steps
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for storing booking data
  const [bookingData, setBookingData] = useState({
    passengers: [],
    selectedSeats: [],
    addOns: {
      bags: [],
      meals: [],
      insurance: false,
      priority: false
    }
  });
  
  // Handle passenger details updates
  const handleUpdatePassengers = (passengers) => {
    setBookingData(prev => ({
      ...prev,
      passengers
    }));
  };
  
  // Handle seat selection updates
  const handleUpdateSeats = (selectedSeats) => {
    setBookingData(prev => ({
      ...prev,
      selectedSeats
    }));
  };
  
  // Handle add-ons updates
  const handleUpdateAddOns = (addOns) => {
    setBookingData(prev => ({
      ...prev,
      addOns
    }));
  };
  
  // Move to the next step
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  // Move to the previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedFlight) return 0;
    
    // Start with base flight price
    let total = parseFloat(selectedFlight.total_amount);
    
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
    
    return total;
  };
  
  // Complete booking
  const handleCompleteBooking = () => {
    // Generate booking reference
    const bookingReference = 'BK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Navigate to confirmation page with all data
    navigate('/booking/confirmation', {
      state: {
        bookingReference,
        selectedFlight,
        passengers: bookingData.passengers,
        selectedSeats: bookingData.selectedSeats,
        addOns: bookingData.addOns,
        totalPrice: calculateTotalPrice()
      }
    });
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PassengerDetails 
            onContinue={handleNextStep}
            onUpdatePassengers={handleUpdatePassengers}
          />
        );
      case 2:
        return (
          <AddOns 
            onBack={handlePrevStep}
            onContinue={handleNextStep}
            onUpdateAddOns={handleUpdateAddOns}
          />
        );
      case 3:
        return (
          <Payment 
            onBack={handlePrevStep}
            totalPrice={calculateTotalPrice()}
            passengerData={bookingData.passengers}
            flightData={selectedFlight}
            addOns={bookingData.addOns}
            onComplete={handleCompleteBooking}
          />
        );
      default:
        return null;
    }
  };
  
  if (!selectedFlight) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <div className={styles.bookingProcess}>
      <div className={styles.container}>
        <BookingProgress currentStep={currentStep} />
        
        <div className={styles.bookingContent}>
          <div className={styles.leftColumn}>
            {renderStep()}
          </div>
          
          <div className={styles.rightColumn}>
            <FlightSummary 
              flight={selectedFlight}
              bookingData={bookingData}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}