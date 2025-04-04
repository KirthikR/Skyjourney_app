import posthog from 'posthog-js';

// Single PostHog initialization function
export const initPostHog = () => {
  // Use environment variables instead of hardcoded values
  const POSTHOG_API_KEY = 'phc_kuNwiigDkKvSfjJKh5mkOSv6peRG38ChQarzZy1kMoA';
  const POSTHOG_HOST = 'https://eu.i.posthog.com';
  
  // Only initialize if not already done
  if (!window.posthogInitialized) {
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      autocapture: {
        element_allowlist: ['button', 'form', 'input', 'select', 'textarea', 'a']
      },
      // Enable detailed session replay
      session_recording: {
        enabled: true,
        maskAllInputs: true,
        maskAllText: false,
        recordCanvas: false,
        sampleRate: 1.0 // Record 100% of sessions
      },
      loaded: function(loadedPosthog) {
        window.posthog = loadedPosthog;
        window.posthogInitialized = true;
        console.log('✅ PostHog initialized with session recording');
      }
    });
  }
  
  return posthog;
};

// Enhanced tracking functions
export const trackPageView = (pageName) => {
  try {
    posthog.capture('page_viewed', {
      page_name: pageName,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Generic event tracking function (add this after trackPageView)
export const trackEvent = (eventName, properties = {}) => {
  try {
    const eventProperties = {
      ...properties,
      timestamp: new Date().toISOString()
    };
    
    posthog.capture(eventName, eventProperties);
    console.log(`Event tracked: ${eventName}`, eventProperties);
  } catch (error) {
    console.error(`Failed to track event ${eventName}:`, error);
  }
};

// Define booking funnel events
export const BOOKING_EVENTS = {
  SEARCH_INITIATED: 'booking_search_initiated',
  SEARCH_RESULTS_VIEWED: 'booking_search_results_viewed',
  FLIGHT_SELECTED: 'booking_flight_selected',
  PASSENGER_INFO_ENTERED: 'booking_passenger_info_entered',
  PAYMENT_INITIATED: 'booking_payment_initiated',
  PAYMENT_COMPLETED: 'booking_payment_completed',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_ABANDONED: 'booking_abandoned',
  ITINERARY_MODIFIED: 'itinerary_modified'
};

// Track specific booking funnel events
export const trackBookingEvent = (eventName, properties = {}) => {
  try {
    // Add current step in funnel
    const eventProperties = {
      ...properties,
      timestamp: new Date().toISOString()
    };
    
    // If this is a funnel event, add the funnel name
    if (Object.values(BOOKING_EVENTS).includes(eventName)) {
      eventProperties.funnel = 'booking_flow';
    }
    
    posthog.capture(eventName, eventProperties);
    console.log(`Event tracked: ${eventName}`, eventProperties);
  } catch (error) {
    console.error(`Failed to track event ${eventName}:`, error);
  }
};

// Identify users for segmentation
export const identifyUser = (userId, traits = {}) => {
  try {
    // Add common user properties that are useful for segmentation
    const enhancedTraits = {
      ...traits,
      lastActive: new Date().toISOString(),
      appVersion: '1.0.0',
      platform: 'web'
    };
    
    posthog.identify(userId, enhancedTraits);
    console.log(`User identified: ${userId}`, enhancedTraits);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
};

export default { initPostHog, trackPageView, trackEvent, trackBookingEvent, identifyUser };