const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Process messages route
router.post('/chatbot', chatbotController.processMessage);

// Get suggested questions route
router.get('/chatbot/suggestions', chatbotController.getSuggestions);

module.exports = router;