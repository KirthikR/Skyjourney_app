import { useState, useEffect } from 'react';
import posthog from 'posthog-js';

const useFeatureFlag = (flagName, defaultValue = false) => {
  const [enabled, setEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let checkAttempts = 0;
    const maxAttempts = 10;
    
    const checkFlag = () => {
      if (!mounted) return false;
      
      try {
        // Are feature flags loaded?
        if (typeof posthog !== 'undefined' && 
            posthog && 
            typeof posthog.isFeatureEnabled === 'function') {
          
          const isEnabled = posthog.isFeatureEnabled(flagName);
          console.log(`Feature flag check: ${flagName} = ${isEnabled}`);
          
          // Only update if we got a non-null value
          if (isEnabled !== null) {
            setEnabled(isEnabled);
            setLoading(false);
            return true; // Successfully checked
          }
        }
        
        return false; // Not ready yet
      } catch (error) {
        console.error(`Error checking feature flag ${flagName}:`, error);
        return false;
      }
    };
    
    // First immediate check
    const success = checkFlag();
    
    // If not successful, try with increasing delays
    if (!success && checkAttempts < maxAttempts) {
      const attemptCheck = () => {
        checkAttempts++;
        if (checkFlag() || checkAttempts >= maxAttempts) {
          // Either succeeded or reached max attempts
          if (checkAttempts >= maxAttempts) {
            console.warn(`Max attempts reached for feature flag ${flagName}, using default`);
            setEnabled(defaultValue);
            setLoading(false);
          }
        } else {
          // Try again with exponential backoff
          const delay = Math.min(1000 * Math.pow(1.5, checkAttempts), 10000);
          setTimeout(attemptCheck, delay);
        }
      };
      
      // Start the retry process
      setTimeout(attemptCheck, 500);
    }
    
    // Long-term polling for updates
    const interval = setInterval(checkFlag, 300000); // 5 minutes
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [flagName, defaultValue]);

  return { enabled, loading };
};

export default useFeatureFlag;