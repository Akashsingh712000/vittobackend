const { Pool } = require('pg');
const mongoose = require('mongoose');

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

const connectPostgres = async () => {
  try {
    await pool.connect();
    console.log(' PostgreSQL Connected Successfully');
  } catch (error) {
    console.error(' PostgreSQL Connection Error:', error.message);
  }
};

// MongoDB Connection
const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
  }
};

module.exports = {
  pool,
  connectPostgres,
  connectMongo,
};
