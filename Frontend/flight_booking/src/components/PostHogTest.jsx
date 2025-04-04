import React, { useEffect, useState } from 'react';
import { trackEvent } from '../utils/analytics';

export default function PostHogTest() {
  const [status, setStatus] = useState('Checking...');
  
  useEffect(() => {
    if (window.posthog) {
      setStatus('PostHog is properly initialized');
      
      // Send a test event
      trackEvent('test_event', { source: 'test_page' });
    } else {
      setStatus('PostHog is NOT initialized');
    }
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>PostHog Status</h1>
      <p>{status}</p>
      <button onClick={() => trackEvent('test_button_clicked')}>
        Send Test Event
      </button>
    </div>
  );
}