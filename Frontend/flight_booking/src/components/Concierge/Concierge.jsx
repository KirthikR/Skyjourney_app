import React, { useState, useEffect } from 'react';
import { 
  FaConciergeBell, 
  FaGlassMartiniAlt, 
  FaUmbrella, 
  FaCar, 
  FaUtensils, 
  FaTicketAlt, 
  FaPassport, 
  FaCalendarCheck,
  FaUserTie,
  FaPhoneAlt,
  FaPaperPlane,
  FaStar
} from 'react-icons/fa';
import styles from './Concierge.module.css';

const Concierge = () => {
  const [activeService, setActiveService] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Custom Request',
    message: '',
    priority: 'standard'
  });
  
  // Animation on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleServiceChange = (service) => {
    setActiveService(service);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the request to backend
    alert('Your concierge request has been received. An elite concierge specialist will contact you shortly.');
  };

  // Concierge services data
  const services = [
    {
      id: 'travel-planning',
      name: 'Personalized Travel Planning',
      icon: <FaCalendarCheck />,
      description: 'Customized itineraries crafted by experts who understand your preferences and travel style.',
      features: [
        'Bespoke itinerary creation',
        'Destination expertise and insider knowledge',
        'Seamless multi-destination planning',
        'Special interest journeys (culinary, wellness, adventure)'
      ]
    },
    {
      id: 'airport',
      name: 'VIP Airport Experience',
      icon: <FaPassport />,
      description: 'Bypass the ordinary airport experience with expedited services and exclusive lounges.',
      features: [
        'Fast-track security and immigration',
        'Private airport transfers',
        'Premium lounge access worldwide',
        'Meet & greet service with porter assistance'
      ]
    },
    {
      id: 'transportation',
      name: 'Luxury Transportation',
      icon: <FaCar />,
      description: 'Travel in style with premium vehicles and chauffeurs at your service 24/7.',
      features: [
        'Luxury sedans, SUVs, and sports cars',
        'Private jet and helicopter charters',
        'Yacht rentals and private cruises',
        'Chauffeur services with expert local drivers'
      ]
    },
    {
      id: 'dining',
      name: 'Fine Dining Access',
      icon: <FaUtensils />,
      description: 'Secure reservations at the world\'s most exclusive restaurants with added VIP benefits.',
      features: [
        'Reservations at Michelin-starred restaurants',
        'Private chef experiences in your accommodation',
        'Special chef\'s table experiences',
        'Exclusive wine tastings and foodie tours'
      ]
    },
    {
      id: 'experiences',
      name: 'Exclusive Experiences',
      icon: <FaGlassMartiniAlt />,
      description: 'Gain access to once-in-a-lifetime experiences not available to the general public.',
      features: [
        'Private museum tours before/after hours',
        'Exclusive cultural performances',
        'Celebrity meet and greets',
        'Unique local experiences with expert guides'
      ]
    },
    {
      id: 'events',
      name: 'VIP Event Access',
      icon: <FaTicketAlt />,
      description: 'Premium tickets and exclusive access to prestigious global events.',
      features: [
        'Front-row seats at fashion shows',
        'VIP sports packages (Formula 1, Grand Slam tennis)',
        'Red carpet events and film premieres',
        'Festival VIP passes and backstage access'
      ]
    },
    {
      id: 'beach',
      name: 'Beach & Resort Privileges',
      icon: <FaUmbrella />,
      description: 'Enhanced beach and resort experiences with premium amenities and privileges.',
      features: [
        'Reserved beachfront cabanas',
        'Priority spa appointments',
        'Special welcome amenities',
        'Room upgrades and late check-out privileges'
      ]
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Alexandra H.',
      location: 'New York',
      text: 'The concierge team arranged an after-hours tour of the Louvre that was magical. Every detail of our Paris trip was handled with exceptional care.',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 5
    },
    {
      id: 2,
      name: 'James W.',
      location: 'London',
      text: 'From securing last-minute reservations at the most exclusive restaurants in Tokyo to arranging a private tea ceremony, the concierge service exceeded all expectations.',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 5
    },
    {
      id: 3,
      name: 'Sophia L.',
      location: 'Dubai',
      text: 'My family was treated like royalty from the moment we stepped off the plane. The yacht day arranged for us in the Maldives was unforgettable.',
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      rating: 5
    }
  ];

  return (
    <div className={styles.conciergeContainer}>
      {/* Luxury Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroText} ${isLoaded ? styles.loaded : ''}`}>
            <h1>Elite Concierge Services</h1>
            <p>Extraordinary experiences curated exclusively for our distinguished clientele</p>
            <div className={styles.eliteBadgeHero}>ELITE MEMBERSHIP</div>
          </div>
        </div>
        <div className={styles.heroDivider}></div>
      </div>

      {/* Service Overview Section */}
      <div className={styles.overviewSection}>
        <div className={styles.sectionIntro}>
          <div className={styles.sectionIcon}><FaConciergeBell /></div>
          <h2>Your Personal Luxury Assistant</h2>
          <p>Our elite concierge team provides unparalleled service, transforming ordinary moments into extraordinary memories. Available 24/7 to fulfill your requests, no matter how unique.</p>
        </div>
        
        <div className={styles.serviceNavigation}>
          <button 
            className={`${styles.serviceTab} ${activeService === 'overview' ? styles.activeTab : ''}`}
            onClick={() => handleServiceChange('overview')}
          >
            All Services
          </button>
          {services.map((service) => (
            <button 
              key={service.id}
              className={`${styles.serviceTab} ${activeService === service.id ? styles.activeTab : ''}`}
              onClick={() => handleServiceChange(service.id)}
            >
              <span className={styles.tabIcon}>{service.icon}</span>
              <span className={styles.tabText}>{service.name}</span>
            </button>
          ))}
        </div>
        
        {/* Service Details */}
        <div className={styles.serviceDetails}>
          {activeService === 'overview' ? (
            <div className={styles.serviceGrid}>
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className={styles.serviceCard}
                  onClick={() => handleServiceChange(service.id)}
                >
                  <div className={styles.serviceIconContainer}>
                    {service.icon}
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button className={styles.learnMoreBtn}>Learn More</button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.serviceDetailView}>
              {services.filter(s => s.id === activeService).map((service) => (
                <div key={service.id} className={styles.detailContent}>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailIcon}>{service.icon}</div>
                    <div>
                      <h2>{service.name}</h2>
                      <p className={styles.detailDescription}>{service.description}</p>
                    </div>
                  </div>
                  
                  <div className={styles.detailFeatures}>
                    <h3>Exclusive Benefits</h3>
                    <ul>
                      {service.features.map((feature, index) => (
                        <li key={index}>
                          <span className={styles.checkmark}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.detailAction}>
                    <p>Request this service now or contact our elite concierge team for customized arrangements.</p>
                    <button className={styles.requestServiceBtn} onClick={() => {
                      setFormData({...formData, service: service.name});
                      document.getElementById('requestForm').scrollIntoView({behavior: 'smooth'});
                    }}>
                      Request This Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className={styles.testimonialsSection}>
        <h2>What Our Elite Members Say</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className={styles.testimonialAvatar} 
                />
                <div>
                  <h3>{testimonial.name}</h3>
                  <p className={styles.testimonialLocation}>{testimonial.location}</p>
                  <div className={styles.testimonialRating}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < testimonial.rating ? styles.starFilled : styles.starEmpty} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Request Form Section */}
      <div id="requestForm" className={styles.requestSection}>
        <div className={styles.requestContainer}>
          <div className={styles.requestIntro}>
            <h2>Request Elite Concierge Assistance</h2>
            <p>Our dedicated team is standing by to fulfill your request with discretion and attention to detail.</p>
          </div>
          
          <form className={styles.requestForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <div className={styles.inputWithIcon}>
                  <FaUserTie className={styles.inputIcon} />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <div className={styles.inputWithIcon}>
                  <FaPaperPlane className={styles.inputIcon} />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="Your email address" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <div className={styles.inputWithIcon}>
                  <FaPhoneAlt className={styles.inputIcon} />
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Your contact number" 
                    required 
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Service Required</label>
                <select 
                  name="service" 
                  value={formData.service} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="Custom Request">Custom Request</option>
                  {services.map(service => (
                    <option key={service.id} value={service.name}>{service.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Your Request Details</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                placeholder="Please provide details about your request or special requirements" 
                rows="4" 
                required
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label>Request Priority</label>
              <div className={styles.priorityOptions}>
                <div 
                  className={`${styles.priorityOption} ${formData.priority === 'standard' ? styles.selectedPriority : ''}`}
                  onClick={() => setFormData({...formData, priority: 'standard'})}
                >
                  <span className={styles.priorityName}>Standard</span>
                  <span className={styles.priorityDescription}>Response within 24 hours</span>
                </div>
                <div 
                  className={`${styles.priorityOption} ${formData.priority === 'urgent' ? styles.selectedPriority : ''}`}
                  onClick={() => setFormData({...formData, priority: 'urgent'})}
                >
                  <span className={styles.priorityName}>Urgent</span>
                  <span className={styles.priorityDescription}>Response within 6 hours</span>
                </div>
                <div 
                  className={`${styles.priorityOption} ${formData.priority === 'immediate' ? styles.selectedPriority : ''}`}
                  onClick={() => setFormData({...formData, priority: 'immediate'})}
                >
                  <span className={styles.priorityName}>Immediate</span>
                  <span className={styles.priorityDescription}>Response within 1 hour</span>
                </div>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitRequestBtn}>
                Submit Concierge Request
              </button>
              <p className={styles.privacyNote}>Your request will be handled with the utmost discretion and privacy.</p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Membership Section */}
      <div className={styles.membershipSection}>
        <div className={styles.membershipContent}>
          <h2>Elite Concierge Membership</h2>
          <p>Upgrade to our Elite Concierge Membership for unlimited access to our premium services and exclusive benefits worldwide.</p>
          
          <div className={styles.membershipBenefits}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>24/7</div>
              <div className={styles.benefitText}>
                <h3>Round-the-clock Service</h3>
                <p>Access to dedicated concierge specialists anytime, anywhere in the world</p>
              </div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>VIP</div>
              <div className={styles.benefitText}>
                <h3>Priority Access</h3>
                <p>Exclusive reservations and priority booking at partner establishments</p>
              </div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>1:1</div>
              <div className={styles.benefitText}>
                <h3>Personal Concierge</h3>
                <p>Dedicated specialist who understands your preferences</p>
              </div>
            </div>
          </div>
          
          <button className={styles.membershipBtn}>
            Learn About Elite Membership
          </button>
        </div>
      </div>
      
      {/* Global Contacts */}
      <div className={styles.globalContactsSection}>
        <h2>Global Concierge Contacts</h2>
        <div className={styles.contactsGrid}>
          <div className={styles.contactCard}>
            <h3>New York</h3>
            <p className={styles.contactPhone}>+1 (212) 555-8000</p>
            <p className={styles.contactEmail}>newyork.concierge@skyjourney.com</p>
          </div>
          <div className={styles.contactCard}>
            <h3>London</h3>
            <p className={styles.contactPhone}>+44 20 7946 0300</p>
            <p className={styles.contactEmail}>london.concierge@skyjourney.com</p>
          </div>
          <div className={styles.contactCard}>
            <h3>Dubai</h3>
            <p className={styles.contactPhone}>+971 4 440 9000</p>
            <p className={styles.contactEmail}>dubai.concierge@skyjourney.com</p>
          </div>
          <div className={styles.contactCard}>
            <h3>Tokyo</h3>
            <p className={styles.contactPhone}>+81 3 6721 5000</p>
            <p className={styles.contactEmail}>tokyo.concierge@skyjourney.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concierge;