/**
 * Process incoming chat message and generate a response
 */
exports.processMessage = (req, res) => {
  try {
    const { message, context } = req.body;
    
    console.log('Received message:', message);
    console.log('With context:', context);
    
    // Check for booking process questions
    for (const [key, info] of Object.entries(bookingProcessKnowledge)) {
      if (message.toLowerCase().includes(key)) {
        // Create a rich response with steps or options
        let richResponse = {
          message: info.message,
          suggestions: getRelatedSuggestions(key)
        };
        
        // Add rich content based on what's available
        if (info.steps) {
          richResponse.richContent = {
            type: 'steps',
            title: `${key.charAt(0).toUpperCase() + key.slice(1)} Steps`,
            items: info.steps.map((step, index) => ({
              number: index + 1,
              text: step
            }))
          };
        } else if (info.options) {
          richResponse.richContent = {
            type: 'options',
            title: 'Available Options',
            items: info.options
          };
        } else if (info.types) {
          richResponse.richContent = {
            type: 'table',
            title: 'Information',
            items: Object.entries(info.types).map(([type, description]) => ({
              key: type,
              value: description
            }))
          };
        }
        
        return res.json(richResponse);
      }
    }
    
    // Handle specific booking phase questions based on context
    const currentPage = context?.page || 'unknown';
    if (currentPage === 'flights' && message.toLowerCase().includes('select')) {
      return res.json({
        message: "To select a flight, simply click on the flight card or the 'Select' button. You'll then be taken to the passenger details page where you can enter traveler information.",
        links: [
          {
            text: "See Available Flights",
            url: "/flights",
            action: "navigate"
          }
        ]
      });
    }
    
    // Sample response for flight search question
    if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) {
      return res.json({
        message: "To search for flights, enter your origin, destination, dates, and number of passengers on our booking page.",
        links: [
          {
            text: "Go to Booking",
            url: "/booking",
            action: "navigate"  // This is important
          }
        ],
        suggestions: [
          "What payment methods do you accept?",
          "Do you have any deals right now?",
          "How do I cancel my booking?"
        ]
      });
    }
    
    if (message.toLowerCase().includes('cancel') || message.toLowerCase().includes('refund')) {
      return res.json({
        message: "You can cancel your booking up to 24 hours before departure. Refund policies vary by fare type. Would you like more details?",
        suggestions: [
          "What's your refund policy?",
          "How do I check my booking status?",
          "Can I change my flight date?"
        ]
      });
    }
    
    if (message.toLowerCase().includes('payment') || message.toLowerCase().includes('pay')) {
      return res.json({
        message: "We accept all major credit cards, PayPal, and Apple Pay. Payment is secure and encrypted.",
        suggestions: [
          "Is there a booking fee?",
          "Can I pay in installments?",
          "Do you store my payment details?"
        ]
      });
    }
    
    if (message.toLowerCase().includes('baggage') || message.toLowerCase().includes('luggage')) {
      return res.json({
        message: "Our standard economy tickets include 1 carry-on bag (7kg) and 1 checked bag (23kg). Premium and business classes include additional baggage allowances.",
        suggestions: [
          "How much does extra baggage cost?",
          "What are the baggage size limits?",
          "Can I add baggage after booking?"
        ]
      });
    }

    // Flight tracking response
    if (message.toLowerCase().includes('track') && message.toLowerCase().includes('flight')) {
      const flightNumber = extractFlightNumber(message); // Helper function to extract flight numbers
      
      if (flightNumber) {
        return res.json({
          message: `I can help you track flight ${flightNumber}. Would you like me to check the current status?`,
          richContent: {
            type: 'flightTracker',
            flightNumber: flightNumber
          },
          suggestions: [
            `Yes, track ${flightNumber}`,
            "No, I meant another flight",
            "How do I find my flight number?"
          ]
        });
      } else {
        return res.json({
          message: "I'd be happy to help track your flight. Please provide your flight number (e.g., BA1234).",
          suggestions: [
            "How do I find my flight number?",
            "Track by route instead",
            "Check flight delays"
          ]
        });
      }
    }

    // Weather information for destination
    if (message.toLowerCase().includes('weather') || 
       (message.toLowerCase().includes('temperature') && context?.selectedFlight)) {
      
      const destination = context?.selectedFlight?.slices?.[0]?.destination?.iata_code;
      
      if (destination) {
        // In a real implementation, you would call a weather API here
        return res.json({
          message: `The current weather in ${destination} is 24°C (75°F) and sunny. The forecast for your travel date shows similar conditions.`,
          richContent: {
            type: 'weather',
            location: destination,
            current: {
              temp: 24,
              condition: 'Sunny',
              humidity: '45%'
            },
            forecast: [
              { day: 'Today', high: 26, low: 18, condition: 'Sunny' },
              { day: 'Tomorrow', high: 27, low: 19, condition: 'Partly Cloudy' },
              { day: 'Day 3', high: 24, low: 17, condition: 'Scattered Showers' }
            ]
          }
        });
      } else {
        // Handle case when no destination is available
        return res.json({
          message: "I can provide weather information for your destination. Please provide a city name or search for a flight first so I know which destination you're interested in.",
          suggestions: [
            "Search for flights",
            "Weather in New York",
            "Weather in London",
            "Weather in Tokyo"
          ]
        });
      }
    }

    // Add this to your processMessage function to handle offer request related questions
    if (message.toLowerCase().includes('offer') && message.toLowerCase().includes('request')) {
      // Check if there's an offer request ID in the context
      const offerRequestId = context?.offerRequestId;
      
      if (offerRequestId) {
        return res.json({
          message: `I can help you check the status of your offer request. Would you like to view the details for offer request ${offerRequestId}?`,
          links: [
            {
              text: "View Offer Request Details",
              url: `/offer-request/${offerRequestId}`,
              action: "navigate"
            }
          ],
          suggestions: [
            "What is included in this offer?",
            "How long is this offer valid for?",
            "Can I modify this request?"
          ]
        });
      } else {
        return res.json({
          message: "To check a specific offer request, please provide the offer request ID or search for flights first.",
          suggestions: [
            "How do I find my offer request ID?",
            "Search for flights",
            "What is an offer request?"
          ]
        });
      }
    }

    // Add this to your controller for hotel-related queries
    if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('stay') || message.toLowerCase().includes('accommodation')) {
      return res.json({
        message: "We offer a wide range of hotel options from budget to luxury. You can browse our selection and book directly through our website.",
        links: [
          {
            text: "Browse Hotels",
            url: "/hotels",
            action: "navigate"
          }
        ],
        suggestions: [
          "What types of hotels do you offer?",
          "Do you have any hotel deals?",
          "Can I book a hotel with my flight?"
        ]
      });
    }
    
    // Default response if no keywords match
    return res.json({
      message: "I can help with flight bookings, cancellations, and travel information. What would you like to know?",
      suggestions: [
        "How do I search for flights?",
        "What payment methods do you accept?",
        "How do I cancel my booking?"
      ]
    });
    
  } catch (error) {
    console.error('Error in chatbot:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: "Sorry, I'm having trouble understanding that right now. Please try again."
    });
  }
};

