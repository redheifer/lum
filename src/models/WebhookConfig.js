const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebhookConfigSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  workspaceId: {
    type: String,
    required: true,
    index: true
  },
  webhookId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  // Parameters selected during onboarding
  selectedParameters: {
    type: [String],
    required: true
  },
  // Required parameters that must be present
  requiredParameters: {
    type: [String],
    required: true,
    default: ['campaign_name', 'campaign_id', 'recording_url']
  },
  // n8n workflow ID this webhook maps to
  n8nWorkflowId: {
    type: String,
    required: true
  },
  // The n8n webhook endpoint URL (hidden from clients)
  n8nWebhookUrl: {
    type: String,
    required: true
  },
  // Branded public webhook URL that we expose to clients
  publicWebhookUrl: {
    type: String,
    required: true
  },
  // Webhook health and statistics
  stats: {
    totalCalls: {
      type: Number,
      default: 0
    },
    successfulCalls: {
      type: Number,
      default: 0
    },
    failedCalls: {
      type: Number,
      default: 0
    },
    lastCallAt: {
      type: Date
    },
    lastErrorAt: {
      type: Date
    },
    lastError: {
      type: String
    },
    averageResponseTime: {
      type: Number,
      default: 0
    }
  },
  // Webhook status
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
WebhookConfigSchema.index({ userId: 1, workspaceId: 1 });

module.exports = mongoose.model('WebhookConfig', WebhookConfigSchema); 