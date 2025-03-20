require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const app = express();

// Log environment variables (for debugging)
console.log('Loading environment variables...');
console.log('PORT:', process.env.PORT);
console.log('API Key defined:', process.env.DUFFEL_API_KEY ? 'Yes' : 'No');

// Make sure PORT is set with a fallback
const PORT = process.env.PORT || 3001; // Changed fallback to 3001

// Enable CORS for your frontend
app.use(cors());
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

// Proxy endpoint for flight search
app.post('/api/flights/search', async (req, res) => {
  try {
    console.log('Received flight search request:', JSON.stringify(req.body, null, 2));
    
    // Validate request format
    if (!req.body.slices || !req.body.passengers || !req.body.cabin_class) {
      return res.status(400).json({ 
        error: 'Invalid request format',
        message: 'Missing required fields: slices, passengers, or cabin_class'
      });
    }
    
    // Check cache for existing results
    const cacheKey = JSON.stringify(req.body);
    const cachedResult = searchCache.get(cacheKey);

    if (cachedResult) {
      console.log('Returning cached flight search results');
      return res.json(cachedResult);
    }
    
    // Step 1: Create offer request
    const offerRequestResponse = await duffelClient.post('/air/offer_requests', req.body);
    const offerRequestId = offerRequestResponse.data.data.id;
    console.log('Offer request created with ID:', offerRequestId);
    
    // Step 2: Poll until the offer request is complete
    let offerRequest;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    
    do {
      if (attempts > 0) {
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const response = await duffelClient.get(`/air/offer_requests/${offerRequestId}`);
      offerRequest = response.data.data;
      console.log(`Polling offer request (${attempts + 1}/${MAX_ATTEMPTS}), status: ${offerRequest.status}`);
      
      attempts++;
    } while (offerRequest.status !== 'complete' && attempts < MAX_ATTEMPTS);
    
    if (offerRequest.status !== 'complete') {
      return res.status(504).json({
        error: 'Offer request timeout',
        message: 'The flight search is taking longer than expected. Please try again.'
      });
    }
    
    // Step 3: Get offers once the request is complete
    const offersResponse = await duffelClient.get(`/air/offers?offer_request_id=${offerRequestId}`);
    console.log(`Found ${offersResponse.data.data.length} offers`);
    
    // Cache the search results
    searchCache.set(cacheKey, offersResponse.data);
    
    // Return the offers to the frontend
    res.json(offersResponse.data);
  } catch (error) {
    console.error('Error in flight search:', error.message);
    
    if (error.response) {
      console.error('Duffel API error details:', 
        error.response.status, 
        JSON.stringify(error.response.data, null, 2)
      );
      res.status(error.response.status).json({
        error: 'Error from Duffel API',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Server error',
        message: error.message 
      });
    }
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
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Test endpoint to verify server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV });
});

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