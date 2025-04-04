import axios from 'axios';

export const searchFlights = async (searchParams) => {
  try {
    // If using a direct Duffel API call (not recommended for production)
    const DUFFEL_API_KEY = import.meta.env.VITE_REACT_APP_DUFFEL_API_KEY;
    
    // For demo/testing, use mock data to avoid API rate limits
    if (process.env.NODE_ENV === 'development') {
      // Wait to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock data
      return generateMockFlights(searchParams);
    }
    
    // For production, make the actual API call
    const response = await axios.post(
      'https://api.duffel.com/air/offer_requests', 
      {
        data: {
          slices: searchParams.tripType === 'roundTrip' ? [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departDate
            },
            {
              origin: searchParams.destination,
              destination: searchParams.origin,
              departure_date: searchParams.returnDate
            }
          ] : [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departDate
            }
          ],
          passengers: [
            { type: 'adult', count: searchParams.passengers.adults || 1 },
            { type: 'child', count: searchParams.passengers.children || 0 },
            { type: 'infant_without_seat', count: searchParams.passengers.infants || 0 }
          ],
          cabin_class: searchParams.cabinClass.toLowerCase()
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${DUFFEL_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Duffel-Version': 'v1'
        }
      }
    );
    
    // Process Duffel response to match your app's expected format
    return processDuffelResponse(response.data);
  } catch (error) {
    console.error('Flight search API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to search flights');
  }
};

// Helper to generate mock flights when in development
function generateMockFlights(params) {
  const airlines = ['Air France', 'British Airways', 'Delta', 'Emirates', 'Lufthansa'];
  const flightNumbers = ['AF123', 'BA456', 'DL789', 'EK101', 'LH234'];
  const prices = [299, 349, 389, 429, 479, 529];
  
  // Generate 5-10 random flights
  const count = 5 + Math.floor(Math.random() * 6);
  const flights = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate random departure and arrival times based on the parameters
    const depDate = new Date(params.departDate);
    depDate.setHours(6 + Math.floor(Math.random() * 14)); // 6AM to 8PM
    depDate.setMinutes(Math.random() > 0.5 ? 0 : 30);
    
    const durationHours = 1 + Math.floor(Math.random() * 5);
    const durationMinutes = Math.random() > 0.5 ? 0 : 30;
    const duration = durationHours * 60 + durationMinutes;
    
    const arrDate = new Date(depDate.getTime() + duration * 60000);
    
    const airlineIndex = Math.floor(Math.random() * airlines.length);
    const stops = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
    
    flights.push({
      id: `mock-flight-${i + 1}`,
      airline: airlines[airlineIndex],
      flightNumber: flightNumbers[airlineIndex],
      origin: params.origin,
      destination: params.destination,
      departureTime: depDate.toISOString(),
      arrivalTime: arrDate.toISOString(),
      duration: duration,
      stops: stops,
      price: prices[Math.floor(Math.random() * prices.length)],
      currency: 'USD',
      cabinClass: params.cabinClass,
      seatsAvailable: 5 + Math.floor(Math.random() * 20)
    });
  }
  
  return flights;
}

// Helper to process Duffel API response
function processDuffelResponse(response) {
  // You would need to transform the Duffel response to match your app's format
  // This is a simplified example
  if (!response.data || !response.data.offers) {
    return [];
  }
  
  return response.data.offers.map(offer => ({
    id: offer.id,
    airline: offer.owner.name,
    flightNumber: offer.slices[0].segments[0].operating_carrier_flight_number,
    origin: offer.slices[0].origin.iata_code,
    destination: offer.slices[0].destination.iata_code,
    departureTime: offer.slices[0].segments[0].departing_at,
    arrivalTime: offer.slices[0].segments[0].arriving_at,
    duration: offer.slices[0].duration,
    stops: offer.slices[0].segments.length - 1,
    price: offer.total_amount,
    currency: offer.total_currency,
    cabinClass: offer.passenger_identity_documents_required ? 'Business' : 'Economy',
    seatsAvailable: 10 // Duffel doesn't always provide this
  }));
}

export default { searchFlights };