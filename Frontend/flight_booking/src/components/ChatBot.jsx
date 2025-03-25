import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaComment, FaPaperPlane, FaTimes, FaRobot, FaUser, FaSpinner, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { sendMessage, getSuggestedQuestions } from '../services/chatbotService';
import styles from './ChatBot.module.css';

const ChatBot = ({ userContext }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! I'm SkyBot, your personal flight assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [hasShownProactiveHelp, setHasShownProactiveHelp] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Get current page for context-aware suggestions
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.includes('/flights')) return 'flights';
    if (path.includes('/booking/payment')) return 'payment';
    if (path.includes('/booking/confirmation')) return 'confirmation';
    if (path.includes('/booking')) return 'booking';
    return 'other';
  };

  // Load suggested questions when chat opens or page changes
  useEffect(() => {
    if (isOpen) {
      const loadSuggestions = async () => {
        const currentPage = getCurrentPage();
        const result = await getSuggestedQuestions(currentPage);
        setSuggestedQuestions(result.suggestions || []);
      };
      
      loadSuggestions();
    }
  }, [isOpen, location.pathname]);

  // Scroll to bottom of messages when new message arrives
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Speech recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        
        // Auto-send after voice input
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Show proactive help based on page
  useEffect(() => {
    const currentPage = getCurrentPage();
    
    if (isOpen && !hasShownProactiveHelp) {
      // Wait a moment before showing proactive help
      const timer = setTimeout(() => {
        let helpMessage = null;
        
        switch (currentPage) {
          case 'flights':
            helpMessage = "I see you're browsing flights! Need help comparing options or understanding fare differences?";
            break;
          case 'booking':
            helpMessage = "Looking to book a flight? I can help you understand the booking process or answer questions about passenger details.";
            break;
          case 'payment':
            helpMessage = "Ready to complete your booking? I can answer questions about payment options or security.";
            break;
          default:
            return; // No proactive message for other pages
        }
        
        if (helpMessage) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: helpMessage,
            sender: 'bot',
            timestamp: new Date(),
            isProactive: true
          }]);
          setHasShownProactiveHelp(true);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, location.pathname, hasShownProactiveHelp]);

  // Reset proactive help when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setHasShownProactiveHelp(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;
    
    // Use timestamp + random number for truly unique IDs
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Add user message
    const userMessage = {
      id: uniqueId,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Gather context - current page, search parameters, selected flight if any
      const pageContext = {
        page: getCurrentPage(),
        language: language,
        ...userContext
      };
      
      // Get response from chatbot service
      const response = await sendMessage(text, pageContext);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        links: response.links || [],
        richContent: response.richContent || null
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update suggestions if provided
      if (response.suggestions) {
        setSuggestedQuestions(response.suggestions);
      }
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (question) => {
    handleSendMessage(question);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Update handleLinkClick function to properly navigate
  const handleLinkClick = (e, link) => {
    e.preventDefault();
    console.log("Link clicked:", link); // Add this for debugging
    
    if (link.action === 'navigate') {
      // Navigate to the specified URL
      navigate(link.url);
      
      // Optionally close the chat after navigation
      // setIsOpen(false);
    } else {
      // Handle external links
      window.open(link.url, '_blank');
    }
  };

  // Add this function to render rich content
  const renderRichContent = (richContent) => {
    if (!richContent) return null;
    
    switch (richContent.type) {
      case 'steps':
        return (
          <div className={styles.richSteps}>
            <h4>{richContent.title}</h4>
            <ol className={styles.stepsList}>
              {richContent.items.map((step, index) => (
                <li key={`step-${index}-${step.number}`} className={styles.step}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        );
        
      case 'options':
        return (
          <div className={styles.richOptions}>
            <h4>{richContent.title}</h4>
            <ul className={styles.optionsList}>
              {richContent.items.map((option, index) => (
                <li key={`option-${index}-${option.substring(0, 10)}`} className={styles.option}>
                  <span className={styles.optionBullet}>•</span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'table':
        return (
          <div className={styles.richTable}>
            <h4>{richContent.title}</h4>
            <table className={styles.infoTable}>
              <tbody>
                {richContent.items.map((item, index) => (
                  <tr key={`row-${index}-${item.key}`}>
                    <th>{item.key}</th>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Add a function to clear chat messages
  const clearChat = () => {
    // Keep only a new welcome message in the proper language
    const welcomeMessages = {
      'en': "Hi there! I'm SkyBot, your personal flight assistant. How can I help you today?",
      'es': "¡Hola! Soy SkyBot, tu asistente personal de vuelos. ¿Cómo puedo ayudarte hoy?",
      'fr': "Bonjour! Je suis SkyBot, votre assistant de vol personnel. Comment puis-je vous aider aujourd'hui?",
      'de': "Hallo! Ich bin SkyBot, Ihr persönlicher Flugassistent. Wie kann ich Ihnen heute helfen?",
      'zh': "你好！我是 SkyBot，您的个人航班助手。今天我能为您做些什么？"
    };

    setMessages([{ 
      id: Date.now(), 
      text: welcomeMessages[language] || welcomeMessages['en'], 
      sender: 'bot',
      timestamp: new Date()
    }]);
    
    // Reset other states if needed
    setIsTyping(false);
    setHasShownProactiveHelp(false);
  };

  // Update the language change handler to also update welcome message and placeholders
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // If you want to immediately update the last bot message to the new language
    // (optional, but provides immediate feedback)
    const welcomeMessages = {
      'en': "I've switched to English. How can I help you today?",
      'es': "He cambiado al español. ¿Cómo puedo ayudarte hoy?",
      'fr': "Je suis passé au français. Comment puis-je vous aider aujourd'hui?",
      'de': "Ich bin auf Deutsch umgestiegen. Wie kann ich Ihnen heute helfen?",
      'zh': "我已切换为中文。今天我能为您做些什么？"
    };
    
    // Add language change notification
    setMessages(prev => [...prev, {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: welcomeMessages[newLanguage] || welcomeMessages['en'],
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const getPlaceholderText = () => {
    const placeholders = {
      'en': "Type your question here...",
      'es': "Escribe tu pregunta aquí...",
      'fr': "Tapez votre question ici...",
      'de': "Geben Sie Ihre Frage hier ein...",
      'zh': "在此输入您的问题..."
    };
    
    return placeholders[language] || placeholders['en'];
  };

  // Make sure this function is properly connected to your message rendering
  const renderMessageContent = (message) => {
    return (
      <div className={styles.messageContent}>
        <p className={message.isError ? styles.errorText : ''}>
          {message.text}
        </p>
        
        {/* Render rich content if present */}
        {message.richContent && renderRichContent(message.richContent)}
        
        {/* Render links - Make sure this part is implemented correctly */}
        {message.links && message.links.length > 0 && (
          <div className={styles.messageLinks}>
            {message.links.map((link, index) => (
              <a 
                key={`link-${index}-${link.text}`} 
                href={link.url} 
                className={styles.messageLink}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}
        
        <div className={styles.messageTime}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Chat toggle button */}
      <button 
        className={`${styles.chatToggle} ${isOpen ? styles.open : ''}`} 
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FaTimes /> : <FaComment />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <FaRobot className={styles.botIcon} />
              <span>SkyBot Assistant</span>
            </div>
            
            <div className={styles.headerActions}>
              <select 
                className={styles.languageSelector}
                value={language}
                onChange={handleLanguageChange} // Use the new handler
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
              
              {/* Add Clear Chat button */}
              <button 
                className={styles.clearButton} 
                onClick={clearChat}
                aria-label="Clear chat"
              >
                Clear Chat
              </button>
              
              <button 
                className={styles.closeButton} 
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div 
                key={`msg-${message.id}`} 
                className={`${styles.message} ${message.sender === 'bot' ? styles.botMessage : styles.userMessage}`}
              >
                <div className={styles.messageAvatar}>
                  {message.sender === 'bot' ? <FaRobot /> : <FaUser />}
                </div>
                {renderMessageContent(message)}
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageIcon}>
                  <FaRobot />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {suggestedQuestions.length > 0 && (
            <div className={styles.suggestedQuestions}>
              {suggestedQuestions.map((question, index) => (
                <button 
                  key={`suggest-${index}-${question.substring(0, 15)}`} 
                  className={styles.suggestionButton}
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          
          <div className={styles.chatInputContainer}>
            <input
              ref={inputRef}
              type="text"
              className={styles.chatInput}
              placeholder={getPlaceholderText()}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping || isListening}
            />
            
            {/* Voice input button */}
            {speechSupported && (
              <button 
                className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
                onClick={toggleListening}
                disabled={isTyping}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
            )}
            
            <button 
              className={styles.sendButton} 
              onClick={() => handleSendMessage()}
              disabled={(!inputValue.trim() && !isListening) || isTyping}
              aria-label="Send message"
            >
              {isTyping ? <FaSpinner className={styles.spinner} /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;