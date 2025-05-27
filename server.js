const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://msv-engg25.github.io' // ✅ Replace with your frontend domain
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

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // your email (e.g., Gmail)
    pass: process.env.EMAIL_PASS       // app password or real password
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Send email
    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER, // Where the form submissions go
      subject: `New Inquiry: ${req.body.subject || 'No Subject'}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${req.body.name}</p>
        <p><strong>Company:</strong> ${req.body.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${req.body.subject}</p>
        <p><strong>Inquiry Type:</strong> ${req.body.inquiryType}</p>
        <p><strong>Message:</strong><br>${req.body.message}</p>
        <p><strong>Consent Given:</strong> ${req.body.consent ? 'Yes' : 'No'}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting form:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit form. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
