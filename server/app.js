const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const wasteReportRoutes = require('./routes/wasteReportRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Waste Management System API is running'
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', wasteReportRoutes);
app.use('/api/collections', collectionRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
