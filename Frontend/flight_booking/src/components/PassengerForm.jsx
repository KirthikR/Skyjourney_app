import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaIdCard, FaPassport, FaPhone, FaEnvelope, 
  FaBirthdayCake, FaPlane, FaUtensils, FaWheelchair, 
  FaSuitcase, FaQuestionCircle, FaChevronDown, FaCheck 
} from 'react-icons/fa';
import styles from './PassengerForm.module.css';

const PassengerForm = ({ index, passengerType, onChange, value = {} }) => {
  const [expanded, setExpanded] = useState({
    basic: true,
    travel: false,
    preferences: false
  });
  const [isValid, setIsValid] = useState({});
  const [focused, setFocused] = useState({});

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };

  const handleChange = (field, value) => {
    let isFieldValid = true;
    
    // Basic validation
    if (field === 'email' && value) {
      isFieldValid = /^\S+@\S+\.\S+$/.test(value);
    } else if (field === 'phone' && value) {
      isFieldValid = /^\+?[0-9\s\-]{8,15}$/.test(value);
    }

    // Age validation for passenger types
    if (field === 'born_on') {
      const age = calculateAge(new Date(value));
      if (passengerType === 'adult' && age < 16) {
        isFieldValid = false;
      } else if (passengerType === 'child' && (age < 2 || age > 16)) {
        isFieldValid = false;
      } else if (passengerType === 'infant' && age > 2) {
        isFieldValid = false;
      }
    }

    // Update validation state
    setIsValid(prev => ({ ...prev, [field]: isFieldValid }));
    
    // Call parent onChange
    onChange(index, field, value);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPassengerTypeLabel = () => {
    switch(passengerType) {
      case 'adult': return 'Adult (16+ years)';
      case 'child': return 'Child (2-15 years)';
      case 'infant': return 'Infant (0-23 months)';
      default: return 'Passenger';
    }
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFocus = (field) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused(prev => ({ ...prev, [field]: false }));
  };

  const getAgeRestrictionText = () => {
    switch(passengerType) {
      case 'adult': return '16+ years';
      case 'child': return '2-15 years';
      case 'infant': return '0-23 months';
      default: return '';
    }
  };

  return (
    <motion.div 
      className={styles.passengerCard}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <div className={styles.passengerHeader}>
        <div className={styles.passengerIcon}>
          <FaUser />
        </div>
        <h3>
          <span className={styles.passengerIndex}>{index + 1}</span>
          <span className={styles.passengerTypeLabel}>{getPassengerTypeLabel()}</span>
        </h3>
        <div className={styles.headerBadge}>
          {passengerType === 'adult' && 'Primary'}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className={styles.formSection}>
        <div 
          className={styles.sectionHeader} 
          onClick={() => toggleSection('basic')}
        >
          <h4>
            <FaIdCard className={styles.sectionIcon} />
            Personal Information
          </h4>
          <motion.div 
            animate={{ rotate: expanded.basic ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded.basic && (
            <motion.div 
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={styles.sectionContent}
            >
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>
                    Title<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputContainer} ${focused.title ? styles.focused : ''}`}>
                    <select 
                      value={value.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      onFocus={() => handleFocus('title')}
                      onBlur={() => handleBlur('title')}
                      required
                    >
                      <option value="">Select</option>
                      <option value="mr">Mr</option>
                      <option value="mrs">Mrs</option>
                      <option value="ms">Ms</option>
                      <option value="miss">Miss</option>
                      <option value="dr">Dr</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label>
                    First Name<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputContainer} ${focused.given_name ? styles.focused : ''}`}>
                    <input 
                      type="text" 
                      value={value.given_name || ''}
                      onChange={(e) => handleChange('given_name', e.target.value)}
                      onFocus={() => handleFocus('given_name')}
                      onBlur={() => handleBlur('given_name')}
                      placeholder="First name as per ID"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label>
                    Last Name<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputContainer} ${focused.family_name ? styles.focused : ''}`}>
                    <input 
                      type="text" 
                      value={value.family_name || ''}
                      onChange={(e) => handleChange('family_name', e.target.value)}
                      onFocus={() => handleFocus('family_name')}
                      onBlur={() => handleBlur('family_name')}
                      placeholder="Last name as per ID"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>
                    <div className={styles.labelWithTooltip}>
                      Date of Birth<span className={styles.required}>*</span>
                      <div className={styles.tooltip}>
                        <FaQuestionCircle />
                        <span className={styles.tooltipText}>
                          {getAgeRestrictionText()}
                        </span>
                      </div>
                    </div>
                  </label>
                  <div className={`${styles.inputContainer} ${focused.born_on ? styles.focused : ''} ${isValid.born_on === false ? styles.invalid : ''}`}>
                    <FaBirthdayCake className={styles.inputIcon} />
                    <input 
                      type="date" 
                      value={value.born_on || ''}
                      onChange={(e) => handleChange('born_on', e.target.value)}
                      onFocus={() => handleFocus('born_on')}
                      onBlur={() => handleBlur('born_on')}
                      required
                    />
                  </div>
                  {isValid.born_on === false && (
                    <div className={styles.errorMessage}>
                      Invalid date of birth for {passengerType} passenger
                    </div>
                  )}
                </div>
                
                <div className={styles.formField}>
                  <label>
                    Gender<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputContainer} ${focused.gender ? styles.focused : ''}`}>
                    <select 
                      value={value.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      onFocus={() => handleFocus('gender')}
                      onBlur={() => handleBlur('gender')}
                      required
                    >
                      <option value="">Select</option>
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="o">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Email Address</label>
                  <div className={`${styles.inputContainer} ${focused.email ? styles.focused : ''} ${isValid.email === false ? styles.invalid : ''}`}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input 
                      type="email" 
                      value={value.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      placeholder="Email address"
                    />
                  </div>
                  {isValid.email === false && (
                    <div className={styles.errorMessage}>
                      Please enter a valid email address
                    </div>
                  )}
                </div>
                
                <div className={styles.formField}>
                  <label>Phone Number</label>
                  <div className={`${styles.inputContainer} ${focused.phone ? styles.focused : ''} ${isValid.phone === false ? styles.invalid : ''}`}>
                    <FaPhone className={styles.inputIcon} />
                    <input 
                      type="tel" 
                      value={value.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onFocus={() => handleFocus('phone')}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                  {isValid.phone === false && (
                    <div className={styles.errorMessage}>
                      Please enter a valid phone number
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Travel Document Section */}
      <div className={styles.formSection}>
        <div 
          className={styles.sectionHeader} 
          onClick={() => toggleSection('travel')}
        >
          <h4>
            <FaPassport className={styles.sectionIcon} />
            Travel Documents
          </h4>
          <motion.div 
            animate={{ rotate: expanded.travel ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded.travel && (
            <motion.div 
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={styles.sectionContent}
            >
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Document Type</label>
                  <div className={`${styles.inputContainer} ${focused.document_type ? styles.focused : ''}`}>
                    <select 
                      value={value.document_type || ''}
                      onChange={(e) => handleChange('document_type', e.target.value)}
                      onFocus={() => handleFocus('document_type')}
                      onBlur={() => handleBlur('document_type')}
                    >
                      <option value="">Select</option>
                      <option value="passport">Passport</option>
                      <option value="id_card">ID Card</option>
                      <option value="drivers_license">Driver's License</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label>Document Number</label>
                  <div className={`${styles.inputContainer} ${focused.document_number ? styles.focused : ''}`}>
                    <input 
                      type="text" 
                      value={value.document_number || ''}
                      onChange={(e) => handleChange('document_number', e.target.value)}
                      onFocus={() => handleFocus('document_number')}
                      onBlur={() => handleBlur('document_number')}
                      placeholder="Document number"
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Issuing Country</label>
                  <div className={`${styles.inputContainer} ${focused.document_country ? styles.focused : ''}`}>
                    <select 
                      value={value.document_country || ''}
                      onChange={(e) => handleChange('document_country', e.target.value)}
                      onFocus={() => handleFocus('document_country')}
                      onBlur={() => handleBlur('document_country')}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      {/* More countries would be added here */}
                    </select>
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label>Expiry Date</label>
                  <div className={`${styles.inputContainer} ${focused.document_expiry ? styles.focused : ''}`}>
                    <input 
                      type="date" 
                      value={value.document_expiry || ''}
                      onChange={(e) => handleChange('document_expiry', e.target.value)}
                      onFocus={() => handleFocus('document_expiry')}
                      onBlur={() => handleBlur('document_expiry')}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.formField}>
                <label>Frequent Flyer Number</label>
                <div className={`${styles.inputContainer} ${focused.frequent_flyer ? styles.focused : ''}`}>
                  <FaPlane className={styles.inputIcon} />
                  <input 
                    type="text" 
                    value={value.frequent_flyer || ''}
                    onChange={(e) => handleChange('frequent_flyer', e.target.value)}
                    onFocus={() => handleFocus('frequent_flyer')}
                    onBlur={() => handleBlur('frequent_flyer')}
                    placeholder="Airline program number (optional)"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preferences Section */}
      <div className={styles.formSection}>
        <div 
          className={styles.sectionHeader} 
          onClick={() => toggleSection('preferences')}
        >
          <h4>
            <FaUtensils className={styles.sectionIcon} />
            Travel Preferences
          </h4>
          <motion.div 
            animate={{ rotate: expanded.preferences ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded.preferences && (
            <motion.div 
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={styles.sectionContent}
            >
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Meal Preference</label>
                  <div className={`${styles.inputContainer} ${focused.meal_preference ? styles.focused : ''}`}>
                    <select 
                      value={value.meal_preference || ''}
                      onChange={(e) => handleChange('meal_preference', e.target.value)}
                      onFocus={() => handleFocus('meal_preference')}
                      onBlur={() => handleBlur('meal_preference')}
                    >
                      <option value="">Regular Meal</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="diabetic">Diabetic</option>
                      <option value="kosher">Kosher</option>
                      <option value="halal">Halal</option>
                      <option value="gluten_free">Gluten Free</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formField}>
                  <label>Seat Preference</label>
                  <div className={`${styles.inputContainer} ${focused.seat_preference ? styles.focused : ''}`}>
                    <select 
                      value={value.seat_preference || ''}
                      onChange={(e) => handleChange('seat_preference', e.target.value)}
                      onFocus={() => handleFocus('seat_preference')}
                      onBlur={() => handleBlur('seat_preference')}
                    >
                      <option value="">No Preference</option>
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="middle">Middle</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Special Assistance</label>
                  <div className={`${styles.checkboxes}`}>
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={value.wheelchair || false}
                        onChange={(e) => handleChange('wheelchair', e.target.checked)}
                      />
                      <FaWheelchair /> Wheelchair assistance
                    </label>
                    
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={value.special_meal || false}
                        onChange={(e) => handleChange('special_meal', e.target.checked)}
                      />
                      <FaUtensils /> Special meal requirements
                    </label>
                    
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={value.extra_baggage || false}
                        onChange={(e) => handleChange('extra_baggage', e.target.checked)}
                      />
                      <FaSuitcase /> Extra baggage
                    </label>
                  </div>
                </div>
              </div>
              
              {value.special_meal && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.formField}
                >
                  <label>Special Meal Requirements</label>
                  <div className={`${styles.inputContainer} ${focused.meal_notes ? styles.focused : ''}`}>
                    <textarea 
                      value={value.meal_notes || ''}
                      onChange={(e) => handleChange('meal_notes', e.target.value)}
                      onFocus={() => handleFocus('meal_notes')}
                      onBlur={() => handleBlur('meal_notes')}
                      placeholder="Please describe any special dietary requirements"
                      rows="3"
                    ></textarea>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form validation status indicator */}
      <motion.div 
        className={styles.completionStatus}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.statusIcon}>
          {Object.values(isValid).every(Boolean) && 
           value.given_name && 
           value.family_name && 
           value.born_on && 
           value.gender ? (
            <FaCheck className={styles.validIcon} />
          ) : (
            <span className={styles.incompleteIcon}>!</span>
          )}
        </div>
        <div className={styles.statusText}>
          {Object.values(isValid).every(Boolean) && 
           value.given_name && 
           value.family_name && 
           value.born_on && 
           value.gender ? (
            "Passenger details complete"
          ) : (
            "Required fields incomplete"
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PassengerForm;