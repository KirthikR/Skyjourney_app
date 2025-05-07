// Define API base URL directly
const API_BASE_URL = 'http://localhost:3002/api';
import { getAIResponse } from './openaiService';

// Keep track of conversation history
let conversationHistory = [];
const MAX_HISTORY_LENGTH = 10;

/**
 * Process user message and get response
 */
export const sendMessage = async (message, userContext = {}) => {
  try {
    console.log('Processing message:', message);
    
    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });
    
    // Get AI response with improved handling
    console.log('Getting AI response...');
    const response = await getAIResponse(message, conversationHistory);
    console.log('Response received:', response ? 'success' : 'empty');
    
    // Add assistant response to history
    conversationHistory.push({ role: 'assistant', content: response });
    
    // Trim history if it gets too long
    if (conversationHistory.length > MAX_HISTORY_LENGTH) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH);
    }
    
    return { message: response };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    
    // Still return something useful to the user
    let fallbackMsg = "I'm having trouble connecting right now. Please try again in a moment.";
    
    // Add this error response to history so the context is maintained
    conversationHistory.push({ role: 'assistant', content: fallbackMsg });
    
    return { message: fallbackMsg, isError: true };
  }
};

// Get suggested questions for the current page
export const getSuggestedQuestions = async (currentPage) => {
  try {
    // Only try the API if we haven't had recent errors
    const response = await fetch(`${API_BASE_URL}/chatbot/suggestions?page=${currentPage}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
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