const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: Allow both GitHub Pages and local dev
app.use(cors({
  origin: ['https://msv-engg25.github.io', 'http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Contact schema
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

// ✅ Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// ✅ POST: handle form submission
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    const mailOptions = {
      from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
