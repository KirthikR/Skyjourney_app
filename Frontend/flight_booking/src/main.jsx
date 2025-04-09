import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import posthog from 'posthog-js';

// Initialize PostHog BEFORE rendering your app
posthog.init('phc_kuNwiigDkKvSfjJKh5mkOSv6peRG38ChQarzZy1kMoA', {
  api_host: 'https://eu.i.posthog.com',
  loaded: function(posthog) {
    console.log('PostHog loaded successfully');
    window.posthog = posthog;
    window.posthogInitialized = true;
  },
  capture_pageview: true,
  autocapture: true,
  persistence: 'localStorage',
  session_recording: {
    enabled: true,
    maskAllInputs: true,
    maskAllText: false,
    recordCanvas: false,
    sampleRate: 1.0
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
