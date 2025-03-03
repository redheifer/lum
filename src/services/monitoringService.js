const config = require('../config/config');
const WebhookConfig = require('../models/WebhookConfig');
const logger = require('../utils/logger');
const axios = require('axios');

class MonitoringService {
  constructor() {
    if (config.enableHealthChecks) {
      // Start health check interval
      this.startHealthChecks();
    }
  }
  
  /**
   * Start periodic health checks
   */
  startHealthChecks() {
    setInterval(() => {
      this.performHealthChecks();
    }, config.healthCheckInterval);
    
    logger.info(`Webhook health monitoring started. Interval: ${config.healthCheckInterval}ms`);
  }
  
  /**
   * Perform health checks on all active webhooks
   */
  async performHealthChecks() {
    try {
      // Find all active webhooks
      const webhooks = await WebhookConfig.find({ status: 'active' });
      
      logger.info(`Running health checks on ${webhooks.length} active webhooks`);
      
      // Check each webhook
      for (const webhook of webhooks) {
        this.checkWebhookHealth(webhook);
      }
    } catch (error) {
      logger.error('Error performing webhook health checks:', error);
    }
  }
  
  /**
   * Check health of a specific webhook
   * @param {Object} webhook - Webhook configuration
   */
  async checkWebhookHealth(webhook) {
    try {
      // Verify n8n endpoint is accessible
      const response = await axios.options(webhook.n8nWebhookUrl, {
        timeout: 5000, // 5 second timeout
        headers: {
          'X-Lum-Health-Check': 'true'
        }
      });
      
      // If we get here, the endpoint is accessible
      if (webhook.status === 'error') {
        // Update status if it was in error state
        await WebhookConfig.findByIdAndUpdate(webhook._id, {
          $set: { status: 'active' }
        });
        
        logger.info(`Webhook ${webhook.webhookId} recovered from error state`);
      }
    } catch (error) {
      logger.error(`Health check failed for webhook ${webhook.webhookId}:`, error.message);
      
      // Update webhook status to error
      await WebhookConfig.findByIdAndUpdate(webhook._id, {
        $set: { 
          status: 'error',
          'stats.lastError': `Health check failed: ${error.message}`,
          'stats.lastErrorAt': new Date()
        }
      });
    }
  }
  
  /**
   * Get health status for all webhooks
   * @returns {Promise<Object>} - Health status report
   */
  async getHealthStatus() {
    try {
      // Get counts by status
      const activeCount = await WebhookConfig.countDocuments({ status: 'active' });
      const errorCount = await WebhookConfig.countDocuments({ status: 'error' });
      const inactiveCount = await WebhookConfig.countDocuments({ status: 'inactive' });
      
      // Get webhooks with errors
      const webhooksWithErrors = await WebhookConfig.find(
        { status: 'error' },
        { 
          webhookId: 1, 
          userId: 1, 
          name: 1, 
          'stats.lastError': 1, 
          'stats.lastErrorAt': 1 
        }
      ).limit(10);
      
      return {
        summary: {
          total: activeCount + errorCount + inactiveCount,
          active: activeCount,
          error: errorCount,
          inactive: inactiveCount,
          healthPercentage: activeCount / (activeCount + errorCount + inactiveCount) * 100
        },
        errors: webhooksWithErrors.map(webhook => ({
          webhookId: webhook.webhookId,
          userId: webhook.userId,
          name: webhook.name,
          lastError: webhook.stats.lastError,
          lastErrorAt: webhook.stats.lastErrorAt
        }))
      };
    } catch (error) {
      logger.error('Error getting webhook health status:', error);
      throw new Error('Failed to get webhook health status');
    }
  }
}

module.exports = new MonitoringService(); 