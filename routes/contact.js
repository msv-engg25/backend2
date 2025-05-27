const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    const saved = await Contact.create(data);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h3>New Message from ${data.name}</h3>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message received and email sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});

module.exports = router;
