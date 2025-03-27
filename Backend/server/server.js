const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const NodeCache = require('node-cache');
const flightCache = new NodeCache({ stdTTL: 300 }); // 5 minute cache
const chatbotRoutes = require('./routes/chatbotRoutes');

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Add this after your dotenv configuration
if (!process.env.DUFFEL_API_KEY && !process.env.DUFFEL_API_TOKEN) {
  console.error('ERROR: Duffel API key is missing in the .env file!');
  console.error('Please add DUFFEL_API_KEY or DUFFEL_API_TOKEN to your .env file');
  process.exit(1); // Stop the server if API key is missing
}

const DUFFEL_API_TOKEN = process.env.DUFFEL_API_KEY || process.env.DUFFEL_API_TOKEN;

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Add your frontend URLs
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Duffel API configuration
const DUFFEL_API_URL = 'https://api.duffel.com';
const DUFFEL_API_VERSION = 'v1';
;

const duffelAxios = axios.create({
  baseURL: DUFFEL_API_URL,
  headers: {
    'Authorization': `Bearer ${DUFFEL_API_TOKEN}`,
    'Duffel-Version': DUFFEL_API_VERSION,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Add this at the top of your server.js to better understand Duffel API errors
duffelAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Duffel API error response:');
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from Duffel API:', error.request);
    } else {
      console.error('Error setting up request to Duffel API:', error.message);
    }
    return Promise.reject(error);
  }
);

// Inside your server.js file

// Other middleware and configuration...

// Mount the chatbot routes
app.use('/api', chatbotRoutes);

// API routes
app.get('/api/airports/search', async (req, res) => {
  try {
    const query = req.query.query;
    console.log(`Searching airports for: ${query}`);
    console.log('Using headers:', duffelAxios.defaults.headers);
    
    const response = await duffelAxios.get(`/air/airports?query=${query}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching airports:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to search airports',
      details: error.response?.data || error.message 
    });
  }
});

// Update the flights search endpoint

app.post('/api/flights/search', async (req, res) => {
  try {
    console.log('Received flight search request:', req.body);
    
    // Forward the request to Duffel API
    const response = await duffelAxios.post('/air/offer_requests', req.body);
    
    // Get the offer request ID
    const offerRequestId = response.data.data.id;
    console.log('Created offer request ID:', offerRequestId);
    
    // Poll for offers (Duffel API is asynchronous)
    let offers = [];
    let attempts = 0;
    const maxAttempts = 15; // 15 attempts with a 2-second delay = 30 seconds max
    
    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        // Get the offers for this request
        const offersResponse = await duffelAxios.get(`/air/offers?offer_request_id=${offerRequestId}&limit=50`);
        
        // Check if we have offers
        if (offersResponse.data.data && offersResponse.data.data.length > 0) {
          offers = offersResponse.data.data;
          break;
        }
        
        // Wait 2 seconds before trying again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (pollError) {
        console.error('Error polling for offers:', pollError);
        // If there's an error during polling, wait and try again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    res.json({
      data: offers,
      meta: {
        request_id: offerRequestId
      }
    });
  } catch (error) {
    console.error('Error searching for flights:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.errors || error.message
    });
  }
});

// Offer details endpoint
app.get('/api/flights/offer/:id', async (req, res) => {
  try {
    const offerId = req.params.id;
    console.log(`Getting offer details for: ${offerId}`);
    const response = await duffelAxios.get(`/air/offers/${offerId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting offer:', error.response?.data || error.message);
    
    // In your catch block
    if (error.response) {
      console.error('DUFFEL ERROR RESPONSE:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    res.status(500).json({ error: 'Failed to get offer details' });
  }
});

// Mock booking endpoint for testing
app.post('/api/booking/create', async (req, res) => {
  try {
    const { offerId, passengers } = req.body;
    console.log(`Creating booking for offer: ${offerId}`);
    
    const bookingReference = 'BK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    res.json({
      success: true,
      data: {
        booking_reference: bookingReference,
        offer_id: offerId,
        passengers: passengers,
        status: 'confirmed'
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    
    // In your catch block
    if (error.response) {
      console.error('DUFFEL ERROR RESPONSE:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Booking API endpoint
app.post('/api/flights/book', async (req, res) => {
  try {
    console.log('Creating booking with data:', JSON.stringify(req.body, null, 2));
    
    // FIX: Nest request data under a 'data' key
    const duffelRequest = {
      data: { ...req.body }
    };
    
    // Create the booking with Duffel API
    const response = await duffelAxios.post('/air/orders', duffelRequest);
    
    console.log('Booking created successfully:', response.data.data.id);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    
    // In your catch block
    if (error.response) {
      console.error('DUFFEL ERROR RESPONSE:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    res.status(error.response?.status || 500).json({ 
      error: 'Failed to create booking',
      details: error.response?.data
    });
  }
});

// Add this near your other endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    duffelConfigured: !!DUFFEL_API_TOKEN
  });
});

// Add this after your other API endpoints but before app.listen()

// List offer requests endpoint
app.get('/api/flights/offer_requests', async (req, res) => {
  try {
    console.log('Getting offer requests list');
    
    // Extract pagination parameters from query string
    const { after, before, limit } = req.query;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (after) params.append('after', after);
    if (before) params.append('before', before);
    if (limit) params.append('limit', limit);
    
    // Make request to Duffel API with query parameters
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await duffelAxios.get(`/air/offer_requests${queryString}`);
    
    console.log(`Retrieved ${response.data.data.length} offer requests`);
    
    // Return the data with same structure as Duffel API
    res.json(response.data);
  } catch (error) {
    console.error('Error getting offer requests:', error.response?.data || error.message);
    
    // Detailed error logging
    if (error.response) {
      console.error('DUFFEL ERROR RESPONSE:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }

    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get offer requests',
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    // Handle port in use error
  } else {
    console.error('Server error:', err);
  }
});