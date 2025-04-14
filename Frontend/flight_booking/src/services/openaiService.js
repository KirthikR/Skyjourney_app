import OpenAI from 'openai';

// Global rate limit detection
let API_RATE_LIMITED = false;
let RATE_LIMIT_UNTIL = 0;
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 hour pause after hitting rate limits

// Smart response cache
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hour cache

// Comprehensive fallback responses by category
const fallbackResponses = {
  greeting: [
    "Hello! I'm SkyBot, your flight booking assistant. How can I help you today?",
    "Welcome to SkyJourney! I'm here to help with your travel needs.",
    "Hi there! I'm your personal travel assistant. What can I do for you?"
  ],
  
  flights: [
    "SkyJourney offers flights to over 300 global destinations. Our most popular routes include London-New York, Singapore-Tokyo, and Los Angeles-Paris.",
    "Looking for flights? You can use the search box at the top of the page to find available options for your journey.",
    "Our flight prices include taxes, one carry-on bag, and a personal item. Checked baggage can be added during booking."
  ],
  
  booking: [
    "Booking with SkyJourney is easy! Select your flight, enter passenger details, choose any extras, and complete payment.",
    "You can modify your booking up to 24 hours before departure through your account dashboard.",
    "We offer flexible booking options for an additional fee, allowing changes without penalty."
  ],
  
  payment: [
    "We accept all major credit cards, PayPal, Apple Pay, and Google Pay.",
    "Our prices are displayed in your local currency and include all taxes and basic fees.",
    "For group bookings of 10+ passengers, please contact our special services for potential discounts."
  ],
  
  baggage: [
    "Standard tickets include one carry-on (max 10kg) and one personal item. Checked baggage fees vary by route.",
    "Oversized or special items like sports equipment require additional handling. Please add these during booking.",
    "Lost baggage should be reported immediately at the airport and through our customer service."
  ],
  
  support: [
    "Our customer service team is available 24/7 at support@skyjourney.com or +1-800-SKY-JOURNEY.",
    "For immediate assistance with an upcoming flight, please use the 'Contact Us' section in your booking confirmation.",
    "You can manage most booking changes through your account without contacting support."
  ],
  
  destinations: [
    "Some of our most popular destinations include London, New York, Paris, Tokyo, and Sydney.",
    "Looking for vacation ideas? Consider our special packages to the Caribbean, Mediterranean, or Southeast Asia.",
    "We offer both direct and connecting flights to over 300 destinations worldwide."
  ],
  
  default: [
    "I'm here to help with your travel needs. Could you please provide more details about your question?",
    "I can assist with flight bookings, travel information, and general inquiries about our services.",
    "Feel free to ask about flights, destinations, booking procedures, or any other travel-related questions."
  ]
};

// Improved message categorization
const categorizeMessage = (message) => {
  const lowerCase = message.toLowerCase();
  
  // Check for greetings first
  if (/^(hi|hello|hey|greetings|howdy|good (morning|afternoon|evening))/i.test(lowerCase)) {
    return 'greeting';
  }
  
  // Keywords for each category
  const categories = {
    flights: ['flight', 'fly', 'travel to', 'destination', 'airport', 'departure', 'arrive', 'from and to'],
    booking: ['book', 'reserve', 'reservation', 'itinerary', 'confirm', 'cancel', 'change', 'modify'],
    payment: ['pay', 'cost', 'price', 'fee', 'refund', 'money', 'credit', 'card', 'billing'],
    baggage: ['baggage', 'luggage', 'suitcase', 'carry-on', 'check in', 'weight', 'allowance'],
    support: ['help', 'support', 'assistance', 'contact', 'service', 'agent', 'phone', 'email'],
    destinations: ['where', 'destination', 'city', 'country', 'location', 'popular', 'recommend', 'visit']
  };
  
  // Find the category with the most matching keywords
  let bestCategory = 'default';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter(keyword => lowerCase.includes(keyword)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
};

// Get a random, relevant response
const getFallbackResponse = (message) => {
  const category = categorizeMessage(message);
  const responses = fallbackResponses[category] || fallbackResponses.default;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Improved error-resilient OpenAI client
const createOpenAIClient = () => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      console.warn('OpenAI API Key is missing');
      return null;
    }
    
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    return null;
  }
};

const openai = createOpenAIClient();

/**
 * Gets a response, with multiple fallback levels for reliability
 */
export const getAIResponse = async (message, history = []) => {
  console.log('Getting AI response:', message);
  
  // CRITICAL: Check for rate limiting first to prevent unnecessary API calls
  const now = Date.now();
  if (API_RATE_LIMITED && now < RATE_LIMIT_UNTIL) {
    console.log('API is rate limited, using fallback response immediately');
    return getFallbackResponse(message);
  }
  
  // Check cache for identical questions
  const cacheKey = message.toLowerCase().trim();
  if (responseCache.has(cacheKey)) {
    const { response, timestamp } = responseCache.get(cacheKey);
    if (now - timestamp < CACHE_TTL) {
      console.log('Using cached response');
      return response;
    }
    responseCache.delete(cacheKey);
  }
  
  // Skip API calls if client isn't available
  if (!openai) {
    console.log('OpenAI client not available, using fallback');
    return getFallbackResponse(message);
  }
  
  // Try OpenAI API
  try {
    const systemMessage = {
      role: 'system',
      content: `You are SkyBot, SkyJourney's flight booking assistant. Be helpful, concise, and friendly.
      Provide flight information, booking help, and travel advice. If asked about specific flights,
      suggest using the search feature. Maximum response length should be 200 characters.`
    };

    // Use minimal context to save tokens
    const recentHistory = history
      .slice(-3)
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    // Make the API call with conservative settings
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...recentHistory, { role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 150, // Very short to minimize token usage
      timeout: 10000 // 10 second timeout
    });

    const aiResponse = response.choices[0].message.content;
    
    // Cache successful response
    responseCache.set(cacheKey, {
      response: aiResponse,
      timestamp: now
    });
    
    // Reset rate limit flag on success
    if (API_RATE_LIMITED) {
      API_RATE_LIMITED = false;
      console.log('Rate limit reset after successful API call');
    }
    
    return aiResponse;
  } catch (error) {
    console.error('Error getting AI response:', error);
    
    // Handle rate limits (429 errors)
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      console.warn('Rate limit reached, using fallback responses');
      
      // Set the global rate limit flag to prevent further calls
      API_RATE_LIMITED = true;
      RATE_LIMIT_UNTIL = now + RATE_LIMIT_DURATION;
      
      // Store this in localStorage to persist between page refreshes
      try {
        localStorage.setItem('API_RATE_LIMITED_UNTIL', RATE_LIMIT_UNTIL.toString());
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    
    // Use fallback response system
    return getFallbackResponse(message);
  }
};

// Check localStorage for existing rate limit on initialization
try {
  const storedRateLimit = localStorage.getItem('API_RATE_LIMITED_UNTIL');
  if (storedRateLimit) {
    const limitUntil = parseInt(storedRateLimit, 10);
    if (!isNaN(limitUntil) && limitUntil > Date.now()) {
      API_RATE_LIMITED = true;
      RATE_LIMIT_UNTIL = limitUntil;
      console.log('Loaded rate limit from storage, API calls disabled until', new Date(limitUntil));
    } else {
      localStorage.removeItem('API_RATE_LIMITED_UNTIL');
    }
  }
} catch (e) {
  // Ignore localStorage errors
}