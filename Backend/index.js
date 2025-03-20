const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.post('/api/offer-requests', async (req, res) => {
  try {
    const response = await axios.post('https://api.duffel.com/air/offer_requests', {
      data: req.body
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DUFFEL_API_KEY}`,
        'Duffel-Version': 'v1',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});