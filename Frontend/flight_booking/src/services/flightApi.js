import axios from 'axios';

// Create a dedicated axios instance for Duffel
const duffelApi = axios.create({
  baseURL: 'https://api.duffel.com/air',
  timeout: 60000, // 60 seconds
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_DUFFEL_API_KEY}`,
    'Duffel-Version': 'v1',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// The URL of your backend server
const BACKEND_URL = 'http://localhost:3002'; // Make sure this matches your server port

// Update your API headers
const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_DUFFEL_API_KEY}`,  // CHANGED
  'Duffel-Version': '2022-01-01',  // Use the correct version
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Add retry capabilities
const callWithRetry = async (apiCall, maxRetries = 2) => {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`API call failed (attempt ${i+1}/${maxRetries+1}):`, error);
      lastError = error;
      
      // Only wait if we're going to retry
      if (i < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1))); // Exponential backoff
      }
    }
  }
  throw lastError;
};

const searchFlights = async (searchParams) => {
  try {
    console.log("Starting flight search with Duffel API:", searchParams);
    
    // Format passenger data for Duffel
    const passengers = [];
    for (let i = 0; i < (parseInt(searchParams.adults) || 1); i++) {
      passengers.push({ type: 'adult' });
    }
    
    // Create payload for Duffel
    const payload = {
      data: {
        slices: [{
          origin: searchParams.origin,
          destination: searchParams.destination,
          departure_date: searchParams.departure_date
        }],
        passengers: passengers,
        cabin_class: searchParams.cabin_class || "economy",
        return_offers: true
      }
    };
    
    if (searchParams.return_date) {
      payload.data.slices.push({
        origin: searchParams.destination,
        destination: searchParams.origin,
        departure_date: searchParams.return_date
      });
    }
    
    const apiKey = import.meta.env.VITE_DUFFEL_API_KEY;
    console.log("Using API key (first few chars):", apiKey?.substring(0, 5) + "...");
    
    // Step 1: Create offer request with proxy
    const offerRequestResponse = await axios.post(
      '/api/duffel/air/offer_requests', 
      payload,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Duffel-Version': 'v1',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000
      }
    );
    
    const offerId = offerRequestResponse.data.data.id;
    console.log("Offer request created:", offerId);
    
    // Step 2: Get offers with proxy
    const offersResponse = await axios.get(
      `/api/duffel/air/offers?offer_request_id=${offerId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Duffel-Version': 'v1',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000
      }
    );
    
    const offers = offersResponse.data.data;
    console.log(`Found ${offers.length} offers`);
    
    return { flights: offers };
  } catch (error) {
    console.error("API ERROR:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
    throw error;
  }
}

// Add a mock data function
const getMockFlightData = (searchParams) => {
  // Simple mock data generator
  const mockFlights = [];
  const airlines = ['Delta', 'United', 'American', 'Southwest', 'JetBlue'];
  const flightNumbers = ['DL123', 'UA456', 'AA789', 'WN012', 'B6345'];
  
  // Generate 5-10 flights
  const numFlights = Math.floor(Math.random() * 5) + 5;
  
  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[i % airlines.length];
    const flightNumber = flightNumbers[i % flightNumbers.length];
    const basePrice = Math.floor(Math.random() * 300) + 100;
    
    mockFlights.push({
      id: `mock-flight-${i}`,
      slices: [
        {
          origin: {
            iata_code: searchParams.origin || 'LAX',
            name: 'Los Angeles International Airport'
          },
          destination: {
            iata_code: searchParams.destination || 'JFK',
            name: 'John F. Kennedy International Airport'
          },
          departure_date: searchParams.departure_date || '2025-05-15',
          departure_time: '10:00',
          arrival_time: '18:00',
          duration_minutes: 360, // 6 hours
          flight_number: flightNumber,
          airline: {
            name: airline,
            iata_code: flightNumber.slice(0, 2)
          }
        }
      ],
      price: {
        amount: basePrice,
        currency: 'USD'
      },
      total_amount: basePrice,
      total_currency: 'USD'
    });
  }
  
  return { flights: mockFlights };
};

// Update the processFlightResults function

function processFlightResults(flights) {
  return flights.map(offer => {
    // Extract slice and segment data
    const firstSlice = offer.slices?.[0] || {};
    const segments = firstSlice.segments || [];
    const firstSegment = segments[0] || {};
    
    // Calculate total stops
    const stops = segments.length - 1;
    
    // Format departure and arrival times
    const departureTime = formatTime(firstSegment.departing_at || new Date().toISOString());
    const arrivalTime = formatTime(firstSegment.arriving_at || new Date().toISOString());
    
    // Format duration
    const durationMinutes = firstSlice.duration || 0;
    const duration = formatDuration(durationMinutes);
    
    return {
      id: offer.id,
      airline: {
        name: offer.owner?.name || 'Unknown Airline',
        logo: `https://daisycon.io/images/airline/?width=100&height=50&color=ffffff&iata=${firstSegment.operating_carrier_iata_code || 'XX'}`
      },
      flightNumber: firstSegment.operating_carrier_flight_number || 'Unknown',
      origin: firstSlice.origin?.iata_code || firstSegment.origin?.iata_code || 'Unknown',
      destination: firstSlice.destination?.iata_code || firstSegment.destination?.iata_code || 'Unknown',
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      duration: duration,
      stops: stops,
      price: parseFloat(offer.total_amount || 0),
      currency: offer.total_currency || 'USD',
      cabinClass: firstSegment.cabin_class || 'economy',
      seatsAvailable: 10
    };
  });
}

// Helper functions for formatting
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default {
  searchFlights
};