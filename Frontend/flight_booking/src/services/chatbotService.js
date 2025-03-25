// Define API base URL directly
const API_BASE_URL = 'http://localhost:3002/api';

/**
 * Send user message to the chatbot API and get a response
 */
export const sendMessage = async (message, userContext = {}) => {
  try {
    console.log('Sending to chatbot:', message, userContext);
    
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: userContext
      }),
    });

    if (!response.ok) {
      console.error('Chatbot API error:', response.status, response.statusText);
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return {
      message: "I'm having trouble connecting right now. Please try again later.",
      isError: true
    };
  }
};

/**
 * Get suggested questions for the chatbot based on current page
 */
export const getSuggestedQuestions = async (currentPage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot/suggestions?page=${currentPage}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suggested questions:', error);
    // Return default suggestions if API fails
    return { 
      suggestions: [
        "How do I search for flights?",
        "What payment methods do you accept?",
        "How do I cancel my booking?"
      ] 
    };
  }
};

/**
 * Fallback suggestions if API fails
 */
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