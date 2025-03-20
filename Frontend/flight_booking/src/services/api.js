import axios from 'axios';

// API base URL - adjust as needed for your backend
const API_BASE_URL = 'http://localhost:3002/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log API requests
apiClient.interceptors.request.use(request => {
  console.log('API Request:', request.method, request.url);
  return request;
});

// Log API responses
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

const DUFFEL_API_URL = 'https://api.duffel.com/air';
const DUFFEL_API_TOKEN = import.meta.env.VITE_DUFFEL_API_TOKEN; // Add your actual Duffel API token

// Headers required for Duffel API
const headers = {
  'Authorization': `Bearer ${DUFFEL_API_TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Duffel-Version': 'v1'
};

// Basic flight search API
export async function searchFlights(searchParams) {
  // For now, use mock data
  return getMockFlights(searchParams);
}

// Mock flight data for testing
export function getMockFlights(searchParams) {
  console.log('Using mock flight data');
  
  const airlines = [
    { code: "EK", name: "Emirates" },
    { code: "SQ", name: "Singapore Airlines" },
    { code: "QR", name: "Qatar Airways" },
    { code: "BA", name: "British Airways" }
  ];
  
  // Generate between 3-8 flights
  const numFlights = Math.floor(Math.random() * 6) + 3;
  const flights = [];
  
  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const price = Math.floor(Math.random() * 600) + 300; 
    
    flights.push({
      id: `mock_offer_${Math.random().toString(36).substring(2, 9)}`,
      live_mode: false,
      available_services: [],
      passenger_identity_documents_required: false,
      total_emissions_kg: Math.floor(Math.random() * 1000) + 500,
      total_currency: "USD",
      total_amount: price.toFixed(2),
      tax_currency: "USD",
      tax_amount: (price * 0.1).toFixed(2),
      base_currency: "USD",
      base_amount: (price * 0.9).toFixed(2),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      owner: {
        iata_code: airline.code,
        name: airline.name
      },
      slices: searchParams.slices.map(slice => {
        const duration = Math.floor(Math.random() * 300) + 120;
        const departDate = new Date(slice.departure_date);
        departDate.setHours(Math.floor(Math.random() * 12) + 7);
        const arriveDate = new Date(departDate);
        arriveDate.setMinutes(arriveDate.getMinutes() + duration);
        
        return {
          fare_brand_name: "Economy Basic",
          id: `mock_slice_${Math.random().toString(36).substring(2, 9)}`,
          origin: {
            iata_code: slice.origin.toUpperCase(),
            name: `${slice.origin.toUpperCase()} Airport`,
            city_name: slice.origin.toUpperCase(),
            city: {
              name: slice.origin.toUpperCase(),
              iata_code: slice.origin.toUpperCase()
            }
          },
          destination: {
            iata_code: slice.destination.toUpperCase(),
            name: `${slice.destination.toUpperCase()} Airport`,
            city_name: slice.destination.toUpperCase(),
            city: {
              name: slice.destination.toUpperCase(),
              iata_code: slice.destination.toUpperCase()
            }
          },
          duration: duration,
          departing_at: departDate.toISOString(),
          arriving_at: arriveDate.toISOString(),
          segments: [{
            id: `mock_segment_${Math.random().toString(36).substring(2, 9)}`,
            origin: {
              iata_code: slice.origin.toUpperCase()
            },
            destination: {
              iata_code: slice.destination.toUpperCase()
            },
            departing_at: departDate.toISOString(),
            arriving_at: arriveDate.toISOString(),
            duration: duration,
            aircraft: {
              name: "Boeing 787"
            },
            operating_carrier: {
              name: airline.name,
              iata_code: airline.code
            },
            marketing_carrier: {
              name: airline.name,
              iata_code: airline.code
            }
          }]
        };
      })
    });
  }
  
  // Format matching Duffel API response
  return {
    data: flights,
    meta: {
      request_id: `mock_req_${Math.random().toString(36).substring(2, 9)}`
    }
  };
}

// Get offers from an offer request
export const getOffers = async (offerRequestId) => {
  try {
    const response = await apiClient.get(`/air/offer-requests/${offerRequestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

// Get offer details
export async function getOfferDetails(offerId) {
  try {
    const response = await fetch(`${DUFFEL_API_URL}/offers/${offerId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Duffel API Error: ${errorData.meta?.status || response.status}`);
    }

    const offerData = await response.json();
    return offerData.data;
  } catch (error) {
    console.error('Duffel API error:', error);
    throw error;
  }
}

// Create an order (booking)
export async function createOrder(offerId, passengers) {
  try {
    const orderParams = {
      selected_offers: [offerId],
      passengers: passengers.map(passenger => ({
        type: passenger.type,
        title: passenger.title,
        gender: passenger.gender,
        given_name: passenger.firstName,
        family_name: passenger.lastName,
        born_on: passenger.dateOfBirth,
        email: passenger.email,
        phone_number: passenger.phone
      })),
      payments: [
        {
          type: "balance",
          currency: "USD",
          amount: "0"
        }
      ]
    };

    const response = await fetch(`${DUFFEL_API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: orderParams })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Duffel API Error: ${errorData.meta?.status || response.status}`);
    }

    const orderData = await response.json();
    return orderData.data;
  } catch (error) {
    console.error('Duffel API error:', error);
    throw error;
  }
}

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/air/orders', {
      data: {
        selected_offers: [bookingData.offerId],
        passengers: bookingData.passengers,
        payments: bookingData.payments || [
          {
            type: "balance",
            amount: bookingData.amount,
            currency: bookingData.currency
          }
        ]
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw error;
  }
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await apiClient.get(`/air/orders/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Search airports with Duffel API
 */
export const searchAirports = async (query) => {
  try {
    const response = await apiClient.get(`/airports/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    return { data: [] }; // Return empty array on error to prevent UI crashes
  }
};

// Book a selected flight via proxy server
export const bookFlight = async (offerId, passengers) => {
  try {
    const bookingData = {
      data: {
        type: "instant",
        selected_offers: [offerId],
        passengers: passengers
      }
    };
    
    const response = await apiClient.post('/bookings', bookingData);
    return response;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
};

// Export a default API client if needed
export default {
  searchFlights,
  getMockFlights,
  getOfferDetails,
  createOrder
};