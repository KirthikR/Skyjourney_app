import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaTrash, FaRegCopy, FaCalendar, FaMapMarkerAlt, FaPlane, FaDollarSign, FaClock } from 'react-icons/fa';
import styles from '../styles/ChatBot.module.css';

const flightDatabase = {
  destinations: ['Paris', 'Tokyo', 'New York', 'Dubai', 'London', 'Singapore'],
  airlines: ['Emirates', 'Air France', 'British Airways', 'Singapore Airlines'],
  priceRanges: ['$200-500', '$501-1000', '$1001-2000', '$2000+'],
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        type: 'bot',
        content: "👋 Hello! I'm your AI Flight Assistant. I can help you with:",
        options: [
          'Finding best flight deals',
          'Booking assistance',
          'Travel recommendations',
          'Flight status'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([{
        type: 'bot',
        content: "Chat cleared! How else can I help you today?",
        options: [
          'Finding best flight deals',
          'Booking assistance',
          'Travel recommendations'
        ]
      }]);
    }, 300);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Conversation copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, { type: 'user', content: option }]);
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = getResponseForOption(option);
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const getResponseForOption = (option) => {
    const responses = {
      'Finding best flight deals': {
        type: 'bot',
        content: "I can help you find the best deals! What's your preferred:",
        options: ['Destination', 'Travel dates', 'Budget range']
      },
      'Booking assistance': {
        type: 'bot',
        content: "I'll guide you through the booking process. What would you like to know?",
        options: ['Booking steps', 'Payment options', 'Cancellation policy']
      },
      'Travel recommendations': {
        type: 'bot',
        content: "I can suggest great destinations based on your preferences:",
        options: ['Popular destinations', 'Budget-friendly', 'Season specials']
      },
      'Flight status': {
        type: 'bot',
        content: "I can help you check your flight status. Please provide:",
        options: ['Flight number', 'Route details']
      }
    };
    
    return responses[option] || {
      type: 'bot',
      content: "I'll help you with that. Could you provide more details?",
      options: ['Start over', 'Speak to agent']
    };
  };

  const processUserInput = async (input) => {
    const lowercaseInput = input.toLowerCase();
    let response = {
      type: 'bot',
      content: '',
      options: []
    };

    // Process flight-related keywords
    if (lowercaseInput.includes('flight') || lowercaseInput.includes('fly')) {
      if (lowercaseInput.includes('cheap') || lowercaseInput.includes('best deal')) {
        response = {
          type: 'bot',
          content: "I'll help you find the best flight deals! Let's narrow it down:",
          suggestions: getBestDeals(),
          options: ['Set price alert', 'Compare airlines', 'Flexible dates']
        };
      } else if (lowercaseInput.includes('book')) {
        response = {
          type: 'bot',
          content: "I'll guide you through the booking process. First, let's get some details:",
          form: {
            type: 'flightBooking',
            fields: ['From', 'To', 'Date', 'Passengers']
          },
          options: ['Search flights', 'Check prices', 'View requirements']
        };
      }
    }

    // Process location-based queries
    else if (flightDatabase.destinations.some(dest => lowercaseInput.includes(dest.toLowerCase()))) {
      const destination = flightDatabase.destinations.find(
        dest => lowercaseInput.includes(dest.toLowerCase())
      );
      response = {
        type: 'bot',
        content: `Great choice! Here's what you need to know about flying to ${destination}:`,
        flightInfo: await getDestinationInfo(destination),
        options: ['Check prices', 'View travel guides', 'Weather info']
      };
    }

    // Process price-related queries
    else if (lowercaseInput.includes('price') || lowercaseInput.includes('cost')) {
      response = {
        type: 'bot',
        content: "Let me help you find flights within your budget:",
        priceChart: await generatePriceChart(),
        options: ['Sort by price', 'Price alerts', 'Flexible dates']
      };
    }

    // Add travel recommendations
    else if (lowercaseInput.includes('recommend') || lowercaseInput.includes('suggest')) {
      response = {
        type: 'bot',
        content: "Based on your preferences, here are my top recommendations:",
        recommendations: await generateRecommendations(),
        options: ['More like this', 'Different options', 'View details']
      };
    }

    return response;
  };

  const getBestDeals = () => ({
    todaySpecial: {
      route: 'NYC → LON',
      price: '$399',
      savings: '45%'
    },
    trending: [
      { from: 'LAX', to: 'TYO', price: '$599' },
      { from: 'SFO', to: 'SIN', price: '$699' }
    ]
  });

  const getDestinationInfo = async (destination) => ({
    bestTime: 'September-November',
    avgPrice: '$750',
    popularRoutes: ['Direct flights available', '12 airlines'],
    weather: '22°C / 72°F',
    travelTips: ['Visa requirements', 'Local attractions']
  });

  const generatePriceChart = async () => ({
    lowest: '$399',
    highest: '$1299',
    bestDay: 'Tuesday',
    priceHistory: [/* price history data */]
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Process the message
    const response = await processUserInput(inputMessage);
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add bot response
    setMessages(prev => [...prev, {
      ...response,
      timestamp: new Date().toISOString()
    }]);
    setIsTyping(false);
  };

  return (
    <div className={isOpen ? styles.chatbotOpen : styles.chatbot}>
      {!isOpen ? (
        <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
          <FaRobot /> Chat with AI Assistant
        </button>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3><FaRobot /> AI Flight Assistant</h3>
            <div className={styles.headerButtons}>
              <button onClick={() => copyToClipboard(messages.map(m => `${m.type}: ${m.content}`).join('\n'))}>
                <FaRegCopy />
              </button>
              <button onClick={clearChat}><FaTrash /></button>
              <button onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.messageWrapper} ${styles[message.type]}`}>
                <div className={styles.message}>
                  {message.content}
                  {message.suggestions && (
                    <div className={styles.suggestions}>
                      {renderSuggestions(message.suggestions)}
                    </div>
                  )}
                  {message.flightInfo && (
                    <div className={styles.flightInfo}>
                      {renderFlightInfo(message.flightInfo)}
                    </div>
                  )}
                  {message.priceChart && (
                    <div className={styles.priceChart}>
                      {renderPriceChart(message.priceChart)}
                    </div>
                  )}
                  {message.options && (
                    <div className={styles.options}>
                      {message.options.map((option, i) => (
                        <button key={i} onClick={() => handleOptionClick(option)}>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={styles.typingIndicator}>
                AI is typing<span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={styles.inputContainer}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}