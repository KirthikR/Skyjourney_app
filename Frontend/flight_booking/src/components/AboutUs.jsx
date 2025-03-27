import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.aboutUsPage}>
      <div className={styles.aboutHero}>
        <div className={styles.aboutHeroOverlay}></div>
        <div className={styles.aboutHeroContent}>
          <h1>About SkyJourney</h1>
          <div className={styles.heroAccent}></div>
          <p>Redefining the way the world travels since 2020</p>
        </div>
      </div>
      
      <div className={styles.aboutContainer}>
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <h2>Our Mission</h2>
            <div className={styles.sectionAccent}></div>
            <p>
              At SkyJourney, we're dedicated to transforming travel booking from a tedious task into a seamless experience that inspires wanderlust. Our mission is to connect travelers with exceptional flight options while providing transparency, reliability, and personalized service that exceeds expectations.
            </p>
            <p>
              We combine cutting-edge technology with human expertise to create a booking platform that understands your needs before you even express them. Every feature we develop, every partnership we forge, and every service we offer is designed with one goal in mind: to make your journey extraordinary from the moment you start planning.
            </p>
          </div>
          <div className={styles.missionImage}>
            <img src="https://images.unsplash.com/photo-1576153192621-7a3be10b356e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="SkyJourney Mission" />
          </div>
        </section>
        
        <section className={styles.statsSection}>
          <div className={styles.statsWrapper}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1200+</span>
              <span className={styles.statLabel}>Airline Partners</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>190</span>
              <span className={styles.statLabel}>Countries Covered</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15M+</span>
              <span className={styles.statLabel}>Happy Travelers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Customer Support</span>
            </div>
          </div>
        </section>
        
        <section className={styles.storySection}>
          <h2>Our Story</h2>
          <div className={styles.sectionAccent}></div>
          <div className={styles.storyContent}>
            <p>
              Founded in 2020 by a team of travel enthusiasts and tech innovators, SkyJourney emerged from a shared frustration with existing flight booking platforms. What began as a modest startup with ambitious dreams has rapidly evolved into one of the industry's most respected names.
            </p>
            <p>
              Our journey hasn't been without turbulence. Launching amid a global pandemic that brought travel to a standstill, we pivoted to focus on building robust technology and establishing airline partnerships. As travel restrictions lifted, we were perfectly positioned to offer travelers the reliable, transparent service they had been missing.
            </p>
            <p>
              Today, with offices in San Francisco, Singapore, and London, our diverse team of over 500 professionals continues to push boundaries. We've been recognized with numerous industry awards, including "Best Travel Booking Innovation" (2022) and "Outstanding Customer Experience" (2023).
            </p>
          </div>
          
          <div className={styles.timelineSection}>
            <h3>Our Journey</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2020</div>
                <div className={styles.timelineContent}>
                  <h4>Foundation</h4>
                  <p>SkyJourney is founded with seed funding of $3M</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2021</div>
                <div className={styles.timelineContent}>
                  <h4>Beta Launch</h4>
                  <p>First version of our platform launched with 200 airline partners</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2022</div>
                <div className={styles.timelineContent}>
                  <h4>Expansion</h4>
                  <p>Series A funding of $18M and expansion to Asian markets</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2023</div>
                <div className={styles.timelineContent}>
                  <h4>Innovation</h4>
                  <p>Launch of AI-powered recommendation engine and price predictor</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineDate}>2024</div>
                <div className={styles.timelineContent}>
                  <h4>Today</h4>
                  <p>Over 15 million users and counting</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.valuesSection}>
          <h2>Our Values</h2>
          <div className={styles.sectionAccent}></div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Integrity</h3>
              <p>We believe in complete transparency with our customers, partners, and within our team. No hidden fees, no misleading offers.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>We continuously push the boundaries of what's possible in travel technology to create solutions that anticipate customer needs.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Inclusivity</h3>
              <p>We celebrate diversity in our team and design our platform to be accessible and useful for travelers from all walks of life.</p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Sustainability</h3>
              <p>We're committed to reducing the environmental impact of travel through carbon offset programs and partnerships with eco-conscious airlines.</p>
            </div>
          </div>
        </section>
        
        <section className={styles.teamSection}>
          <h2>Leadership Team</h2>
          <div className={styles.sectionAccent}></div>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" alt="CEO" />
              </div>
              <h3>Michael Chen</h3>
              <p className={styles.teamMemberRole}>Chief Executive Officer</p>
              <p>Former VP at Expedia with 15+ years in travel tech</p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" alt="CTO" />
              </div>
              <h3>Sarah Johnson</h3>
              <p className={styles.teamMemberRole}>Chief Technology Officer</p>
              <p>AI specialist with background from Google and MIT</p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" alt="COO" />
              </div>
              <h3>Marcus Williams</h3>
              <p className={styles.teamMemberRole}>Chief Operations Officer</p>
              <p>20+ years optimizing operations at major airlines</p>
            </div>
          </div>
        </section>
        
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Experience the SkyJourney Difference</h2>
            <p>Ready to transform how you travel? Join our 15 million satisfied customers and discover why SkyJourney is the preferred choice for discerning travelers worldwide.</p>
            <Link to="/booking" className={styles.ctaButton}>Book Your Journey</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;