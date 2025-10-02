// server/app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

// Setup
const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB (adjust URI)
mongoose.connect('mongodb://localhost:27017/formsdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const SubmissionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  email: String,
  gender: String,
  resume: String,
  photo: String,
  degree: String,
});
const Submission = mongoose.model('Submission', SubmissionSchema);

// Multer for handling uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ''));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.post('/api/submit-form', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]), async (req, res) => {
  try {
    const { name, phone, address, email, gender, degree } = req.body;

    const resumePath = req.files['resume'][0]?.filename || '';
    const photoPath = req.files['photo'][0]?.filename || '';

    const submission = new Submission({
      name,
      phone,
      address,
      email,
      gender,
      resume: resumePath,
      photo: photoPath,
      degree,
    });
    await submission.save();

    res.status(201).json({ message: "Submitted" });
  } catch (err) {
    res.status(400).json({ error: "Error saving form" });
  }
});

app.listen(4000, () => {
  console.log('Server listening on http://localhost:4000');
});
