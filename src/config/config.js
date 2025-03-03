require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lum_webhooks',
  
  // n8n configuration (hidden from clients)
  n8nBaseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  n8nApiKey: process.env.N8N_API_KEY,
  
  // Webhook configuration
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL || 'https://api.lumai.com',
  
  // JWT secret for API authentication
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  
  // Logging configuration
  loggingLevel: process.env.LOGGING_LEVEL || 'info',
  
  // Monitoring configuration
  enableHealthChecks: process.env.ENABLE_HEALTH_CHECKS === 'true' || true,
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '300000', 10), // 5 minutes
}; 