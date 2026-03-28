require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectPostgres, connectMongo } = require('./src/config/db');

// Route Imports
const authRoutes = require('./src/routes/authRoutes');
const leadRoutes = require('./src/routes/leadRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB Connections
connectPostgres();
connectMongo();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Vitto Sign-Up API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error Details:', err);
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message || err,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
