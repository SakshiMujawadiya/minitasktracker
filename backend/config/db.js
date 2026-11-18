const mongoose = require('mongoose');
const os = require('os');
require('dotenv').config();

const getMongoUri = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow_test';
  }
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
};

const connectDb = async () => {
  const uri = getMongoUri();
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      runtimeAdapters: {
        os,
      },
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    throw err;
  }
};

const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error(`[MongoDB] Disconnection error: ${err.message}`);
  }
};

module.exports = {
  connectDb,
  disconnectDb,
  mongoose,
};
