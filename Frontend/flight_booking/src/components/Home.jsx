import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import PopularDestinations from '../components/PopularDestinations';
import TrendingDeals from '../components/TrendingDeals';
import ChatBot from '../components/ChatBot';
import { 
  FaLinkedin, FaWhatsapp, FaFacebookSquare, FaYoutube, FaTwitter, 
  FaInstagram, FaFacebook, FaArrowRight, FaGlobeAmericas, 
  FaMoneyBillWave, FaBell 
} from 'react-icons/fa';

// Add this after your imports
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
  const navigate = useNavigate();

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleBookNow = () => {
    // Navigate directly to the booking page without passing any state
    navigate('/booking');
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
          <Link to="/booking" className={styles.bookButton}>
            Find Flights
          </Link>
        </div>
      </div>

      <TrendingDeals />
      
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
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  aria-expanded={activeIndex === index}
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

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerSection}>
            <h4>Help</h4>
            <ul>
              <li><a href="#">Privacy Settings</a></li>
              <li><a href="#">Log in</a></li>
              <li><a href="#">Cookie policy</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Company Details</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Explore</h4>
            <ul>
              <li><a href="#">Cities</a></li>
              <li><a href="#">Airports</a></li>
              <li><a href="#">Countries</a></li>
              <li><a href="#">Flights</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
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
          {/* Add more social links as needed */}
        </div>
      </footer>
    </div>
  );
};

export default Home;