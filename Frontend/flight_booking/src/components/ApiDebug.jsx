import React, { useState } from 'react';

const ApiDebug = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testDuffelConnection = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_DUFFEL_API_KEY;
      
      console.log("Testing Duffel API connection...");
      console.log("API Key prefix:", apiKey?.substring(0, 5) + "...");
      
      const response = await fetch('/api/duffel/air/airlines', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Duffel-Version': 'v1',
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      setResult({
        success: true,
        data: data
      });
    } catch (err) {
      console.error("API Error:", err);
      setResult({
        success: false,
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>API Debug Panel</h1>
      <div style={{marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px'}}>
        <h3>Environment Variables:</h3>
        <p><strong>Duffel API Key:</strong> {import.meta.env.VITE_DUFFEL_API_KEY ? 
          `${import.meta.env.VITE_DUFFEL_API_KEY.substring(0, 10)}...` : 
          'Not found'}</p>
        <p><strong>API Endpoint:</strong> https://api.duffel.com/air</p>
      </div>
      
      <button 
        onClick={testDuffelConnection} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Duffel API Connection'}
      </button>
      
      {result && (
        <div style={{
          marginTop: '20px', 
          padding: '15px', 
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>Result: {result.success ? 'Success ✅' : 'Error ❌'}</h3>
          <pre style={{
            background: '#f4f4f4', 
            padding: '15px', 
            overflow: 'auto', 
            maxHeight: '400px',
            borderRadius: '4px'
          }}>
            {JSON.stringify(result.data || result.error, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{marginTop: '30px', background: '#e9ecef', padding: '15px', borderRadius: '5px'}}>
        <h3>Debugging Tips:</h3>
        <ul>
          <li>Make sure your API key starts with "duffel_" and is properly set in .env</li>
          <li>Check vite.config.js for proper proxy configuration</li>
          <li>Inspect Network tab in developer tools for detailed error messages</li>
          <li>Verify your API key has sufficient permissions in Duffel dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDebug;