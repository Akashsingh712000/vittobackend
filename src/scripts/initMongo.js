require('dotenv').config();
const mongoose = require('mongoose');
const OtpSession = require('../models/otpModel');

const initMongo = async () => {
  try {
    // 1. Connect to MongoDB
    console.log(` Connecting to MongoDB at ${process.env.MONGO_URI}...`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB successfully.');

    // 2. Sync indexes (this forces Mongoose to create the TTL index defined in the schema)
    console.log(' Syncing indexes for OtpSession collection...');
    await OtpSession.syncIndexes();
    console.log(' Indexes synced. The TTL index (expires: 600s) on createdAt is now guaranteed to exist.');

    // 3. Verify indexes
    const indexes = await OtpSession.collection.indexes();
    console.log(' Current Indexes on OtpSession:');
    console.dir(indexes, { depth: null });
    
    // Check if the TTL index is present
    const ttlIndex = indexes.find(i => i.expireAfterSeconds === 600);
    if (ttlIndex) {
      console.log(' Confirmed: 10-minute (600 seconds) TTL index is active.');
    } else {
      console.log(' Warning: TTL index not found. Please ensure your MongoDB user has index creation permissions.');
    }

    process.exit(0);
  } catch (error) {
    console.error(' Error initializing MongoDB:', error);
    process.exit(1);
  }
};

initMongo();
