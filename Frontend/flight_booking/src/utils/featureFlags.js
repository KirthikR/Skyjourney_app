import posthog from 'posthog-js';

export const isFeatureEnabled = (flagName, defaultValue = false) => {
  return posthog.isFeatureEnabled(flagName, defaultValue);
};

// Usage example in components:
// if (isFeatureEnabled('new-booking-ui')) {
//   return <NewBookingForm />;
// } else {
//   return <LegacyBookingForm />;
// }