require('dotenv').config();
const { pool } = require('../config/db');

const initDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50) UNIQUE NOT NULL,
      institution_name VARCHAR(255) NOT NULL,
      institution_type VARCHAR(50) NOT NULL,
      city VARCHAR(100) NOT NULL,
      loan_book_size NUMERIC,
      status VARCHAR(50) DEFAULT 'PENDING_ONBOARDING',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log(' PostgreSQL Schema initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error(' Error initializing schema:', error);
    process.exit(1);
  }
};

initDB();
