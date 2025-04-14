// Define API base URL directly
const API_BASE_URL = 'http://localhost:3002/api';
import { getAIResponse } from './openaiService';

// Check if we're already rate limited from localStorage
let API_DISABLED = false;
try {
  const storedRateLimit = localStorage.getItem('API_RATE_LIMITED_UNTIL');
  if (storedRateLimit && parseInt(storedRateLimit, 10) > Date.now()) {
    API_DISABLED = true;
    console.log('API disabled due to previous rate limiting');
  }
} catch (e) {
  // Ignore localStorage errors
}

// Keep track of conversation history
let conversationHistory = [];
const MAX_HISTORY_LENGTH = 10;

// Track API health
let lastApiErrorTime = 0;
const API_ERROR_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown after errors
let consecutiveErrors = 0;

/**
 * Send user message to the chatbot and get a response
 */
export const sendMessage = async (message, userContext = {}) => {
  try {
    // Add user message to history immediately
    conversationHistory.push({ role: 'user', content: message });
    
    // If API is disabled or we've had multiple errors, use fallbacks immediately
    if (API_DISABLED || (consecutiveErrors > 2 && Date.now() - lastApiErrorTime < API_ERROR_COOLDOWN)) {
      console.log('Using fallback immediately due to API status');
      const fallbackResponse = await getAIResponse(message, conversationHistory);
      
      // Add to conversation history
      conversationHistory.push({ role: 'assistant', content: fallbackResponse });
      
      // Trim history if needed
      if (conversationHistory.length > MAX_HISTORY_LENGTH) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH);
      }
      
      return { message: fallbackResponse };
    }
    
    try {
      // Try to get a response
      const response = await getAIResponse(message, conversationHistory);
      
      // Reset error counter on success
      consecutiveErrors = 0;
      
      // Add assistant response to history  
      conversationHistory.push({ role: 'assistant', content: response });
      
      // Trim history if needed
      if (conversationHistory.length > MAX_HISTORY_LENGTH) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH);
      }
      
      return { message: response };
    } catch (error) {
      // Track API errors
      consecutiveErrors++;
      lastApiErrorTime = Date.now();
      
      // Check if this is a rate limit error and disable API if needed
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        API_DISABLED = true;
        try {
          localStorage.setItem('API_RATE_LIMITED_UNTIL', (Date.now() + 3600000).toString());
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      
      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    
    // Provide a friendly error message but still try to get a useful response
    const fallbackResponse = await getAIResponse(message, conversationHistory);
    conversationHistory.push({ role: 'assistant', content: fallbackResponse });
    
    return { message: fallbackResponse };
  }
};

// Get suggested questions for the current page
export const getSuggestedQuestions = async (currentPage) => {
  try {
    // Only try the API if we haven't had recent errors
    if (consecutiveErrors < 3 || Date.now() - lastApiErrorTime > API_ERROR_COOLDOWN) {
      const response = await fetch(`${API_BASE_URL}/chatbot/suggestions?page=${currentPage}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } else {
      // Fall back to default suggestions if we've had API issues
      return { suggestions: getDefaultSuggestions(currentPage) };
    }
  } catch (error) {
    console.error('Error fetching suggested questions:', error);
    // Return default suggestions if API fails
    return { suggestions: getDefaultSuggestions(currentPage) };
  }
};

// Get default suggestions based on the current page
const getDefaultSuggestions = (currentPage) => {
  const commonQuestions = [
    "How do I search for flights?",
    "What is your cancellation policy?",
    "How do I add extra baggage?"
  ];
  
  const pageSpecificQuestions = {
    'home': [
      "What destinations are popular right now?",
      "How do I get the best deals?",
      "Do you offer package holidays?"
    ],
    'flights': [
      "What's the difference between Economy and Premium Economy?",
      "Do prices include taxes and fees?",
      "Can I filter for direct flights only?"
    ],
    'booking': [
      "Can I reserve seats now?",
      "What payment methods do you accept?",
      "How do I add special meal requests?"
    ],
    'payment': [
      "Is my payment information secure?",
      "Do you charge a booking fee?",
      "Can I pay in installments?"
    ],
    'confirmation': [
      "How do I get my boarding pass?",
      "Can I change my flight after booking?",
      "How do I check in online?"
    ]
  };
  
  return [
    ...(pageSpecificQuestions[currentPage] || []),
    ...commonQuestions
  ];
};