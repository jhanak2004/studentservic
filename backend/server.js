const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load the backend's environment file regardless of the process working directory.
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://studyserve-frontend.onrender.com',
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/services', require('./routes/services'));
app.use('/api/affidavit',require('./routes/affidavit'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'StudyServe API running' }));

// Connect DB & Start
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MongoDB connection failed: MONGO_URI is missing from backend/.env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });
