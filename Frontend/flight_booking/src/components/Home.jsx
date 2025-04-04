import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostHog } from '../hooks/usePostHog';
import styles from "../styles/Home.module.css";
import PopularDestinations from '../components/PopularDestinations';
import TrendingDeals from '../components/TrendingDeals';
import ChatBot from '../components/ChatBot';
import FeedbackWidget from './FeedbackWidget/FeedbackWidget';
import { 
  FaLinkedin, FaWhatsapp, FaFacebookSquare, FaYoutube, FaTwitter, 
  FaInstagram, FaFacebook, FaArrowRight, FaGlobeAmericas, 
  FaMoneyBillWave, FaBell 
} from 'react-icons/fa';
import { trackUIInteraction } from '../utils/eventTracking';

// Hero images array
const heroImages = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3840&q=100",
  "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3840&q=100",
  "https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3840&q=100",
  "https://images.unsplash.com/photo-1502726299822-6f583f972e02?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3840&q=100",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3840&q=100"
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNewFeature, setShowNewFeature] = useState(false);
  const navigate = useNavigate();
  const { trackEvent } = usePostHog('home');

  // Add this effect to send a test event when the page loads
  useEffect(() => {
    // Send a test event to verify PostHog is working
    trackEvent('page_viewed', {
      page: 'home',
      timestamp: new Date().toISOString()
    });
    
    console.log("Test event sent to PostHog");
  }, []);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if feature flag is enabled
    if (window.posthog) {
      const isEnabled = window.posthog.isFeatureEnabled('new-search-ui');
      setShowNewFeature(isEnabled);
      
      // Log feature flag evaluation
      console.log('Feature flag: new-search-ui =', isEnabled);
    }
  }, []);

  const handleBookNow = () => {
    // Navigate directly to the booking page without passing any state
    navigate('/booking');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // 80px offset for any fixed header
        behavior: 'smooth'
      });
    }
  };

  const faqs = [
    {
      question: "How can I find the best flight deals?",
      answer: "Compare prices across different dates using our flexible date search. Book in advance, typically 3-6 months before departure. Sign up for price alerts and newsletter to stay informed about special offers and discounts."
    },
    {
      question: "How can I find the best last minute flight deals?",
      answer: "Check our Last Minute Deals section regularly. Be flexible with your dates and destinations. Consider nearby airports. Sign up for instant alerts to grab sudden price drops and special offers."
    },
    {
      question: "How can I stay updated on flight deals and low fares?",
      answer: "Subscribe to our Price Alerts feature for specific routes. Join our newsletter for weekly deals. Follow our social media channels for flash sales and promotional offers. Enable push notifications in your account settings."
    },
    {
      question: "What happens after I've booked my flight?",
      answer: "You'll receive a confirmation email with your itinerary. Check-in opens 24-48 hours before departure. Access your booking through 'My Trips' to add extras or make changes. Download our app for real-time flight updates."
    },
    {
      question: "Where should I book a flight to right now?",
      answer: "Explore our trending destinations with great deals. Check our seasonal promotions and special offers. Use our 'Everywhere' search to find the best-priced destinations from your location."
    }
  ];

  // Track when users interact with "Find Flights" button
  const handleFindFlightsClick = () => {
    console.log("Find Flights clicked, sending event...");
    
    try {
      trackEvent('find_flights_button_clicked', { 
        source: 'home_hero',
        position: 'top',
        timestamp: new Date().toISOString()
      });
      console.log("Event sent via direct import");
    } catch (e) {
      console.error("Failed to send event via direct import:", e);
    }
  };
  
  // Track when users click on trending deals
  const handleTrendingDealClick = (deal) => {
    trackUIInteraction('trending_deal_click', {
      dealId: deal.id,
      destination: deal.destination,
      price: deal.price
    });
  };
  
  // Track FAQ interactions
  const handleFaqClick = (index, question) => {
    trackUIInteraction('faq_click', {
      faqIndex: index,
      faqQuestion: question,
      newState: activeIndex === index ? 'closed' : 'open'
    });
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Add this function somewhere in your component
  const handleSearchClick = () => {
    // Your existing logic
    
    // Add this line to track the event
    trackEvent('search_button_clicked', {
      page: 'home',
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    // Use the imported posthog rather than window.posthog
    console.log('PostHog import available:', posthog ? true : false);
    
    try {
      // Send test event using the import
      trackEvent('home_page_viewed', {
        timestamp: new Date().toISOString()
      });
      console.log('Test event sent through direct import');
    } catch (error) {
      console.error('Error sending PostHog event:', error);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div 
        className={styles.heroSection}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <div className={styles.heroContent}>
          <h1>Welcome to SkyJourney</h1>
          <p>Your premium flight booking experience</p>
          <Link 
            to="/booking" 
            className={styles.bookButton}
            onClick={handleFindFlightsClick}
          >
            Find Flights
          </Link>
        </div>
      </div>

      <TrendingDeals onDealClick={handleTrendingDealClick} />
      
      <PopularDestinations />

      {/* Hotel section has been removed as requested */}

      <div className={styles.featuresSection}>
        <div className={styles.featuresSectionInner}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>
              Looking for the best flight deals to anywhere in the world?
            </h2>
            <p className={styles.featuresDescription}>
              It's easy around here. 100 million travellers use us as their go-to tool, comparing flight deals and offers from more than 1,200 airlines and travel providers. With so many options to choose from in one place, you can say hello to savings, and goodbye to stress – here's how.
            </p>
          </div>

          <div className={styles.featureCardsContainer}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <FaGlobeAmericas />
                </div>
              </div>
              <h3 className={styles.featureCardTitle}>Search 'Everywhere', explore anywhere</h3>
              <p className={styles.featureCardText}>Enter your departure airport and travel dates, then hit 'Everywhere'. You'll see flights to every destination in the world, cheapest first.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <FaMoneyBillWave />
                </div>
              </div>
              <h3 className={styles.featureCardTitle}>Pay less, go further with transparent pricing</h3>
              <p className={styles.featureCardText}>The cheapest flight deals. No hidden fees. No funny business. With us, the price you see when you search is what you'll pay.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>
                  <FaBell />
                </div>
              </div>
              <h3 className={styles.featureCardTitle}>Book when it's best with Price Alerts</h3>
              <p className={styles.featureCardText}>Found your flight, but not quite ready to book? Set up Price Alerts and we'll let you know when your flight price goes up or down.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.hotelsPromo}>
        <div className={styles.promoContent}>
          <h2>Discover Luxury Hotels Worldwide</h2>
          <p>Find the perfect accommodation for your travel needs, from budget-friendly options to luxury resorts.</p>
          <button onClick={() => navigate('/hotels')} className={styles.exploreButton}>
            Explore Hotels <FaArrowRight style={{ marginLeft: '8px' }} />
          </button>
        </div>
        <div className={styles.promoImageGrid}>
          <div className={styles.promoImageMain}>
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" alt="Luxury hotel" />
          </div>
          <div className={styles.promoImageStack}>
            <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80" alt="Hotel room" />
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" alt="Hotel pool" />
          </div>
        </div>
      </div>
 
      <div className={styles.faqSection}>
        <div className={styles.faqWrapper}>
          <div className={styles.faqHeader}>
            <span className={styles.faqSectionLabel}>Knowledge Base</span>
            <h2 className={styles.faqTitle}>Finding flight deals: frequently asked questions</h2>
            <div className={styles.faqDivider}></div>
          </div>

          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${activeIndex === index ? styles.faqItemActive : ''}`}
              >
                <button
                  className={`${styles.faqQuestion} ${activeIndex === index ? styles.active : ''}`}
                  onClick={() => handleFaqClick(index, faq.question)}
                  aria-expanded={activeIndex === index}
                  data-attr="faq-question-button"
                >
                  <div className={styles.faqQuestionContent}>
                    <span className={styles.faqQuestionNumber}>{(index + 1).toString().padStart(2, '0')}</span>
                    <span>{faq.question}</span>
                  </div>
                  <span className={styles.faqArrow}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div 
                  className={`${styles.faqAnswer} ${activeIndex === index ? styles.show : ''}`}
                  aria-hidden={activeIndex !== index}
                >
                  <div className={styles.faqAnswerContent}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChatBot />
      <FeedbackWidget />

      <div className={styles.appPromoSection}>
        <div className={styles.appPromoContainer}>
          <div className={styles.appPromoContent}>
            <div className={styles.appPromoText}>
              <h2>Exclusive deals with the SkyJourney app!</h2>
              <p>Download the SkyJourney travel app for free to enjoy great deals wherever you are!</p>
              
              <div className={styles.appDownloadButtons}>
                <a href="#" className={styles.appStoreButton} aria-label="Download on the App Store">
                  <svg xmlns="http://www.w3.org/2000/svg" width="135" height="40" viewBox="0 0 135 40">
                    <path d="M134.032 35.268a3.83 3.83 0 01-3.834 3.83H4.729a3.835 3.835 0 01-3.839-3.83V4.725A3.84 3.84 0 014.729.89h125.468a3.834 3.834 0 013.834 3.835l.001 30.543z" fill="#A6A6A6"/>
                    <path d="M130.198 39.989H4.729A4.73 4.73 0 010 35.268V4.726A4.733 4.733 0 014.729 0h125.468a4.735 4.735 0 014.729 4.726v30.542c.001 2.605-2.123 4.721-4.728 4.721z" fill="#000"/>
                    <path d="M30.128 19.784c-.029-3.223 2.639-4.791 2.761-4.864-1.511-2.203-3.853-2.504-4.676-2.528-1.967-.207-3.875 1.177-4.877 1.177-1.022 0-2.565-1.157-4.228-1.123-2.14.033-4.142 1.272-5.24 3.196-2.266 3.923-.576 9.688 1.595 12.859 1.086 1.553 2.355 3.287 4.016 3.226 1.625-.067 2.232-1.036 4.193-1.036 1.943 0 2.513 1.036 4.207.997 1.744-.028 2.842-1.56 3.89-3.127 1.255-1.78 1.759-3.533 1.779-3.623-.041-.014-3.387-1.291-3.42-5.154zM26.928 10.306c.874-1.093 1.472-2.58 1.306-4.089-1.265.056-2.847.875-3.758 1.944-.806.942-1.526 2.486-1.34 3.938 1.421.106 2.88-.717 3.792-1.793z" fill="#FFF"/>
                    <g fill="#FFF">
                      <path d="M53.645 31.504h-2.271l-1.244-3.909h-4.324l-1.185 3.909H42.41l4.284-13.308h2.646l4.305 13.308zm-3.89-5.549L48.63 22.48c-.119-.355-.342-1.191-.671-2.507h-.04a96.75 96.75 0 01-.632 2.507l-1.105 3.475h3.573zM64.662 26.588c0 1.632-.441 2.922-1.323 3.869-.79.843-1.771 1.264-2.942 1.264-1.264 0-2.172-.454-2.725-1.362h-.04v5.055H55.5V25.067c0-1.026-.027-2.079-.079-3.159h1.875l.119 1.521h.04c.711-1.146 1.79-1.718 3.238-1.718 1.132 0 2.077.447 2.833 1.342.758.896 1.136 2.074 1.136 3.535zm-2.172.078c0-.934-.21-1.704-.632-2.31-.461-.632-1.08-.948-1.856-.948-.526 0-1.004.176-1.431.523-.428.35-.708.807-.839 1.373-.066.264-.099.48-.099.65v1.6c0 .698.214 1.287.642 1.768s.984.721 1.668.721c.803 0 1.428-.31 1.875-.928.448-.619.672-1.435.672-2.449zM75.699 26.588c0 1.632-.441 2.922-1.324 3.869-.789.843-1.77 1.264-2.941 1.264-1.264 0-2.172-.454-2.724-1.362h-.04v5.055h-2.132V25.067c0-1.026-.027-2.079-.079-3.159h1.875l.119 1.521h.04c.71-1.146 1.789-1.718 3.238-1.718 1.131 0 2.076.447 2.834 1.342.755.896 1.134 2.074 1.134 3.535zm-2.172.078c0-.934-.211-1.704-.633-2.31-.461-.632-1.078-.948-1.855-.948-.527 0-1.004.176-1.432.523-.428.35-.707.807-.838 1.373-.065.264-.099.48-.099.65v1.6c0 .698.214 1.287.64 1.768.428.48.984.721 1.67.721.803 0 1.428-.31 1.875-.928.448-.619.672-1.435.672-2.449zM88.039 27.772c0 1.132-.393 2.053-1.182 2.764-.867.777-2.074 1.165-3.625 1.165-1.432 0-2.58-.276-3.449-.829l.494-1.777c.936.566 1.963.85 3.082.85.803 0 1.428-.182 1.877-.544.447-.362.67-.848.67-1.454 0-.54-.184-.995-.553-1.364-.367-.369-.98-.712-1.836-1.029-2.33-.869-3.494-2.142-3.494-3.816 0-1.094.408-1.991 1.225-2.689.814-.699 1.9-1.048 3.258-1.048 1.211 0 2.217.211 3.02.632l-.533 1.738c-.75-.408-1.598-.612-2.547-.612-.75 0-1.336.185-1.756.553a1.58 1.58 0 00-.533 1.205c0 .526.203.961.611 1.303.355.316 1 .658 1.936 1.027 1.145.461 1.986 1 2.527 1.618.539.616.808 1.387.808 2.307zM95.088 23.508h-2.35v4.659c0 1.185.414 1.777 1.244 1.777.381 0 .697-.033.947-.099l.059 1.619c-.42.157-.973.236-1.658.236-.842 0-1.5-.257-1.975-.77-.473-.514-.711-1.376-.711-2.587v-4.837h-1.4v-1.6h1.4V20.15l2.094-.632v2.39h2.35v1.6zM105.691 26.627c0 1.475-.422 2.686-1.264 3.633-.883.975-2.055 1.461-3.516 1.461-1.408 0-2.529-.467-3.365-1.401s-1.254-2.113-1.254-3.534c0-1.487.43-2.705 1.293-3.652.861-.948 2.023-1.422 3.484-1.422 1.408 0 2.541.467 3.396 1.402.818.907 1.226 2.078 1.226 3.513zm-2.212.069c0-.885-.189-1.644-.572-2.277-.447-.766-1.086-1.148-1.914-1.148-.857 0-1.508.383-1.955 1.148-.383.634-.572 1.405-.572 2.317 0 .885.189 1.644.572 2.276.461.766 1.105 1.148 1.936 1.148.814 0 1.453-.39 1.914-1.168.393-.645.591-1.412.591-2.296zM112.621 23.783a3.702 3.702 0 00-.672-.059c-.75 0-1.33.283-1.738.85-.355.5-.533 1.132-.533 1.895v5.035h-2.131l.02-6.574c0-1.106-.027-2.113-.08-3.021h1.857l.078 1.836h.059c.225-.631.58-1.139 1.066-1.52a2.578 2.578 0 011.541-.514c.197 0 .375.014.533.039v2.033zM122.156 26.252a4.893 4.893 0 01-.078.967h-6.396c.025.948.334 1.673.928 2.173.539.447 1.236.671 2.092.671.947 0 1.811-.151 2.588-.454l.334 1.48c-.908.396-1.98.593-3.217.593-1.488 0-2.656-.438-3.506-1.313-.848-.875-1.273-2.05-1.273-3.524 0-1.447.395-2.652 1.186-3.613.828-1.026 1.947-1.539 3.355-1.539 1.383 0 2.43.513 3.141 1.539.563.815.846 1.823.846 3.02zm-2.033-.553c.014-.632-.125-1.178-.414-1.639-.369-.593-.936-.889-1.699-.889-.697 0-1.264.289-1.697.869-.355.461-.566 1.014-.631 1.658h4.441z"/>
                    </g>
                    <g fill="#FFF">
                      <path d="M49.05 10.009c0 1.177-.353 2.063-1.058 2.658-.653.549-1.581.824-2.783.824-.596 0-1.106-.026-1.533-.078V6.982c.557-.09 1.157-.136 1.805-.136 1.145 0 2.008.249 2.59.747.652.563.979 1.368.979 2.416zm-1.105.029c0-.763-.202-1.348-.606-1.756-.404-.407-.994-.611-1.771-.611-.33 0-.611.022-.844.068v4.889c.129.02.365.029.708.029.802 0 1.421-.223 1.857-.669s.656-1.096.656-1.95zM54.909 11.037c0 .725-.207 1.319-.621 1.785-.434.479-1.009.718-1.727.718-.692 0-1.243-.229-1.654-.689-.41-.459-.615-1.038-.615-1.736 0-.73.211-1.329.635-1.794s.994-.698 1.712-.698c.692 0 1.248.229 1.669.688.4.446.601 1.022.601 1.726zm-1.087.034c0-.435-.094-.808-.281-1.119-.22-.376-.533-.564-.94-.564-.421 0-.741.188-.961.564-.188.311-.281.69-.281 1.138 0 .435.094.808.281 1.119.227.376.543.564.951.564.4 0 .714-.191.94-.574.195-.317.291-.693.291-1.128zM62.765 8.719l-1.475 4.714h-.96l-.611-2.047a15.32 15.32 0 01-.379-1.523h-.019a11.15 11.15 0 01-.379 1.523l-.649 2.047h-.971l-1.387-4.714h1.077l.533 2.241c.129.53.235 1.035.32 1.513h.019c.078-.394.207-.896.389-1.503l.669-2.25h.854l.641 2.202c.155.537.281 1.054.378 1.552h.029c.071-.485.178-1.002.32-1.552l.572-2.202h1.029zM68.198 13.433H67.15v-2.7c0-.832-.316-1.248-.95-1.248a.946.946 0 00-.757.343c-.193.229-.291.499-.291.808v2.796h-1.048v-3.366c0-.414-.013-.863-.038-1.349h.921l.049.737h.029c.122-.229.304-.418.543-.569.284-.176.602-.265.95-.265.44 0 .806.142 1.097.427.362.349.543.87.543 1.562v2.824zM71.088 13.433h-1.047V6.556h1.047v6.877zM77.258 11.037c0 .725-.207 1.319-.621 1.785-.434.479-1.01.718-1.727.718-.693 0-1.244-.229-1.654-.689-.41-.459-.615-1.038-.615-1.736 0-.73.211-1.329.635-1.794s.994-.698 1.711-.698c.693 0 1.248.229 1.67.688.4.446.601 1.022.601 1.726zm-1.088.034c0-.435-.094-.808-.281-1.119-.219-.376-.533-.564-.939-.564-.422 0-.742.188-.961.564-.188.311-.281.69-.281 1.138 0 .435.094.808.281 1.119.227.376.543.564.951.564.4 0 .713-.191.939-.574.195-.317.291-.693.291-1.128zM82.33 13.433h-.941l-.078-.543h-.029c-.322.433-.781.65-1.377.65-.445 0-.805-.143-1.076-.427a1.339 1.339 0 01-.369-.96c0-.576.24-1.015.723-1.319.482-.304 1.16-.453 2.033-.446v-.087c0-.621-.326-.931-.979-.931-.465 0-.875.117-1.229.349l-.213-.688c.438-.271.979-.407 1.617-.407 1.232 0 1.85.65 1.85 1.95v1.736c0 .471.023.846.068 1.124zm-1.088-1.62v-.727c-1.156-.02-1.734.297-1.734.95 0 .246.066.43.201.553a.733.733 0 00.512.184c.23 0 .445-.073.641-.218a.893.893 0 00.38-.742zM88.285 13.433h-.93l-.049-.757h-.029c-.297.576-.803.864-1.514.864-.568 0-1.041-.223-1.416-.669s-.562-1.025-.562-1.736c0-.763.203-1.381.611-1.853.395-.44.879-.66 1.455-.66.633 0 1.076.213 1.328.64h.02V6.556h1.049v5.607c0 .459.012.882.037 1.27zm-1.086-1.988v-.786a1.194 1.194 0 00-.408-.651 1.03 1.03 0 00-.701-.258c-.391 0-.697.155-.922.466-.223.311-.336.708-.336 1.193 0 .466.107.844.322 1.135.227.31.533.465.916.465.344 0 .619-.129.828-.388.202-.239.301-.527.301-.863zM97.248 11.037c0 .725-.207 1.319-.621 1.785-.434.479-1.008.718-1.727.718-.693 0-1.244-.229-1.654-.689-.41-.459-.615-1.038-.615-1.736 0-.73.211-1.329.635-1.794s.994-.698 1.713-.698c.691 0 1.248.229 1.668.688.4.446.601 1.022.601 1.726zm-1.086.034c0-.435-.094-.808-.281-1.119-.221-.376-.533-.564-.941-.564-.42 0-.74.188-.961.564-.188.311-.281.69-.281 1.138 0 .435.094.808.281 1.119.227.376.543.564.951.564.4 0 .715-.191.941-.574.193-.317.291-.693.291-1.128zM102.883 13.433h-1.047v-2.7c0-.832-.316-1.248-.951-1.248-.311 0-.562.114-.756.343s-.291.499-.291.808v2.796h-1.049v-3.366c0-.414-.012-.863-.037-1.349h.92l.049.737h.029a1.53 1.53 0 01.543-.569c.285-.176.602-.265.951-.265.439 0 .805.142 1.096.427.363.349.543.87.543 1.562v2.824zM109.936 9.504h-1.154v2.29c0 .582.205.873.611.873.188 0 .344-.016.467-.049l.027.795c-.207.078-.479.117-.814.117-.414 0-.736-.126-.969-.378-.234-.252-.35-.676-.35-1.271V9.504h-.689v-.785h.689v-.864l1.027-.31v1.173h1.154v.786zM115.484 13.433h-1.049v-2.68c0-.845-.315-1.268-.949-1.268-.486 0-.818.245-1 .735-.031.103-.049.229-.049.377v2.835h-1.047V6.556h1.047v2.841h.02c.33-.517.803-.775 1.416-.775.434 0 .793.142 1.078.427.356.355.533.883.533 1.581v2.803zM121.207 11.037c0 .725-.207 1.319-.621 1.785-.434.479-1.008.718-1.727.718-.693 0-1.244-.229-1.654-.689-.41-.459-.615-1.038-.615-1.736 0-.73.211-1.329.635-1.794s.994-.698 1.713-.698c.691 0 1.248.229 1.668.688.4.446.601 1.022.601 1.726zm-1.086.034c0-.435-.094-.808-.281-1.119-.221-.376-.533-.564-.941-.564-.42 0-.74.188-.961.564-.188.311-.281.69-.281 1.138 0 .435.094.808.281 1.119.227.376.543.564.951.564.4 0 .715-.191.941-.574.194-.317.291-.693.291-1.128zM126.961 13.433h-1.047v-2.7c0-.832-.316-1.248-.951-1.248-.311 0-.562.114-.756.343s-.291.499-.291.808v2.796h-1.049v-3.366c0-.414-.012-.863-.037-1.349h.92l.049.737h.029a1.53 1.53 0 01.543-.569c.285-.176.602-.265.951-.265.439 0 .805.142 1.096.427.363.349.543.87.543 1.562v2.824zM132.443 8.719l-1.475 4.714h-.96l-.611-2.047a15.32 15.32 0 01-.379-1.523h-.019a11.15 11.15 0 01-.379 1.523l-.649 2.047h-.971l-1.387-4.714h1.077l.533 2.241c.129.53.235 1.035.32 1.513h.019c.078-.394.207-.896.389-1.503l.669-2.25h.854l.641 2.202c.155.537.281 1.054.378 1.552h.029c.071-.485.178-1.002.32-1.552l.572-2.202h1.029z"/>
                    </g>
                  </svg>
                </a>
                
                <a href="#" className={styles.playStoreButton} aria-label="Get it on Google Play">
                  <svg xmlns="http://www.w3.org/2000/svg" width="135" height="40" viewBox="0 0 135 40">
                    <path fill="#A6A6A6" d="M130.197 40H4.729A4.74 4.74 0 010 35.267V4.726A4.733 4.733 0 014.729 0h125.468C132.803 0 135 2.12 135 4.726v30.541c0 2.605-2.197 4.733-4.803 4.733z"/>
                    <path d="M134.032 35.268a3.83 3.83 0 01-3.834 3.83H4.729a3.835 3.835 0 01-3.839-3.83V4.725A3.84 3.84 0 014.729.89h125.468a3.834 3.834 0 013.834 3.835l.001 30.543z"/>
                    <path d="M47.418 10.243c0 .838-.257 1.506-.77 2.006-.581.576-1.334.863-2.262.863-.886 0-1.639-.287-2.26-.863-.62-.575-.93-1.291-.93-2.143 0-.852.31-1.567.93-2.145.621-.577 1.374-.866 2.26-.866.467 0 .91.093 1.33.276.419.186.754.437 1.004.753l-.563.563c-.4-.471-.947-.706-1.643-.706-.632 0-1.178.222-1.639.669-.459.445-.688 1.02-.688 1.726 0 .705.229 1.28.688 1.727.46.445 1.006.669 1.639.669.67 0 1.226-.224 1.669-.67.29-.292.458-.696.504-1.216h-2.173v-.77h2.908c.028.148.038.288.038.427zm4.422-2.092h-2.733v1.884h2.464v.77h-2.464v1.884h2.733v.786H48.32V7.366h3.52v.785zm3.305 5.324h-.787V8.151h-1.726v-.785h4.24v.785h-1.727v5.324zm4.846 0V7.366h.787v6.109h-.787zm4.29 0h-.788V8.151h-1.726v-.785h4.24v.785h-1.727v5.324zm9.76-1.218c-.59.611-1.304.917-2.145.917-.842 0-1.555-.306-2.145-.917-.59-.61-.884-1.36-.884-2.249 0-.888.294-1.636.884-2.248.59-.612 1.304-.917 2.145-.917.837 0 1.55.305 2.144.917.591.612.885 1.36.885 2.248 0 .888-.294 1.639-.884 2.249zm-3.732-.5c.438.45.97.674 1.587.674.617 0 1.147-.225 1.588-.674.441-.448.66-1.022.66-1.72 0-.696-.219-1.27-.66-1.72-.44-.448-.97-.674-1.588-.674-.618 0-1.15.226-1.587.675-.439.45-.658 1.023-.658 1.72 0 .697.219 1.27.658 1.72zm5.598 1.718V7.366h.958l2.97 4.756V7.366h.788v6.109h-.818l-3.109-4.975v4.975h-.789z" fill="#FFF" stroke="#FFF" stroke-width=".2" stroke-miterlimit="10"/>
                    <path d="M68.463 21.442a4.05 4.05 0 00-4.041 4.042 4.05 4.05 0 004.041 4.042 4.05 4.05 0 004.042-4.042 4.05 4.05 0 00-4.042-4.042zm0 6.495a2.483 2.483 0 01-2.453-2.453 2.466 2.466 0 012.453-2.453 2.456 2.456 0 012.453 2.453 2.472 2.472 0 01-2.453 2.453zm-9.516-6.495a4.05 4.05 0 00-4.041 4.042 4.05 4.05 0 004.041 4.042 4.05 4.05 0 004.041-4.042 4.05 4.05 0 00-4.041-4.042zm0 6.495a2.483 2.483 0 01-2.453-2.453 2.466 2.466 0 012.453-2.453 2.456 2.456 0 012.453 2.453 2.472 2.472 0 01-2.453 2.453zm-11.325-5.251v1.714h4.11c-.121.963-.439 1.664-.923 2.149-.591.588-1.516 1.24-3.138 1.24-2.503 0-4.457-2.016-4.457-4.519s1.954-4.519 4.457-4.519c1.35 0 2.337.53 3.062 1.213l1.213-1.213c-1.015-.973-2.364-1.714-4.274-1.714-3.441 0-6.333 2.799-6.333 6.333 0 3.533 2.892 6.333 6.333 6.333 1.855 0 3.252-.609 4.346-1.75 1.125-1.125 1.474-2.71 1.474-3.987 0-.394-.03-.757-.091-1.061h-5.729l-.05-.219zm42.526 1.333c-.336-.912-1.364-2.577-3.464-2.577-2.079 0-3.805 1.634-3.805 4.042 0 2.268 1.709 4.042 4.001 4.042 1.855 0 2.925-1.133 3.37-1.788l-1.379-.92c-.46.67-1.087 1.116-1.992 1.116-.903 0-1.549-.414-1.962-1.231l5.414-2.24-.183-.444zm-5.521 1.351c-.046-1.562 1.213-2.359 2.117-2.359.707 0 1.305.35 1.501.854l-3.618 1.505zm-4.397 3.917h1.774V16.788h-1.774v13.499zm-2.909-7.891c-.461-.442-1.183-.866-2.126-.866-1.954 0-3.776 1.719-3.776 4.05 0 2.27 1.807 4.033 3.776 4.033.943 0 1.665-.424 2.065-.897h.06v.563c0 1.498-.803 2.3-2.096 2.3-1.056 0-1.713-.76-1.981-1.399l-1.501.624c.431 1.04 1.575 2.314 3.482 2.314 2.024 0 3.735-1.19 3.735-4.08v-7.027h-1.639v.385h-.001zm-2.034 6.359c-1.191 0-2.187-.991-2.187-2.356 0-1.378.996-2.384 2.187-2.384 1.174 0 2.095 1.006 2.095 2.384 0 1.365-.921 2.356-2.095 2.356zm22.577-11.967h-4.246v13.499h1.773v-5.121h2.473c1.967 0 3.898-1.424 3.898-4.189s-1.93-4.189-3.898-4.189zm.049 6.497h-2.521v-4.616h2.521c1.506 0 2.358 1.248 2.358 2.308 0 1.037-.853 2.308-2.358 2.308zm12.391-1.938c-1.282 0-2.612.565-3.163 1.821l1.575.656c.336-.656.96-.869 1.615-.869.914 0 1.849.547 1.861 1.521v.122c-.32-.183-1.005-.457-1.849-.457-1.694 0-3.418.931-3.418 2.667 0 1.585 1.388 2.606 2.949 2.606 1.191 0 1.849-.547 2.26-1.177h.061v.93h1.713v-4.562c0-2.109-1.575-3.258-3.604-3.258zm-.213 6.497c-.58 0-1.39-.29-1.39-1.013 0-.921 1.013-1.273 1.89-1.273.779 0 1.146.168 1.62.397-.136 1.11-1.11 1.889-2.12 1.889zm10.059-6.239l-2.036 5.153h-.061l-2.109-5.153h-1.913l3.163 7.2-1.802 4-1.723 3.83h1.849l4.655-10.848h-1.849v-.183h.061l-.75.001zm-16.062 8.348h1.773V16.788h-1.773v13.499z" fill="#FFF"/>
                    <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="21.8" y1="33.29" x2="5.017" y2="16.508" gradientTransform="matrix(1 0 0 -1 0 42)">
                      <stop offset="0" stop-color="#00A0FF"/>
                      <stop offset=".007" stop-color="#00A1FF"/>
                      <stop offset=".26" stop-color="#00BEFF"/>
                      <stop offset=".512" stop-color="#00D2FF"/>
                      <stop offset=".76" stop-color="#00DFFF"/>
                      <stop offset="1" stop-color="#00E3FF"/>
                    </linearGradient>
                    <path d="M10.435 7.538c-.291.308-.463.786-.463 1.405v22.116c0 .62.172 1.097.463 1.405l.074.072 12.389-12.389v-.292L10.508 7.465l-.073.073z" fill="url(#a)"/>
                    <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="33.834" y1="21.999" x2="9.637" y2="21.999" gradientTransform="matrix(1 0 0 -1 0 42)">
                      <stop offset="0" stop-color="#FFE000"/>
                      <stop offset=".409" stop-color="#FFBD00"/>
                      <stop offset=".775" stop-color="#FFA500"/>
                      <stop offset="1" stop-color="#FF9C00"/>
                    </linearGradient>
                    <path d="M27.028 24.278l-4.129-4.131v-.292l4.13-4.13.093.053 4.893 2.78c1.398.794 1.398 2.093 0 2.888l-4.893 2.78-.094.052z" fill="url(#b)"/>
                    <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="24.827" y1="19.704" x2="2.069" y2="-3.054" gradientTransform="matrix(1 0 0 -1 0 42)">
                      <stop offset="0" stop-color="#FF3A44"/>
                      <stop offset="1" stop-color="#C31162"/>
                    </linearGradient>
                    <path d="M27.122 24.225l-4.224-4.224-12.463 12.463c.461.488 1.221.548 2.078.061l14.609-8.3" fill="url(#c)"/>
                    <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="7.297" y1="41.824" x2="17.46" y2="31.661" gradientTransform="matrix(1 0 0 -1 0 42)">
                      <stop offset="0" stop-color="#32A071"/>
                      <stop offset=".069" stop-color="#2DA771"/>
                      <stop offset=".476" stop-color="#15CF74"/>
                      <stop offset=".801" stop-color="#06E775"/>
                      <stop offset="1" stop-color="#00F076"/>
                    </linearGradient>
                    <path d="M27.122 15.777L12.513 7.477c-.857-.487-1.617-.426-2.078.061l12.463 12.463 4.224-4.224z" fill="url(#d)"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className={styles.appPromoImage}>
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="SkyJourney Mobile App" 
                className={styles.appImage}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Partners</h4>
            <ul>
              <li><a href="#">Advertise with us</a></li>
              <li><a href="#">Travel agents</a></li>
              <li><a href="#">Airlines</a></li>
              <li><a href="#">Affiliates</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Trips</h4>
            <ul>
              <li><a href="#">Trip planner</a></li>
              <li><a href="#">Travel guides</a></li>
              <li><a href="#">Travel tips</a></li>
              <li><a href="#">Mobile app</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.socialLinks}>
          <a href="#" className={`${styles.youtube}`}>
            <FaYoutube />
          </a>
          <a href="#" className={`${styles.facebook}`}>
            <FaFacebook />
          </a>
          <a href="#" className={`${styles.twitter}`}>
            <FaTwitter />
          </a>
          <a href="#" className={`${styles.instagram}`}>
            <FaInstagram />
          </a>
          <a href="#" className={`${styles.linkedin}`}>
            <FaLinkedin />
          </a>
        </div>
      </footer>
      
      {/* Debug buttons removed */}
    </div>
  );
};

export default Home;