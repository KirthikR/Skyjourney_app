import { useState, useEffect } from 'react';
import { getOfferRequest } from '../services/flightApi';

/**
 * Hook to fetch and manage a single offer request
 * @param {String} id - Offer request ID (optional, can be set later)
 * @returns {Object} - States and functions to manage offer request
 */
const useOfferRequest = (initialId = null) => {
  const [id, setId] = useState(initialId);
  const [offerRequest, setOfferRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOfferRequest = async (requestId = id) => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getOfferRequest(requestId);
      setOfferRequest(data);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch offer request');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch when ID changes
  useEffect(() => {
    if (id) {
      fetchOfferRequest();
    }
  }, [id]);

  return {
    offerRequest,
    loading,
    error,
    fetchOfferRequest,
    setOfferRequestId: setId,
  };
};

export default useOfferRequest;