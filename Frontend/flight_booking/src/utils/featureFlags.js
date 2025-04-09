import posthog from 'posthog-js';

export const isFeatureEnabled = (flagName, defaultValue = false) => {
  try {
    // Check if posthog is properly loaded and has feature flags initialized
    if (typeof posthog !== 'undefined' && 
        posthog && 
        typeof posthog.isFeatureEnabled === 'function') {
      return posthog.isFeatureEnabled(flagName) || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error checking feature flag ${flagName}:`, error);
    return defaultValue;
  }
};

// For testing and development
export const overrideFeatureFlag = (flagName, value) => {
  if (process.env.NODE_ENV !== 'production' && 
      typeof posthog !== 'undefined' && 
      posthog && 
      typeof posthog.featureFlags !== 'undefined') {
    posthog.featureFlags.override({[flagName]: value});
    console.log(`Feature flag ${flagName} overridden to ${value}`);
  }
};