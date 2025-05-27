const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend domain in production
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema & Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: String,
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  inquiryType: String,
  consent: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// POST Route to Handle Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving contact:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit form. Please try again later.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
