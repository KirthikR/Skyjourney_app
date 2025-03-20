// Add proper error handling and data formatting

export const searchFlights = async (searchData) => {
  try {
    console.log('API Request: post /flights/search');
    
    // Ensure your request has the expected format on the client side
    const response = await axios.post(`${API_BASE_URL}/flights/search`, searchData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    throw error;
  }
};