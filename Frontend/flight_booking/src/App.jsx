import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './styles/App.module.css';
import Home from "./pages/Home";
import Flights from "./pages/flights/Flights";
import Booking from "./pages/booking/Booking";
import BookingDetails from './pages/booking/BookingDetails';
import PassengerDetails from './pages/booking/PassengerDetails';
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentForm from "./pages/booking/PaymentForm";

function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [error, setError] = useState(null);

  // Check backend connectivity on startup
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/status');
        if (!response.ok) {
          throw new Error(`API status check failed: ${response.status}`);
        }
        const data = await response.json();
        setApiStatus(data.status);
        if (!data.duffelConfigured) {
          setError('Duffel API is not properly configured on the server.');
        }
      } catch (err) {
        console.error('Backend connection error:', err);
        setApiStatus('offline');
        setError('Cannot connect to the backend server. Please make sure it is running.');
      }
    };

    checkApiStatus();
  }, []);

  if (apiStatus === 'checking') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Connecting to server...</p>
      </div>
    );
  }

  if (apiStatus === 'offline' || error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Connection Error</h2>
        <p>{error || 'Cannot connect to the server. Please try again later.'}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/booking/details" element={<BookingDetails />} />
            <Route path="/booking/passengers" element={<PassengerDetails />} />
            <Route path="/booking/payment" element={<PaymentForm />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
