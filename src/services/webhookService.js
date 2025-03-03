const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const WebhookConfig = require('../models/WebhookConfig');
const logger = require('../utils/logger');
const parameterMapper = require('../utils/parameterMapper');

class WebhookService {
  /**
   * Generate a new webhook for a user
   * @param {string} userId - The user ID
   * @param {string} workspaceId - The workspace ID
   * @param {string} name - Webhook name
   * @param {string} description - Webhook description
   * @param {Array<string>} selectedParameters - Parameters selected during onboarding
   * @returns {Promise<Object>} - The created webhook configuration
   */
  async generateWebhook(userId, workspaceId, name, description, selectedParameters) {
    try {
      // Generate a unique webhookId
      const webhookId = uuidv4();
      
      // Create the branded public webhook URL
      const publicWebhookUrl = `${config.webhookBaseUrl}/${userId}/webhook/${webhookId}`;
      
      // Create or get n8n workflow for this webhook
      const n8nWorkflowData = await this.createOrGetN8nWorkflow(userId, workspaceId, selectedParameters);
      
      // Create new webhook config
      const webhookConfig = new WebhookConfig({
        userId,
        workspaceId,
        webhookId,
        name,
        description,
        selectedParameters,
        n8nWorkflowId: n8nWorkflowData.id,
        n8nWebhookUrl: n8nWorkflowData.webhookUrl,
        publicWebhookUrl,
        status: 'active'
      });
      
      // Save to database
      await webhookConfig.save();
      
      // Return the webhook config (without exposing n8n details)
      return this.sanitizeWebhookConfig(webhookConfig);
    } catch (error) {
      logger.error('Error generating webhook:', error);
      throw new Error('Failed to generate webhook');
    }
  }
  
  /**
   * Process an incoming webhook request
   * @param {string} userId - User ID from the URL
   * @param {string} webhookId - Webhook ID from the URL
   * @param {Object} payload - The webhook payload
   * @returns {Promise<Object>} - Response from n8n
   */
  async processWebhookRequest(userId, webhookId, payload) {
    const startTime = Date.now();
    
    try {
      // Find the webhook configuration
      const webhookConfig = await WebhookConfig.findOne({ 
        userId, 
        webhookId,
        status: 'active'
      });
      
      if (!webhookConfig) {
        throw new Error('Webhook not found or inactive');
      }
      
      // Validate required parameters
      this.validateRequiredParameters(payload, webhookConfig.requiredParameters);
      
      // Map parameters if needed
      const mappedPayload = parameterMapper.mapParameters(payload, webhookConfig.selectedParameters);
      
      // Forward the request to n8n
      const response = await axios.post(webhookConfig.n8nWebhookUrl, mappedPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Lum-Webhook-Id': webhookId
        }
      });
      
