const mongoose = require('mongoose');

async function testConnection() {
  try {
    const conn = await mongoose.connect('mongodb+srv://vitto:Pkuv6B1AtYYEsjUP@cluster0.oq2sure.mongodb.net/vitto_db?retryWrites=true&w=majority');
    console.log('SUCCESS: MongoDB is running and connected.');
    process.exit(0);
  } catch (error) {
    console.log('FAILED:', error.message);
    process.exit(1);
  }
}

testConnection();
