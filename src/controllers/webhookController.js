const webhookService = require('../services/webhookService');

/**
 * Create a new webhook
 */
exports.createWebhook = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const { workspaceId, name, description, selectedParameters } = req.body;
    
    if (!workspaceId || !name || !selectedParameters) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const webhook = await webhookService.generateWebhook(
      userId,
      workspaceId,
      name,
      description || '',
      selectedParameters
    );
    
    return res.status(201).json({
      success: true,
      data: webhook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all webhooks for a user
 */
exports.getUserWebhooks = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const webhooks = await webhookService.getUserWebhooks(userId);
    
    return res.status(200).json({
      success: true,
      data: webhooks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific webhook by ID
 */
exports.getWebhookById = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const { webhookId } = req.params;
    
    const webhook = await webhookService.getWebhookById(userId, webhookId);
    
    return res.status(200).json({
      success: true,
      data: webhook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a webhook
 */
exports.updateWebhook = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const { webhookId } = req.params;
    const updateData = req.body;
    
    const webhook = await webhookService.updateWebhook(userId, webhookId, updateData);
    
    return res.status(200).json({
      success: true,
      data: webhook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a webhook
 */
exports.deleteWebhook = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const { webhookId } = req.params;
    
    await webhookService.deleteWebhook(userId, webhookId);
    
    return res.status(200).json({
      success: true,
      message: 'Webhook deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle incoming webhook request
 */
exports.handleWebhookRequest = async (req, res, next) => {
  try {
    const { userId, webhookId } = req.params;
    const payload = req.body;
    
    const result = await webhookService.processWebhookRequest(userId, webhookId, payload);
    
    return res.status(200).json(result);
  } catch (error) {
    // Special error handling for webhook requests
    if (error.message.includes('Missing required parameters')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message === 'Webhook not found or inactive') {
      return res.status(404).json({
        success: false,
        error: 'Webhook not found or inactive'
      });
    }
    
    // For other errors, let the main error handler deal with it
    next(error);
  }
};

/**
 * Test a webhook
 */
exports.testWebhook = async (req, res, next) => {
  try {
    const { userId } = req.auth; // From JWT auth middleware
    const { webhookId } = req.params;
    const testPayload = req.body;
    
    // First verify the webhook belongs to this user
    await webhookService.getWebhookById(userId, webhookId);
    
    // Then process it like a regular webhook call
    const result = await webhookService.processWebhookRequest(userId, webhookId, testPayload);
    
    return res.status(200).json({
      success: true,
      message: 'Test webhook processed successfully',
      result
    });
  } catch (error) {
    next(error);
  }
}; 