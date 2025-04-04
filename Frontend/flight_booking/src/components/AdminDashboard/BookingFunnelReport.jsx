import React, { useState, useEffect } from 'react';
import styles from '../../styles/BookingFunnelReport.module.css';

const BookingFunnelReport = () => {
  const [funnelData, setFunnelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPostHogFunnelData = async () => {
      try {
        // In a production app, these API calls should be through your backend
        // to avoid exposing API keys in frontend code
        const POSTHOG_API_KEY = 'phc_kuNwiigDkKvSfjJKh5mkOSv6peRG38ChQarzZy1kMoA'; 
        const POSTHOG_PROJECT_ID = '54396';  // Your PostHog project ID
        
        // Define your funnel - these should match your event names
        const funnelEvents = [
          { id: 'booking_search_initiated', name: 'Search Initiated' },
          { id: 'booking_search_results_viewed', name: 'Search Results Viewed' },
          { id: 'booking_flight_selected', name: 'Flight Selected' },
          { id: 'booking_passenger_info_entered', name: 'Passenger Info Entered' },
          { id: 'booking_payment_initiated', name: 'Payment Initiated' },
          { id: 'booking_payment_completed', name: 'Payment Completed' },
          { id: 'booking_confirmed', name: 'Booking Confirmed' }
        ];

        // Get funnel data from PostHog
        const response = await fetch(`https://eu.i.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/insights/funnel/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${POSTHOG_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            insight: 'FUNNELS',
            date_from: '-30d',  // Last 30 days
            funnel_viz_type: 'steps',
            events: funnelEvents.map(event => ({
              id: event.id,
              type: 'events',
              order: 0
            })),
            exclusions: []
          })
        });

        if (!response.ok) {
          throw new Error(`PostHog API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Process the results - if no data, fall back to example data
        if (result.result && Array.isArray(result.result) && result.result.length > 0) {
          // Convert PostHog data format to our component's expected format
          const processedData = {
            steps: [],
            conversionRate: 0,
            timeframe: 'Last 30 days'
          };
          
          result.result.forEach((step, index) => {
            const count = step.count;
            const prevCount = index > 0 ? result.result[index-1].count : count;
            const dropOffRate = prevCount > 0 ? (prevCount - count) / prevCount : 0;
            
            processedData.steps.push({
              name: funnelEvents[index].name,
              count: count,
              dropOffRate: dropOffRate
            });
          });
          
          // Calculate overall conversion rate
          const firstStep = result.result[0]?.count || 0;
          const lastStep = result.result[result.result.length - 1]?.count || 0;
          processedData.conversionRate = firstStep > 0 ? lastStep / firstStep : 0;
          
          setFunnelData(processedData);
        } else {
          // Fallback to example data if no real data available yet
          setFunnelData({
            steps: [
              { name: 'Search Initiated', count: 10000, dropOffRate: 0 },
              { name: 'Search Results Viewed', count: 7500, dropOffRate: 0.25 },
              { name: 'Flight Selected', count: 4200, dropOffRate: 0.44 },
              { name: 'Passenger Info Entered', count: 2800, dropOffRate: 0.33 },
              { name: 'Payment Initiated', count: 1900, dropOffRate: 0.32 },
              { name: 'Payment Completed', count: 1500, dropOffRate: 0.21 },
              { name: 'Booking Confirmed', count: 1450, dropOffRate: 0.03 }
            ],
            conversionRate: 0.145,
            timeframe: 'Last 30 days (example data)'
          });
          console.log('No funnel data available, using example data');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching funnel data:', err);
        setError(`Failed to load funnel data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchPostHogFunnelData();
  }, []);
  
  // Generate key insights based on actual data
  const generateInsights = (data) => {
    if (!data || !data.steps || data.steps.length < 2) return [];
    
    const insights = [];
    let maxDropoff = { rate: 0, index: 0 };
    
    // Find the highest drop-off point
    data.steps.forEach((step, index) => {
      if (index > 0 && step.dropOffRate > maxDropoff.rate) {
        maxDropoff = { rate: step.dropOffRate, index };
      }
    });
    
    // Add insight for highest drop-off
    if (maxDropoff.rate > 0) {
      const stepName = data.steps[maxDropoff.index].name;
      insights.push(`Highest drop-off (${(maxDropoff.rate * 100).toFixed(1)}%) occurs at "${stepName}"`);
    }
    
    // Add insight about overall conversion
    insights.push(`Overall conversion rate is ${(data.conversionRate * 100).toFixed(1)}%`);
    
    // Add insight about final step
    const finalStepIndex = data.steps.length - 1;
    if (finalStepIndex > 0) {
      const finalStep = data.steps[finalStepIndex];
      const prevStep = data.steps[finalStepIndex - 1];
      const finalConversion = 1 - finalStep.dropOffRate;
      
      if (finalConversion > 0.9) {
        insights.push(`${(finalConversion * 100).toFixed(1)}% of users who reach "${prevStep.name}" complete "${finalStep.name}"`);
      }
    }
    
    return insights;
  };
  
  if (loading) return <div className={styles.loading}>Loading funnel data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  
  const insights = generateInsights(funnelData);
  
  return (
    <div className={styles.funnelReport}>
      <h2>Booking Funnel Analysis</h2>
      <p>Timeframe: {funnelData.timeframe}</p>
      <p>Overall Conversion: {(funnelData.conversionRate * 100).toFixed(2)}%</p>
      
      <div className={styles.funnelVisualization}>
        {funnelData.steps.map((step, index) => (
          <div key={index} className={styles.funnelStep}>
            <div 
              className={styles.funnelBar} 
              style={{ 
                width: `${(step.count / funnelData.steps[0].count) * 100}%`,
                backgroundColor: index === funnelData.steps.length - 1 ? '#4CAF50' : '#2196F3'
              }}
            >
              <span className={styles.stepName}>{step.name}</span>
              <span className={styles.stepCount}>{step.count.toLocaleString()}</span>
            </div>
            {index < funnelData.steps.length - 1 && (
              <div className={styles.dropOff}>
                {step.dropOffRate > 0 && (
                  <>
                    <span className={styles.dropOffArrow}>↓</span>
                    <span className={styles.dropOffRate}>
                      {(step.dropOffRate * 100).toFixed(1)}% drop
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.insights}>
        <h3>Key Insights</h3>
        <ul>
          {insights.length > 0 ? (
            insights.map((insight, index) => <li key={index}>{insight}</li>)
          ) : (
            <>
              <li>Highest drop-off occurs after search results are viewed (25%)</li>
              <li>Payment initiated to completed has significant drop (21%)</li>
              <li>Almost all users who complete payment confirm their booking</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookingFunnelReport;