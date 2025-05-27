const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  inquiryType: String,
  consent: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
