import { searchFlights, searchAirports } from "../services/flightApi";

const API_BASE_URL = 'http://localhost:3002/api';

/**
 * Search for flights
 * @param {Object} searchParams - Flight search parameters
 * @returns {Promise} - API response
 */
export const searchFlights = async (searchParams) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flight-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          slices: searchParams.slices,
          passengers: searchParams.passengers,
          cabin_class: searchParams.cabinClass
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search flights');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

/**
 * Get all offers for an offer request
 * @param {string} requestId - Offer request ID
 * @returns {Promise} - API response
 */
export const getOffers = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/offer-requests/${requestId}/offers`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get offers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

/**
 * Get specific offer details
 * @param {string} offerId - Offer ID
 * @returns {Promise} - API response
 */
export const getOfferDetails = async (offerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get offer details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching offer details:', error);
    throw error;
  }
};

/**
 * Book a flight (create order)
 * @param {Object} orderData - Order data
 * @returns {Promise} - API response
 */
export const bookFlight = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...orderData
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to book flight');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error;
  }
};

/**
 * Get order details
 * @param {string} orderId - Order ID
 * @returns {Promise} - API response
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get order details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};