const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const webhookController = require('../controllers/webhookController');

// All routes require authentication
router.use(authMiddleware);

// Webhook management
router.post('/webhooks', webhookController.createWebhook);
router.get('/webhooks', webhookController.getUserWebhooks);
router.get('/webhooks/:webhookId', webhookController.getWebhookById);
router.put('/webhooks/:webhookId', webhookController.updateWebhook);
router.delete('/webhooks/:webhookId', webhookController.deleteWebhook);

// Test webhook
router.post('/webhooks/:webhookId/test', webhookController.testWebhook);

module.exports = router; 