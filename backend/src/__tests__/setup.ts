import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Use test database
process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/openhand-test';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-characters-long';

// Connect to test database before all tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    process.exit(1);
  }
});

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log('Disconnected from test database');
});
