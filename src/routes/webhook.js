const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// This endpoint receives webhook calls from external services
router.post('/:userId/webhook/:webhookId', webhookController.handleWebhookRequest);

module.exports = router; 