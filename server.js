const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contact');
const contact = require('./routes/contact'); // <-- Adjust the path if needed

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the contact route
app.use('/contact', contact);  // <-- This is what enables POST /contact

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
