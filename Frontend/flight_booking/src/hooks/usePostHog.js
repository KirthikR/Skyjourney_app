import { useEffect } from 'react';
import { trackPageView, trackEvent } from '../utils/analytics';

export function usePostHog(pageName) {
  // Track page view when component mounts
  useEffect(() => {
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName]);

  // Return tracking functions for component use
  return { trackEvent };
}