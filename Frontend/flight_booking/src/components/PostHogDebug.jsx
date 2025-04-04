import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';

const PostHogDebug = () => {
  const [status, setStatus] = useState('Checking...');
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Check if PostHog is available
    if (window.posthog) {
      setStatus('PostHog available via window.posthog');
    } else if (posthog) {
      setStatus('PostHog available via import');
    } else {
      setStatus('PostHog NOT AVAILABLE');
    }

    // Try to get current user ID
    try {
      const distinctId = posthog.get_distinct_id();
      setUserId(distinctId);
    } catch (e) {
      console.error("Couldn't get user ID:", e);
    }
  }, []);

  const sendTestEvent = (method) => {
    const eventName = `test_from_${method}_${new Date().getTime()}`;
    
    if (method === 'import') {
      posthog.capture(eventName);
      addEvent(eventName, 'import');
    } else if (method === 'window' && window.posthog) {
      window.posthog.capture(eventName);
      addEvent(eventName, 'window');
    } else if (method === 'api') {
      fetch('https://eu.i.posthog.com/capture/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          api_key: 'phc_kuNwiigDkKvSfjJKh5mkOSv6peRG38ChQarzZy1kMoA',
          event: eventName,
          properties: {
            distinct_id: userId || 'anonymous_user',
            method: 'api',
            timestamp: new Date().toISOString()
          }
        })
      })
      .then(() => addEvent(eventName, 'api'))
      .catch(e => console.error(e));
    }
  };

  const addEvent = (name, method) => {
    setEvents(prev => [...prev, { name, method, time: new Date().toISOString() }]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PostHog Debug Dashboard</h1>
      
      <div style={{ padding: '10px', background: '#f4f4f4', borderRadius: '5px', marginBottom: '20px' }}>
        <h2>Status</h2>
        <p><strong>PostHog Status:</strong> {status}</p>
        <p><strong>User ID:</strong> {userId || 'Unknown'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Send Test Events</h2>
        <button onClick={() => sendTestEvent('import')} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Via Import
        </button>
        <button onClick={() => sendTestEvent('window')} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Via Window
        </button>
        <button onClick={() => sendTestEvent('api')} style={{ padding: '8px 16px' }}>
          Via API
        </button>
      </div>
      
      <div>
        <h2>Event Log</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Event Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Method</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{event.name}</td>
                <td style={{ padding: '8px' }}>{event.method}</td>
                <td style={{ padding: '8px' }}>{event.time}</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: '8px', textAlign: 'center' }}>No events sent yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostHogDebug;