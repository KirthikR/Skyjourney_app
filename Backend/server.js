require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const chatbotRoutes = require('./routes/chatbotRoutes');
const app = express();

// Log environment variables (for debugging)
console.log('Loading environment variables...');
console.log('PORT:', process.env.PORT);
console.log('API Key defined:', process.env.DUFFEL_API_KEY ? 'Yes' : 'No');

// Make sure PORT is set with a fallback
const PORT = process.env.PORT || 3002; // Changed fallback to 3002

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's origin
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use("/api/", limiter);

// Create Duffel API client with proper headers
const duffelClient = axios.create({
  baseURL: 'https://api.duffel.com',
  headers: {
    'Authorization': `Bearer ${process.env.DUFFEL_API_KEY}`,
    'Content-Type': 'application/json',
    'Duffel-Version': 'v1',
    'Accept': 'application/json'
  }
});

// Add this to your server.js for better debugging
const requestLogger = (req, res, next) => {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  req.requestId = requestId;
  
  console.log(`[${requestId}] ${req.method} ${req.url} started`);
  
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${requestId}] ${req.method} ${req.url} completed in ${duration}ms with status ${res.statusCode}`);
  });
  
  next();
};

app.use(requestLogger);

// Add this helper function to your server.js
function formatDuffelError(error) {
  if (!error.response || !error.response.data) {
    return { message: error.message || 'Unknown error' };
  }
  
  const duffelError = error.response.data;
  
  // Handle different Duffel error formats
  if (duffelError.errors && duffelError.errors.length > 0) {
    return {
      code: duffelError.errors[0].code,
      message: duffelError.errors[0].message,
      title: duffelError.errors[0].title
    };
  }
  
  return duffelError;
}

// Add basic caching for frequent searches
const searchCache = new NodeCache({ stdTTL: 300 }); // 5 minute cache

// Simplified flight search endpoint
app.post('/api/flights/search', async (req, res) => {
  try {
    console.log('Received flight search request:', JSON.stringify(req.body, null, 2));
    
    // Ensure correct format for Duffel API - handle both formats
    let duffelRequest;
    
    // If data is already properly nested
    if (req.body.data) {
      duffelRequest = req.body;
    } 
    // If data is not nested under 'data' key
    else {
      duffelRequest = {
        data: {
          slices: req.body.slices || [],
          passengers: req.body.passengers || [],
          cabin_class: req.body.cabin_class || 'economy'
        }
      };
    }
    
    console.log('Formatted Duffel request:', JSON.stringify(duffelRequest, null, 2));
    
    // Create the offer request
    const offerResponse = await duffelClient.post('/air/offer_requests', duffelRequest);
    const offerId = offerResponse.data.data.id;
    console.log('Created offer request ID:', offerId);
    
    // Get offers for this request
    const offersResponse = await duffelClient.get(`/air/offers?offer_request_id=${offerId}&limit=20`);
    
    res.json({
      success: true,
      data: offersResponse.data.data
    });
  } catch (error) {
    console.error('Error searching for flights:', error.response?.data);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Update your offer_requests endpoint

app.post('/api/duffel/air/offer_requests', async (req, res) => {
  try {
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));
    
    // Make sure request matches Duffel API format exactly
    const duffelRequest = {
      data: {
        slices: req.body.data.slices.map(slice => ({
          origin: slice.origin,
          destination: slice.destination,
          departure_date: slice.departure_date
        })),
        passengers: req.body.data.passengers,
        cabin_class: req.body.data.cabin_class
      }
    };
    
    console.log('Formatted Duffel request:', JSON.stringify(duffelRequest, null, 2));
    
    const response = await duffelClient.post('/air/offer_requests', duffelRequest);
    res.json(response.data);
  } catch (error) {
    console.error('Duffel API error details:', error.response?.data);
    
    // Return more detailed error information
    res.status(error.response?.status || 500).json({
      status: error.response?.status,
      message: error.response?.data?.meta?.message || error.message,
      errors: error.response?.data?.meta?.errors || [],
      details: error.response?.data || {}
    });
  }
});

// Proxy endpoint for getting offers
app.get('/api/duffel/air/offers', async (req, res) => {
  try {
    console.log('Received request for offers with params:', req.query);
    const response = await duffelClient.get('/air/offers', { 
      params: req.query 
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error making Duffel API request:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: error.message }
    });
  }
});

// Airport search endpoint
app.get('/api/airports', async (req, res) => {
  try {
    const query = req.query.query;
    console.log('Airport search for:', query);
    
    const response = await duffelClient.get(`/air/airports?query=${encodeURIComponent(query)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Airport search error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Flight booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    console.log('Booking request received');
    const response = await duffelClient.post('/air/orders', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Booking error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    duffelApiKey: process.env.DUFFEL_API_KEY ? 'Configured' : 'Missing'
  });
});

// Test endpoint to verify server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV });
});

// Add this endpoint to test your Duffel API key

app.get('/api/duffel/test', async (req, res) => {
  try {
    // Try a simple request to verify API key works
    const response = await duffelClient.get('/air/airports?iata_code=LHR');
    res.json({
      status: 'success',
      message: 'Duffel API connection successful',
      data: response.data
    });
  } catch (error) {
    console.error('Duffel API test failed:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Duffel API test failed',
      error: error.response?.data || error.message
    });
  }
});

// Add this test endpoint with sample data

app.get('/api/duffel/sample', async (req, res) => {
  try {
    // Use a sample request that should work with Duffel
    const sampleRequest = {
      data: {
        slices: [
          {
            origin: "LHR",
            destination: "JFK",
            departure_date: "2025-05-01"
          }
        ],
        passengers: [
          {
            type: "adult"
          }
        ],
        cabin_class: "economy"
      }
    };
    
    console.log('Sending sample request to Duffel:', JSON.stringify(sampleRequest, null, 2));
    
    const response = await duffelClient.post('/air/offer_requests', sampleRequest);
    res.json({
      status: 'success',
      message: 'Sample request successful',
      data: response.data
    });
  } catch (error) {
    console.error('Sample request failed:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Sample request failed',
      error: error.response?.data || error.message
    });
  }
});

app.use('/api', chatbotRoutes);

// Start the server with better error handling
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1} instead`);
    });
  } else {
    console.error('Server error:', err);
  }
});