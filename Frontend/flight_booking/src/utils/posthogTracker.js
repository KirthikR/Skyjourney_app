import posthog from 'posthog-js';

// Wrapper function that tries multiple methods to ensure events are sent
export const captureEvent = (eventName, properties = {}) => {
  console.log(`Attempting to capture event: ${eventName}`, properties);
  const finalProps = {
    ...properties,
    timestamp: new Date().toISOString(),
    captureMethod: 'wrapper'
  };

  // Method 1: Direct import
  try {
    posthog.capture(eventName, finalProps);
    console.log(`Event ${eventName} sent via direct import`);
    return true;
  } catch (e) {
    console.error(`Failed to send ${eventName} via direct import:`, e);
  }

  // Method 2: Window object (fallback)
  try {
    if (window.posthog) {
      window.posthog.capture(eventName, finalProps);
      console.log(`Event ${eventName} sent via window.posthog`);
      return true;
    }
  } catch (e) {
    console.error(`Failed to send ${eventName} via window.posthog:`, e);
  }

  // Method 3: Direct API (last resort)
  try {
    fetch('https://eu.i.posthog.com/capture/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        api_key: 'phc_kuNwiigDkKvSfjJKh5mkOSv6peRG38ChQarzZy1kMoA',
        event: eventName,
        properties: {
          ...finalProps,
          distinct_id: posthog.get_distinct_id() || 'anonymous_user',
          captureMethod: 'direct_api'
        }
      })
    });
    console.log(`Event ${eventName} sent via direct API`);
    return true;
  } catch (e) {
    console.error(`Failed to send ${eventName} via direct API:`, e);
    return false;
  }
};