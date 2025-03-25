import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Booking from './pages/booking/Booking';
import Flights from './pages/flights/Flights';
import FlightDetails from './pages/flights/FlightDetails';
import BookingProcess from './pages/booking/BookingProcess';
import PaymentForm from './pages/booking/components/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import Confirmation from './pages/booking/Confirmation';

// Update your imports to point to the correct paths
import HotelSearch from './components/Hotel/HotelSearch';
import HotelListing from './components/Hotel/HotelListing';
import HotelDetails from './components/Hotel/HotelDetails';
import HotelBooking from './components/Hotel/HotelBooking';
// If HotelConfirmation is used
import HotelConfirmation from './components/Hotel/HotelConfirmation';
import Concierge from './components/Concierge/Concierge';

// Add this import
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';

import styles from './styles/App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <Routes>
            {/* Flight routes */}
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/details" element={<FlightDetails />} />
            <Route path="/booking/process" element={<BookingProcess />} />
            <Route path="/booking/payment" element={<PaymentForm />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route path="/confirmation" element={<Confirmation />} />

            {/* Hotel routes */}
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/hotels/listing" element={<HotelListing />} />
            <Route path="/hotels/details/:id" element={<HotelDetails />} />
            <Route path="/hotels/booking/:id" element={<HotelBooking />} />
            <Route path="/hotels/confirmation" element={<HotelConfirmation />} />

            {/* Concierge route */}
            <Route path="/concierge" element={<Concierge />} />

            {/* Add this route inside your Routes component */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