/**
 * Get suggested questions based on current page
 */
exports.getSuggestions = (req, res) => {
  try {
    const { page = 'home' } = req.query;
    
    // Different suggestions based on the page the user is on
    const suggestions = {
      'home': [
        "What destinations are popular right now?",
        "How do I get the best deals?",
        "Do you offer last-minute bookings?"
      ],
      'flights': [
        "What's included in the ticket price?",
        "Can I filter for direct flights only?",
        "How do I see baggage allowance?"
      ],
      'booking': [
        "What information do I need to book?",
        "Can I book for someone else?",
        "What payment methods do you accept?"
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
      ],
      'default': [
        "How do I search for flights?",
        "What payment methods do you accept?",
        "How do I cancel my booking?"
      ]
    };
    
    res.json({ 
      suggestions: suggestions[page] || suggestions.default 
    });
    
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      suggestions: [
        "How do I search for flights?",
        "What payment methods do you accept?",
        "How do I cancel my booking?"
      ]
    });
  }
};

// Add this to your existing controller
const bookingProcessKnowledge = {
  // Search and selection phase
  'flight search': {
    message: "Our flight search process is designed for ease and accuracy. Enter your departure and arrival cities, dates, and passenger count. You can also filter by direct flights, price range, or airline preferences.",
    steps: [
      "Enter departure and destination cities",
      "Select travel dates (one-way or round trip)",
      "Specify number of passengers and cabin class",
      "Click 'Search Flights' to see available options"
    ]
  },
  
  // Booking process information
  'booking process': {
    message: "Booking a flight with us is simple and secure. After finding your ideal flight, you'll provide passenger details, select seats, add any extras like baggage or meals, then proceed to payment.",
    steps: [
      "Select your preferred flight from search results",
      "Enter passenger details (matching ID documents)",
      "Choose seats (optional, fees may apply)",
      "Add extras like meals or baggage",
      "Review booking details",
      "Proceed to secure payment"
    ]
  },
  
  // Payment information
  'payment': {
    message: "We offer multiple secure payment options including credit/debit cards, PayPal, and Apple Pay. All transactions are encrypted and we never store your complete card details.",
    options: [
      "Credit/Debit Cards (Visa, MasterCard, Amex)",
      "PayPal",
      "Apple Pay",
      "Google Pay",
      "Bank transfer (for select countries)"
    ]
  },
  
  // Post-booking information
  'after booking': {
    message: "After booking, you'll receive a confirmation email with your e-ticket and booking reference. You can manage your booking online, including seat changes, extra baggage, or special assistance requests.",
    steps: [
      "Receive booking confirmation email",
      "Check in online (available 24-48 hours before departure)",
      "Download boarding pass to your mobile or print it",
      "Arrive at the airport with sufficient time",
      "Proceed to bag drop (if checking luggage) or security"
    ]
  },
  
  // Check-in details
  'check in': {
    message: "Online check-in opens 24-48 hours before your flight and closes 90 minutes before departure. You can check in via our website or mobile app and download your boarding pass or have it emailed to you.",
    tips: [
      "Check in early for better seat selection",
      "Have your booking reference and passenger details ready",
      "Ensure passport/ID details match your booking exactly",
      "Download our mobile app for the easiest check-in experience"
    ]
  },
  
  // Baggage information
  'baggage': {
    message: "Baggage allowance varies by fare type and destination. Economy typically includes 1 carry-on (max 7kg) and checked baggage options vary. Premium cabins offer more generous allowances.",
    types: {
      "Carry-on": "1 bag + 1 personal item (laptop, purse, etc.)",
      "Economy": "Usually 23kg checked bag (may be an add-on)",
      "Premium Economy": "Usually 2x 23kg checked bags",
      "Business": "2-3x 32kg checked bags",
      "First": "3x 32kg checked bags"
    }
  },
  
  // Special needs
  'special assistance': {
    message: "We're committed to making air travel accessible to everyone. Special assistance is available for passengers with reduced mobility, vision or hearing impairments, or medical conditions.",
    options: [
      "Wheelchair assistance",
      "Priority boarding",
      "Special meal requests",
      "Support for traveling with medical equipment",
      "Assistance for unaccompanied minors"
    ]
  }
};

