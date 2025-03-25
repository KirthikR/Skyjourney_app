import axios from 'axios';

// IMPORTANT: Set this to false to use the real Duffel API
const USE_MOCK_DATA = false;

// Search flights using the Duffel API
export const searchFlights = async (searchParams) => {
  try {
    console.log('Searching flights with params:', searchParams);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data instead of real API call');
      return getMockFlights(searchParams);
    }
    
    // Format passengers for Duffel API
    const passengers = [];
    
    // Add adult passengers
    for (let i = 0; i < (searchParams.passengers?.adults || 1); i++) {
      passengers.push({ type: 'adult' });
    }
    
    // Add child passengers if any
    if (searchParams.passengers?.children) {
      for (let i = 0; i < searchParams.passengers.children; i++) {
        passengers.push({ type: 'child' });
      }
    }
    
    // Add infant passengers if any
    if (searchParams.passengers?.infants) {
      for (let i = 0; i < searchParams.passengers.infants; i++) {
        passengers.push({ type: 'infant_in_seat' });
      }
    }
    
    // Create proper Duffel API request format
    const requestBody = {
      data: {
        slices: searchParams.slices.map(slice => ({
          origin: slice.origin,
          destination: slice.destination,
          departure_date: slice.departure_date
        })),
        passengers: passengers,
        cabin_class: searchParams.cabinClass || 'economy'
      }
    };
    
    console.log('Duffel API request payload:', requestBody);
    
    // Use the main simplified API endpoint
    const response = await axios.post('http://localhost:3002/api/flights/search', {
      slices: requestBody.data.slices,
      passengers: requestBody.data.passengers,
      cabin_class: requestBody.data.cabin_class
    });
    
    console.log('Duffel API response:', response.data);
    
    return { data: response.data.data };
  } catch (error) {
    console.error('Duffel API error:', error);
    
    if (error.response?.status === 422) {
      // Get validation error details for better debugging
      console.error('Validation error details:', error.response.data);
      
      // If there's a validation error, you can check the specific fields
      const errorMsg = error.response.data.details?.meta?.errors
        ? error.response.data.details.meta.errors.map(e => e.message).join(', ')
        : 'Invalid search parameters';
        
      throw new Error(`Validation error: ${errorMsg}`);
    }
    
    throw new Error(error.message || 'Failed to fetch flights');
  }
};

// Generate mock flight data for testing (keep this for fallback)
const getMockFlights = (params) => {
  console.log('Generating mock flights for', params);
  
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: generateMockFlights(params)
      });
    }, 1500);
  });
};

