const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./src/config/config');
const apiRoutes = require('./src/routes/api');
const webhookRoutes = require('./src/routes/webhook');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Parse JSON request body
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/', webhookRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 