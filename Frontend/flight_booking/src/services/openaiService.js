import OpenAI from 'openai';

// Cache for responses to reduce API calls
const RESPONSE_CACHE = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Rate limit detection
let IS_RATE_LIMITED = false;
let RATE_LIMIT_UNTIL = 0;
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour pause after hitting rate limits

// Check localStorage for existing rate limit when the app loads
try {
  const storedLimit = localStorage.getItem('OPENAI_RATE_LIMIT_UNTIL');
  if (storedLimit) {
    const limitUntil = parseInt(storedLimit, 10);
    if (!isNaN(limitUntil) && limitUntil > Date.now()) {
      IS_RATE_LIMITED = true;
      RATE_LIMIT_UNTIL = limitUntil;
      console.log('Rate limit detected from storage, using smart responses until', new Date(limitUntil));
    } else {
      localStorage.removeItem('OPENAI_RATE_LIMIT_UNTIL');
    }
  }
} catch (e) {
  // Ignore localStorage errors
}

// Initialize OpenAI client
let openai = null;
try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
    console.log('OpenAI client initialized');
  } else {
    console.warn('Missing OpenAI API key');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Knowledge base for smart responses when API is rate limited
const SMART_RESPONSES = {
  flight_search: [
    "To search for flights, enter your departure and destination cities along with your travel dates. I'll help you find the best options.",
    "Looking for flights? Use our search feature at the top of the page to explore available routes and prices."
  ],
  booking: [
    "Booking is simple! After selecting your flights, you'll enter passenger details, choose any add-ons, and proceed to payment.",
    "The booking process includes selecting your flights, adding passenger information, choosing seats if desired, and completing payment."
  ],
  payment: [
    "We accept all major credit cards, PayPal, Apple Pay and Google Pay. All transactions are secured with industry-standard encryption.",
    "For payment, you can use credit/debit cards or digital wallets. We never store your full card details."
  ],
  baggage: [
    "Standard tickets include one carry-on bag (up to 10kg) and personal item. Checked baggage can be added during booking.",
    "Baggage allowance varies by fare type. You can purchase additional checked bags during or after booking."
  ],
  customer_service: [
    "Our customer service team is available 24/7. You can reach us through the Contact Us page or call our support number.",
    "Need immediate assistance? Our help center has answers to common questions, or you can contact our support team."
  ],
  general: [
    "I'm your SkyJourney assistant, here to help with flight information and booking questions. What else would you like to know?",
    "How can I assist with your travel plans today? I can help with flight searches, booking information, and travel tips."
  ]
};

// Categorize user message for smart responses
const categorizeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (/flight|destination|depart|arrive|route|airport|terminal/i.test(lowerMessage)) {
    return 'flight_search';
  }
  
  if (/book|reservation|confirm|reserve|ticket|itinerary/i.test(lowerMessage)) {
    return 'booking';
  }
  
  if (/pay|cost|price|fee|refund|card|bank|wallet/i.test(lowerMessage)) {
    return 'payment';
  }
  
  if (/bag|luggage|suitcase|carry|weight|check/i.test(lowerMessage)) {
    return 'baggage';
  }
  
  if (/help|service|support|assist|contact|phone|email|chat/i.test(lowerMessage)) {
    return 'customer_service';
  }
  
  return 'general';
};

// Get a smart response when API is unavailable
const getSmartResponse = (message) => {
  const category = categorizeMessage(message);
  const responses = SMART_RESPONSES[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

/**
 * Get response from OpenAI API with fallbacks for rate limits
 */
export const getAIResponse = async (message, history = []) => {
  console.log('Getting AI response for:', message);
  
  // CRITICAL: Check for rate limiting first to avoid unnecessary API calls
  const now = Date.now();
  if (IS_RATE_LIMITED && now < RATE_LIMIT_UNTIL) {
    console.log('Using smart response due to rate limiting');
    return getSmartResponse(message);
  }
  
  // Check cache for identical questions
  const cacheKey = message.toLowerCase().trim();
  if (RESPONSE_CACHE.has(cacheKey)) {
    const { response, timestamp } = RESPONSE_CACHE.get(cacheKey);
    if (now - timestamp < CACHE_TTL) {
      console.log('Using cached response');
      return response;
    }
    RESPONSE_CACHE.delete(cacheKey);
  }
  
  // Skip API calls if client isn't available
  if (!openai) {
    console.log('OpenAI client not available, using smart response');
    return getSmartResponse(message);
  }
  
  // Try OpenAI API
  try {
    console.log('Calling OpenAI API...');
    
    const systemMessage = {
      role: 'system',
      content: 'You are SkyBot, a helpful flight booking assistant for SkyJourney. Provide concise, friendly responses about flights, bookings, and travel. Keep responses under 100 words.'
    };
    
    // Keep history minimal to save tokens
    const recentHistory = history
      .slice(-3) // Only use last 3 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...recentHistory, { role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 120, // Shorter responses to save tokens
      timeout: 5000 // Short timeout
    });
    
    console.log('AI response received');
    const aiResponse = response.choices[0].message.content;
    
    // Cache successful response
    RESPONSE_CACHE.set(cacheKey, {
      response: aiResponse,
      timestamp: now
    });
    
    // Reset rate limit flag on success
    if (IS_RATE_LIMITED) {
      IS_RATE_LIMITED = false;
      localStorage.removeItem('OPENAI_RATE_LIMIT_UNTIL');
    }
    
    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle rate limits specifically
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      console.warn('Rate limit reached, activating smart response system');
      
      // Set the rate limit flag to avoid further API calls
      IS_RATE_LIMITED = true;
      RATE_LIMIT_UNTIL = now + RATE_LIMIT_DURATION;
      
      // Store in localStorage to persist between refreshes
      try {
        localStorage.setItem('OPENAI_RATE_LIMIT_UNTIL', RATE_LIMIT_UNTIL.toString());
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    
    // Use smart response system
    return getSmartResponse(message);
  }
};