// Generate realistic mock flight data
const generateMockFlights = (params) => {
  const mockFlights = [];
  const airlines = [
    { name: 'SkyJet Airways', code: 'SJ', logo: 'https://via.placeholder.com/80x40/0d6efd/FFFFFF?text=SJ' },
    { name: 'Global Express', code: 'GE', logo: 'https://via.placeholder.com/80x40/dc3545/FFFFFF?text=GE' },
    { name: 'Coastal Air', code: 'CA', logo: 'https://via.placeholder.com/80x40/198754/FFFFFF?text=CA' },
    { name: 'Mountain Flights', code: 'MF', logo: 'https://via.placeholder.com/80x40/fd7e14/FFFFFF?text=MF' },
    { name: 'Eagle Airlines', code: 'EA', logo: 'https://via.placeholder.com/80x40/6610f2/FFFFFF?text=EA' }
  ];
  
  // Create 5-10 mock flights
  const flightCount = 5 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[i % airlines.length];
    const basePrice = 200 + Math.floor(Math.random() * 400);
    const connections = Math.random() > 0.7 ? 1 : 0; // 30% chance of having a connection
    
    // Generate random departure time (between 6am and 8pm)
    const departureHour = 6 + Math.floor(Math.random() * 14);
    const departureMinute = Math.floor(Math.random() * 60);
    
    // Random flight duration (2-5 hours)
    const durationMinutes = 120 + Math.floor(Math.random() * 180);
    
    // Calculate arrival time
    const totalMinutes = departureHour * 60 + departureMinute + durationMinutes;
    const arrivalHour = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinute = totalMinutes % 60;
    
    // Create flight object
    const flight = {
      id: `mock-${i}-${Date.now()}`,
      owner: {
        name: airline.name,
        iata_code: airline.code,
        logo_url: airline.logo
      },
      total_amount: (basePrice + (i * 15)).toFixed(2),
      total_currency: 'USD',
      slices: [
        {
          origin: { iata_code: params.slices[0].origin },
          destination: { iata_code: params.slices[0].destination },
          duration: durationMinutes,
          segments: []
        }
      ]
    };
    
    // Add segments (flights + connections)
    if (connections === 0) {
      // Direct flight
      flight.slices[0].segments.push({
        operating_carrier: {
          name: airline.name,
          iata_code: airline.code
        },
        departing_at: `${params.slices[0].departure_date}T${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}:00`,
        arriving_at: `${params.slices[0].departure_date}T${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}:00`
      });
    } else {
      // Flight with connection
      // First segment (departure to connection)
      const connectionDuration = Math.floor(durationMinutes * 0.6);
      const connectionMinutes = departureHour * 60 + departureMinute + connectionDuration;
      const connectionHour = Math.floor(connectionMinutes / 60) % 24;
      const connectionMinute = connectionMinutes % 60;
      
      flight.slices[0].segments.push({
        operating_carrier: {
          name: airline.name,
          iata_code: airline.code
        },
        departing_at: `${params.slices[0].departure_date}T${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}:00`,
        arriving_at: `${params.slices[0].departure_date}T${connectionHour.toString().padStart(2, '0')}:${connectionMinute.toString().padStart(2, '0')}:00`
      });
      
      // Add connection time (1-2 hours)
      const layoverDuration = 60 + Math.floor(Math.random() * 60);
      const departureAfterConnection = connectionMinutes + layoverDuration;
      const connectionDepartureHour = Math.floor(departureAfterConnection / 60) % 24;
      const connectionDepartureMinute = departureAfterConnection % 60;
      
      // Second segment (connection to destination)
      const remainingDuration = durationMinutes - connectionDuration;
      const finalArrivalMinutes = departureAfterConnection + remainingDuration;
      const finalArrivalHour = Math.floor(finalArrivalMinutes / 60) % 24;
      const finalArrivalMinute = finalArrivalMinutes % 60;
      
      flight.slices[0].segments.push({
        operating_carrier: {
          name: airline.name,
          iata_code: airline.code
        },
        departing_at: `${params.slices[0].departure_date}T${connectionDepartureHour.toString().padStart(2, '0')}:${connectionDepartureMinute.toString().padStart(2, '0')}:00`,
        arriving_at: `${params.slices[0].departure_date}T${finalArrivalHour.toString().padStart(2, '0')}:${finalArrivalMinute.toString().padStart(2, '0')}:00`
      });
    }
    
    // Add return flight if roundtrip
    if (params.slices.length > 1) {
      // Return flight departure (between 6am and 8pm)
      const returnDepartureHour = 6 + Math.floor(Math.random() * 14);
      const returnDepartureMinute = Math.floor(Math.random() * 60);
      
      // Return flight duration (similar to outbound)
      const returnDurationMinutes = durationMinutes - 30 + Math.floor(Math.random() * 60);
      
      // Calculate return arrival
      const returnTotalMinutes = returnDepartureHour * 60 + returnDepartureMinute + returnDurationMinutes;
      const returnArrivalHour = Math.floor(returnTotalMinutes / 60) % 24;
      const returnArrivalMinute = returnTotalMinutes % 60;
      
      const returnSlice = {
        origin: { iata_code: params.slices[1].origin },
        destination: { iata_code: params.slices[1].destination },
        duration: returnDurationMinutes,
        segments: []
      };
      
      // Add segments for return flight (same connection pattern as outbound)
      if (connections === 0) {
        // Direct return flight
        returnSlice.segments.push({
          operating_carrier: {
            name: airline.name,
            iata_code: airline.code
          },
          departing_at: `${params.slices[1].departure_date}T${returnDepartureHour.toString().padStart(2, '0')}:${returnDepartureMinute.toString().padStart(2, '0')}:00`,
          arriving_at: `${params.slices[1].departure_date}T${returnArrivalHour.toString().padStart(2, '0')}:${returnArrivalMinute.toString().padStart(2, '0')}:00`
        });
      } else {
        // Return flight with connection
        const returnConnectionDuration = Math.floor(returnDurationMinutes * 0.6);
        const returnConnectionMinutes = returnDepartureHour * 60 + returnDepartureMinute + returnConnectionDuration;
        const returnConnectionHour = Math.floor(returnConnectionMinutes / 60) % 24;
        const returnConnectionMinute = returnConnectionMinutes % 60;
        
        returnSlice.segments.push({
          operating_carrier: {
            name: airline.name,
            iata_code: airline.code
          },
          departing_at: `${params.slices[1].departure_date}T${returnDepartureHour.toString().padStart(2, '0')}:${returnDepartureMinute.toString().padStart(2, '0')}:00`,
          arriving_at: `${params.slices[1].departure_date}T${returnConnectionHour.toString().padStart(2, '0')}:${returnConnectionMinute.toString().padStart(2, '0')}:00`
        });
        
        // Add connection time (1-2 hours)
        const returnLayoverDuration = 60 + Math.floor(Math.random() * 60);
        const returnDepartureAfterConnection = returnConnectionMinutes + returnLayoverDuration;
        const returnConnectionDepartureHour = Math.floor(returnDepartureAfterConnection / 60) % 24;
        const returnConnectionDepartureMinute = returnDepartureAfterConnection % 60;
        
        // Second segment (connection to destination)
        const returnRemainingDuration = returnDurationMinutes - returnConnectionDuration;
        const returnFinalArrivalMinutes = returnDepartureAfterConnection + returnRemainingDuration;
        const returnFinalArrivalHour = Math.floor(returnFinalArrivalMinutes / 60) % 24;
        const returnFinalArrivalMinute = returnFinalArrivalMinutes % 60;
        
        returnSlice.segments.push({
          operating_carrier: {
            name: airline.name,
            iata_code: airline.code
          },
          departing_at: `${params.slices[1].departure_date}T${returnConnectionDepartureHour.toString().padStart(2, '0')}:${returnConnectionDepartureMinute.toString().padStart(2, '0')}:00`,
          arriving_at: `${params.slices[1].departure_date}T${returnFinalArrivalHour.toString().padStart(2, '0')}:${returnFinalArrivalMinute.toString().padStart(2, '0')}:00`
        });
      }
      
      // Add return slice to flight
      flight.slices.push(returnSlice);
    }
    
    mockFlights.push(flight);
  }
  
  return mockFlights;
};

export default {
  searchFlights
};