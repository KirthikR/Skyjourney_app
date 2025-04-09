import React, { useEffect, useState } from 'react';
import posthog from 'posthog-js';

const PostHogDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({
    initialized: false,
    featureFlagsLoaded: false,
    flags: {},
    lastChecked: null
  });

  useEffect(() => {
    // Initial check
    checkPostHogStatus();
    
    // Regular interval check
    const interval = setInterval(checkPostHogStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const checkPostHogStatus = () => {
    const info = {
      initialized: Boolean(window.posthogInitialized),
      featureFlagsLoaded: false,
      flags: {},
      lastChecked: new Date().toISOString()
    };
    
    try {
      if (window.posthog) {
        // Check if feature flags are loaded
        const flags = window.posthog.getFeatureFlag('debug-flag'); // Any flag name to check
        info.featureFlagsLoaded = flags !== null;
        
        // Get all flags
        if (window.posthog.featureFlags) {
          if (typeof window.posthog.featureFlags.getFlags === 'function') {
            info.flags = window.posthog.featureFlags.getFlags();
          }
        }
      }
    } catch (error) {
      console.error('Error checking PostHog status:', error);
    }
    
    setDebugInfo(info);
  };
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4 style={{margin: '0 0 8px'}}>PostHog Status</h4>
      <p><strong>Initialized:</strong> {debugInfo.initialized ? '✅' : '❌'}</p>
      <p><strong>Feature Flags Loaded:</strong> {debugInfo.featureFlagsLoaded ? '✅' : '❌'}</p>
      <p><strong>Last Checked:</strong> {new Date(debugInfo.lastChecked).toLocaleTimeString()}</p>
      
      <h4 style={{margin: '8px 0'}}>Feature Flags</h4>
      {Object.keys(debugInfo.flags).length > 0 ? (
        <ul style={{margin: 0, paddingLeft: '20px'}}>
          {Object.entries(debugInfo.flags).map(([key, value]) => (
            <li key={key}>{key}: {String(value)}</li>
          ))}
        </ul>
      ) : (
        <p>No flags available</p>
      )}
      
      <button 
        onClick={checkPostHogStatus}
        style={{marginTop: '8px', padding: '4px 8px'}}
      >
        Refresh
      </button>
    </div>
  );
};

export default PostHogDebugger;