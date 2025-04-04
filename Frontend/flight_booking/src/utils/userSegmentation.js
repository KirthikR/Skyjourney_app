import { identifyUser, trackEvent } from './analytics';

// User segment types
export const USER_SEGMENTS = {
  NEW_USER: 'new_user',
  RETURNING_USER: 'returning_user',
  HIGH_VALUE: 'high_value',
  LEISURE_TRAVELER: 'leisure_traveler',
  BUSINESS_TRAVELER: 'business_traveler',
  DEAL_SEEKER: 'deal_seeker'
};

// Assign user to segments based on behavior
export const assignUserSegments = (userData) => {
  const segments = [];
  
  // Determine if user is new or returning
  if (!userData.previousBookings || userData.previousBookings.length === 0) {
    segments.push(USER_SEGMENTS.NEW_USER);
  } else {
    segments.push(USER_SEGMENTS.RETURNING_USER);
    
    // High value users
    const totalSpent = userData.previousBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    if (totalSpent > 2000) {
      segments.push(USER_SEGMENTS.HIGH_VALUE);
    }
    
    // Determine travel type preference
    const businessClassBookings = userData.previousBookings.filter(b => 
      b.cabinClass === 'business' || b.cabinClass === 'first' || 
      b.tripReason === 'business'
    ).length;
    
    if (businessClassBookings / userData.previousBookings.length > 0.5) {
      segments.push(USER_SEGMENTS.BUSINESS_TRAVELER);
    } else {
      segments.push(USER_SEGMENTS.LEISURE_TRAVELER);
    }
    
    // Deal seekers look at many options before booking
    if (userData.searchCountBeforeBooking && userData.searchCountBeforeBooking > 5) {
      segments.push(USER_SEGMENTS.DEAL_SEEKER);
    }
  }
  
  return segments;
};

// Send segment data to PostHog
export const updateUserSegments = (userId, userData) => {
  if (!userId || !userData) return;
  
  const segments = assignUserSegments(userData);
  
  // Update user properties with segments
  identifyUser(userId, {
    segments: segments,
    lastSegmentUpdate: new Date().toISOString()
  });
  
  // Track this segmentation event
  trackEvent('user_segmented', {
    segments: segments
  });
  
  return segments;
};