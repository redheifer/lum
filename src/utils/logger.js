const winston = require('winston');
const config = require('../config/config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${message}${stack ? '\n' + stack : ''}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: config.loggingLevel,
  format: logFormat,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    
    // File transports for production
    ...(config.env === 'production' ? [
      // Error log
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      // Combined log
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      // Webhook-specific log
      new winston.transports.File({
        filename: 'logs/webhooks.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ] : [])
  ]
});

module.exports = logger; 