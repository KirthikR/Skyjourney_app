import posthog from 'posthog-js';  // Add direct import

// Search events
export const trackFlightSearch = (searchData) => {
  try {
    posthog.capture('flight_search', {
      origin: searchData.origin,
      destination: searchData.destination,
      departDate: searchData.departDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      cabinClass: searchData.cabinClass,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking flight search:', error);
  }
};

// Track UI interactions
export const trackUIInteraction = (elementName, metadata = {}) => {
  try {
    posthog.capture('ui_interaction', {
      element: elementName,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking UI interaction:', error);
  }
};

// Track itinerary/flight view
export const trackItineraryView = (flightData) => {
  try {
    posthog.capture('itinerary_view', {
      flightId: flightData.id || 'unknown',
      origin: flightData.origin || 'unknown',
      destination: flightData.destination || 'unknown',
      price: flightData.price || 0,
      airline: flightData.airline || 'unknown',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking itinerary view:', error);
  }
};

// Track booking process
export const trackBookingStart = (flightData) => {
  try {
    posthog.capture('booking_started', {
      flightId: flightData.id || 'unknown',
      origin: flightData.origin || 'unknown',
      destination: flightData.destination || 'unknown',
      price: flightData.price || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking booking start:', error);
  }
};

export const trackBookingStep = (step, metadata = {}) => {
  try {
    posthog.capture('booking_step', {
      step,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking booking step:', error);
  }
};

export const trackBookingComplete = (bookingData) => {
  try {
    posthog.capture('booking_completed', {
      bookingId: bookingData.id,
      amount: bookingData.amount,
      currency: bookingData.currency || 'USD',
      paymentMethod: bookingData.paymentMethod,
      origin: bookingData.origin,
      destination: bookingData.destination,
      passengerCount: bookingData.passengerCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking booking completion:', error);
  }
};

export const trackBookingAbandoned = (step, reason = 'unknown') => {
  try {
    posthog.capture('booking_abandoned', {
      abandonedAtStep: step,
      reason: reason,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking booking abandonment:', error);
  }
};

// Track feature usage
export const trackFeatureUsage = (featureName, metadata = {}) => {
  try {
    posthog.capture('feature_used', {
      feature: featureName,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

export const trackButtonClick = (buttonName, metadata = {}) => {
  try {
    posthog.capture('button_clicked', {
      button_name: buttonName,
      ...metadata,
      timestamp: new Date().toISOString()
    });
    console.log(`Tracked button click: ${buttonName}`);
  } catch (error) {
    console.error('Error tracking button click:', error);
  }
};

export const trackPageView = (pageName, metadata = {}) => {
  try {
    posthog.capture('page_viewed', {
      page_name: pageName,
      ...metadata,
      timestamp: new Date().toISOString()
    });
    console.log(`Tracked page view: ${pageName}`);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackSearch = (searchType, searchParams = {}) => {
  try {
    posthog.capture(`${searchType}_search`, {
      ...searchParams,
      timestamp: new Date().toISOString()
    });
    console.log(`Tracked ${searchType} search`);
  } catch (error) {
    console.error(`Error tracking ${searchType} search:`, error);
  }
};

export const trackBookingEvent = (eventName, bookingData = {}) => {
  try {
    posthog.capture(eventName, {
      ...bookingData,
      timestamp: new Date().toISOString()
    });
    console.log(`Tracked booking event: ${eventName}`);
  } catch (error) {
    console.error(`Error tracking booking event ${eventName}:`, error);
  }
};