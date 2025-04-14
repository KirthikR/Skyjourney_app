import { useState } from 'react';
// Update the import path with an extra "../" since we're now one level deeper
import { sendMessage } from '../../services/chatbotService';

// This is a hook that provides the chat functionality
export const useChatBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m SkyJourney\'s virtual assistant. I can help you find flights, answer travel questions, or provide information about our services. How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  
  // Extract flight search intent from message
  const extractFlightSearchIntent = (message) => {
    // Simple regex patterns to detect flight search intent
    const fromPattern = /(?:from|origin|departure)\s+([A-Za-z\s]+)(?:\s|$|,|\.|to)/i;
    const toPattern = /(?:to|destination|arrival)\s+([A-Za-z\s]+)(?:\s|$|,|\.)/i;
    const datePattern = /(?:on|date|departing|leaving)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?),?\s+\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i;
    
    const fromMatch = message.match(fromPattern);
    const toMatch = message.match(toPattern);
    const dateMatch = message.match(datePattern);
    
    const hasFlightKeywords = 
      message.includes('flight') || 
      message.includes('fly') || 
      message.includes('travel') || 
      message.includes('trip');
    
    // Return search parameters if we detect a flight search intent
    if ((fromMatch || toMatch) && hasFlightKeywords) {
      return {
        isFlightSearch: true,
        origin: fromMatch ? fromMatch[1].trim() : null,
        destination: toMatch ? toMatch[1].trim() : null,
        date: dateMatch ? dateMatch[1].trim() : null
      };
    }
    
    return { isFlightSearch: false };
  };
  
  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Check if this is a flight search intent
      const searchIntent = extractFlightSearchIntent(userMessage);
      
      // Process the message through the chatbot service
      const response = await sendMessage(userMessage, { searchIntent });
      
      // Add the response to the chat
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I'm sorry, I encountered an error processing your request. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    isLoading,
    isInitialized
  };
};