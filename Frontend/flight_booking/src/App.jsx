import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import posthog from 'posthog-js';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Booking from './pages/booking/Booking';
import Flights from './pages/flights/Flights';
import FlightDetails from './pages/flights/FlightDetails';
import BookingProcess from './pages/booking/BookingProcess';
import PaymentForm from './pages/booking/PaymentForm';
import BookingConfirmation from './pages/booking/BookingConfirmation';
import BookingDetails from './pages/booking/BookingDetails';
import PassengerDetails from './pages/booking/PassengerDetails';
import SeatSelection from './pages/booking/SeatSelection';

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

// Add this import
import CarHire from './components/CarHire/CarHire';

// Add this import at the top with your other imports
import AboutUs from './components/AboutUs';

// Add this import at the top with your other imports
import Blog from './components/Blog';
import PostHogDebug from './components/PostHogDebug';
import PostHogTest from './components/PostHogTest';
import styles from './styles/App.module.css';
import { trackPageView } from './utils/analytics';
import ConsentBanner from './components/ConsentBanner';
import FlightDetailsPage from './pages/flights/FlightDetailsPage';
import FlightResults from './pages/flights/FlightResults';

// Create a RouteTracker component
function RouteTracker() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <>
      <RouteTracker />
      <Navbar />
      <div className={styles.container}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Flight Booking Flow */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/flight-results" element={<FlightResults />} />
          <Route path="/flight/:id" element={<FlightDetailsPage />} />
          <Route path="/flight-details/:id" element={<FlightDetails />} />
          <Route path="/booking/passengers" element={<PassengerDetails />} />
          <Route path="/booking/seats" element={<SeatSelection />} />
          <Route path="/booking/payment" element={<PaymentForm />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-process" element={<BookingProcess />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-details/:id" element={<BookingDetails />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Car Hire and Concierge Routes */}
          <Route path="/car-hire" element={<CarHire />} />
          <Route path="/concierge" element={<Concierge />} />
          
          {/* Hotel Booking Flow */}
          <Route path="/hotels" element={<HotelSearch />} />
          <Route path="/hotels/listing" element={<HotelListing />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/hotels/booking/:id" element={<HotelBooking />} />
          <Route path="/hotels/confirmation" element={<HotelConfirmation />} />
          
          {/* Additional Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Development & Debug Routes */}
          <Route path="/posthog/debug" element={<PostHogDebug />} />
          <Route path="/posthog/test" element={<PostHogTest />} />
        </Routes>
      </div>
      <ConsentBanner />
      {/* Removed DebugPanel here */}
    </>
  );
}

export default App;