// Add this helper function to extract flight numbers
function extractFlightNumber(message) {
  // Match common flight number patterns (e.g., BA1234, AA 987, LH 456)
  const regex = /([A-Z]{2})\s*(\d{1,4})/i;
  const match = message.match(regex);
  
  if (match) {
    return `${match[1].toUpperCase()}${match[2]}`;
  }
  
  return null;
}

// Replace your existing getRelatedSuggestions function
function getRelatedSuggestions(matchedKey, currentPage = 'default') {
  // Map of related questions for each knowledge base topic
  const relatedQuestions = {
    'flight search': [
      "How far in advance should I book?",
      "Can I search for flexible dates?",
      "Do you show flights from all airlines?"
    ],
    'booking process': [
      "What documents do I need for booking?",
      "Can I book for someone else?",
      "How long is my booking held before payment?"
    ],
    'payment': [
      "Is there a booking fee?",
      "Can I pay in installments?",
      "Do you store my payment details?"
    ],
    'after booking': [
      "Can I change my flight after booking?",
      "How do I view my booking details?",
      "What is your cancellation policy?"
    ],
    'check in': [
      "When does online check-in open?",
      "Can I check in at the airport?",
      "How do I get my boarding pass?"
    ],
    'baggage': [
      "How much does extra baggage cost?",
      "What are the size limits for carry-on?",
      "Can I add baggage after booking?"
    ],
    'special assistance': [
      "How do I request wheelchair assistance?",
      "Do you accommodate dietary restrictions?",
      "What support is available for travelers with children?"
    ]
  };
  
  return relatedQuestions[matchedKey] || getSuggestionsForPage(currentPage);
}

// Add this to the getRelatedSuggestions function to fix any potential key issues there
function getRelatedSuggestions(matchedKey, currentPage) {
  // Map of related questions for each knowledge base topic
  const relatedQuestions = {
    'flight search': [
      "How far in advance should I book?",
      "Can I search for flexible dates?",
      "Do you show flights from all airlines?"
    ],
    // Other mappings...
  };
  
  return relatedQuestions[matchedKey] || getSuggestionsForPage(currentPage);
}

// Add this function right before or after getRelatedSuggestions
function getSuggestionsForPage(page = 'default') {
  // Different suggestions based on the page the user is on
  const suggestions = {
    'home': [
      "What destinations are popular right now?",
      "How do I get the best deals?",
      "Do you offer last-minute bookings?"
    ],
    'flights': [
      "What's included in the ticket price?",
      "Can I filter for direct flights only?",
      "How do I see baggage allowance?"
    ],
    'booking': [
      "What information do I need to book?",
      "Can I book for someone else?",
      "What payment methods do you accept?"
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
    ],
    'default': [
      "How do I search for flights?",
      "What payment methods do you accept?",
      "How do I cancel my booking?"
    ]
  };
  
  return suggestions[page] || suggestions.default;
}