      // Update webhook stats
      const responseTime = Date.now() - startTime;
      await this.updateWebhookStats(webhookConfig, true, responseTime);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        data: response.data
      };
    } catch (error) {
      // Update webhook stats with failure
      if (webhookId) {
        const webhookConfig = await WebhookConfig.findOne({ userId, webhookId });
        if (webhookConfig) {
          await this.updateWebhookStats(webhookConfig, false, 0, error.message);
        }
      }
      
      logger.error(`Webhook processing error [${userId}/${webhookId}]:`, error);
      throw error;
    }
  }
  
  /**
   * Validate required parameters in the payload
   * @param {Object} payload - The webhook payload
   * @param {Array<string>} requiredParams - List of required parameter names
   */
  validateRequiredParameters(payload, requiredParams) {
    const missingParams = requiredParams.filter(param => !payload[param]);
    
    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }
  }
  
  /**
   * Update webhook stats after processing
   * @param {Object} webhookConfig - The webhook configuration
   * @param {boolean} success - Whether the processing was successful
   * @param {number} responseTime - Response time in milliseconds
   * @param {string} errorMessage - Error message if any
   */
  async updateWebhookStats(webhookConfig, success, responseTime, errorMessage = null) {
    try {
      // Calculate new average response time
      const currentTotal = webhookConfig.stats.totalCalls;
      const currentAvg = webhookConfig.stats.averageResponseTime;
      const newAvg = currentTotal === 0 
        ? responseTime 
        : (currentAvg * currentTotal + responseTime) / (currentTotal + 1);
      
      const updateData = {
        'stats.totalCalls': webhookConfig.stats.totalCalls + 1,
        'stats.lastCallAt': new Date(),
        'stats.averageResponseTime': newAvg
      };
      
      if (success) {
        updateData['stats.successfulCalls'] = webhookConfig.stats.successfulCalls + 1;
      } else {
        updateData['stats.failedCalls'] = webhookConfig.stats.failedCalls + 1;
        updateData['stats.lastErrorAt'] = new Date();
        updateData['stats.lastError'] = errorMessage;
        
        // Set status to error if there are too many consecutive failures
        // This requires additional logic to track consecutive failures
        // which is not implemented here for simplicity
      }
      
      await WebhookConfig.findByIdAndUpdate(webhookConfig._id, { $set: updateData });
    } catch (error) {
      logger.error('Error updating webhook stats:', error);
      // Don't throw here as this is a non-critical update
    }
  }
  
  /**
   * Get all webhooks for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array<Object>>} - List of webhook configurations
   */
  async getUserWebhooks(userId) {
    try {
      const webhooks = await WebhookConfig.find({ userId });
      return webhooks.map(webhook => this.sanitizeWebhookConfig(webhook));
    } catch (error) {
      logger.error('Error fetching user webhooks:', error);
      throw new Error('Failed to fetch webhooks');
    }
  }
  
  /**
   * Get a specific webhook by ID
   * @param {string} userId - The user ID
   * @param {string} webhookId - The webhook ID
   * @returns {Promise<Object>} - The webhook configuration
   */
  async getWebhookById(userId, webhookId) {
    try {
      const webhook = await WebhookConfig.findOne({ userId, webhookId });
      if (!webhook) {
        throw new Error('Webhook not found');
      }
      return this.sanitizeWebhookConfig(webhook);
    } catch (error) {
      logger.error('Error fetching webhook:', error);
      throw new Error('Failed to fetch webhook');
    }
  }
  
  /**
   * Update a webhook configuration
   * @param {string} userId - The user ID
   * @param {string} webhookId - The webhook ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - The updated webhook configuration
   */
  async updateWebhook(userId, webhookId, updateData) {
    try {
      const webhook = await WebhookConfig.findOne({ userId, webhookId });
      if (!webhook) {
        throw new Error('Webhook not found');
      }
      
      // Only allow updating certain fields
      const allowedUpdates = ['name', 'description', 'status'];
      const updates = {};
      
      for (const key of allowedUpdates) {
        if (updateData[key] !== undefined) {
          updates[key] = updateData[key];
        }
      }
      
      const updatedWebhook = await WebhookConfig.findByIdAndUpdate(
        webhook._id,
        { $set: updates },
        { new: true }
      );
      
      return this.sanitizeWebhookConfig(updatedWebhook);
    } catch (error) {
      logger.error('Error updating webhook:', error);
      throw new Error('Failed to update webhook');
    }
  }
  
  /**
   * Delete a webhook
   * @param {string} userId - The user ID
   * @param {string} webhookId - The webhook ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteWebhook(userId, webhookId) {
    try {
      const webhook = await WebhookConfig.findOne({ userId, webhookId });
      if (!webhook) {
        throw new Error('Webhook not found');
      }
      
      // Delete from n8n if needed (this depends on your n8n setup)
      // await this.deleteN8nWorkflow(webhook.n8nWorkflowId);
      
      // Delete from database
      await WebhookConfig.findByIdAndDelete(webhook._id);
      
      return true;
    } catch (error) {
      logger.error('Error deleting webhook:', error);
      throw new Error('Failed to delete webhook');
    }
  }
  
  /**
   * Create or get an n8n workflow for a webhook
   * @param {string} userId - The user ID
   * @param {string} workspaceId - The workspace ID
   * @param {Array<string>} parameters - Selected parameters
   * @returns {Promise<Object>} - n8n workflow data
   */
  async createOrGetN8nWorkflow(userId, workspaceId, parameters) {
    try {
      // This would interact with n8n's API to create or update a workflow
      // For simplicity, we'll just simulate this with a mock response
      
      // In a real implementation, you would:
      // 1. Create a workflow in n8n with the HTTP trigger node
      // 2. Configure the workflow based on selected parameters
      // 3. Return the workflow ID and webhook URL
      
      // Simulate n8n API call
      const simulatedN8nWorkflowId = `workflow_${uuidv4()}`;
      const simulatedN8nWebhookUrl = `${config.n8nBaseUrl}/webhook/${simulatedN8nWorkflowId}`;
      
      return {
        id: simulatedN8nWorkflowId,
        webhookUrl: simulatedN8nWebhookUrl
      };
    } catch (error) {
      logger.error('Error creating n8n workflow:', error);
      throw new Error('Failed to set up webhook processing');
    }
  }
  
  /**
   * Remove n8n related fields from webhook config for client response
   * @param {Object} webhookConfig - Raw webhook configuration
   * @returns {Object} - Sanitized webhook configuration
   */
  sanitizeWebhookConfig(webhookConfig) {
    const config = webhookConfig.toObject ? webhookConfig.toObject() : { ...webhookConfig };
    
    // Remove sensitive n8n information
    delete config.n8nWorkflowId;
    delete config.n8nWebhookUrl;
    
    return config;
  }
}

module.exports = new WebhookService(); 