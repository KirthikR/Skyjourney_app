import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaPaperPlane, FaStar, FaRegStar, 
  FaComments, FaCheck, FaCamera, FaSmile, 
  FaMeh, FaFrown, FaChevronRight
} from 'react-icons/fa';
import styles from './FeedbackWidget.module.css';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Types of feedback
  const feedbackTypes = [
    { id: 'ui', label: 'Website Experience', icon: <FaSmile /> },
    { id: 'booking', label: 'Booking Process', icon: <FaComments /> },
    { id: 'service', label: 'Customer Service', icon: <FaCheck /> },
    { id: 'suggestion', label: 'Suggestions', icon: <FaChevronRight /> }
  ];

  const toggleFeedback = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
        // Reset form after closing
        if (submitted) {
          setStep(1);
          setRating(0);
          setFeedbackType('');
          setComment('');
          setEmail('');
          setSubmitted(false);
        }
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, feedbackType, comment, email });
    
    // Show success animation
    setSubmitted(true);
    
    // In a real app, you would send this data to your backend
    // For now, we'll just simulate a submission
    setTimeout(() => {
      toggleFeedback();
    }, 3000);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) toggleFeedback();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className={styles.feedbackButton}
        onClick={toggleFeedback}
        aria-label="Give Feedback"
      >
        <span className={styles.feedbackButtonText}>Feedback</span>
      </button>

      {(isOpen || isAnimating) && (
        <div className={`${styles.feedbackOverlay} ${isAnimating ? styles.closing : ''}`}>
          <div className={styles.feedbackModal}>
            <button 
              className={styles.closeButton} 
              onClick={toggleFeedback}
            >
              <FaTimes />
            </button>
            
            {!submitted ? (
              <div className={styles.feedbackContent}>
                <div className={styles.feedbackHeader}>
                  <h2>We Value Your Feedback</h2>
                  <p>Help us improve your SkyJourney experience</p>
                  
                  <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}></div>
                    <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}></div>
                    <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}></div>
                  </div>
                </div>

                <div className={styles.feedbackBody}>
                  {step === 1 && (
                    <div className={styles.ratingStep}>
                      <h3>How would you rate your experience?</h3>
                      <div className={styles.starRating}>
                        {[...Array(5)].map((_, index) => {
                          const starValue = index + 1;
                          return (
                            <span 
                              key={index}
                              className={styles.starContainer}
                              onClick={() => setRating(starValue)}
                              onMouseEnter={() => setHoverRating(starValue)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              {starValue <= (hoverRating || rating) ? 
                                <FaStar className={styles.starFilled} /> : 
                                <FaRegStar className={styles.starEmpty} />
                              }
                            </span>
                          );
                        })}
                      </div>
                      <div className={styles.ratingLabels}>
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className={styles.typeStep}>
                      <h3>What would you like to share feedback about?</h3>
                      <div className={styles.feedbackTypeGrid}>
                        {feedbackTypes.map(type => (
                          <div 
                            key={type.id}
                            className={`${styles.feedbackTypeCard} ${feedbackType === type.id ? styles.selected : ''}`}
                            onClick={() => setFeedbackType(type.id)}
                          >
                            <div className={styles.typeIcon}>{type.icon}</div>
                            <span>{type.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className={styles.detailsStep}>
                      <h3>Please share your thoughts</h3>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us more about your experience or suggestion..."
                        className={styles.commentField}
                        rows="4"
                      />
                      
                      <div className={styles.attachmentOption}>
                        <button className={styles.attachButton}>
                          <FaCamera /> Attach Screenshot
                        </button>
                        <span className={styles.attachHint}>Optional</span>
                      </div>
                      
                      <div className={styles.emailField}>
                        <label htmlFor="feedback-email">Email (optional)</label>
                        <input
                          id="feedback-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="For us to follow up if needed"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.feedbackFooter}>
                  {step > 1 && (
                    <button 
                      className={styles.prevButton}
                      onClick={prevStep}
                    >
                      Back
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button 
                      className={styles.nextButton}
                      onClick={nextStep}
                      disabled={(step === 1 && rating === 0) || (step === 2 && !feedbackType)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button 
                      className={styles.submitButton}
                      onClick={handleSubmit}
                      disabled={!comment.trim()}
                    >
                      <FaPaperPlane className={styles.submitIcon} />
                      Submit Feedback
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${styles.successMessage} ${submitted ? styles.show : ''}`}>
                <div className={styles.successIcon}>
                  <FaCheck />
                </div>
                <h2>Thank you for your feedback!</h2>
                <p>We appreciate you taking the time to share your thoughts.</p>
                {rating >= 4 && (
                  <div className={styles.loyaltyBonus}>
                    <h3>You've earned 100 SkyPoints!</h3>
                    <p>Added to your SkyJourney loyalty account</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;