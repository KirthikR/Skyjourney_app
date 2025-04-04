import React, { useState, useEffect } from 'react';
import styles from './ConsentBanner.module.css';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('analytics_consent');
    if (!hasConsent) {
      setShowBanner(true);
    } else if (hasConsent === 'true' && window.posthog) {
      // If user previously consented, enable session recordings
      window.posthog.opt_in_capturing();
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'true');
    
    if (window.posthog) {
      window.posthog.opt_in_capturing();
    }
    
    setShowBanner(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'false');
    
    if (window.posthog) {
      window.posthog.opt_out_capturing();
    }
    
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className={styles.consentBanner}>
      <div className={styles.consentContent}>
        <h3>We Value Your Privacy</h3>
        <p>
          We use cookies and session recording to enhance your experience and analyze our website traffic.
          This helps us improve SkyJourney by understanding how you interact with our services.
        </p>
        <div className={styles.consentButtons}>
          <button 
            className={`${styles.consentButton} ${styles.acceptButton}`}
            onClick={handleAccept}
          >
            Accept
          </button>
          <button 
            className={`${styles.consentButton} ${styles.declineButton}`}
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;