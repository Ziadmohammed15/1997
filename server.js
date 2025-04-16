import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// API endpoint to send verification code
app.post('/api/verify/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Format phone number to E.164 format if needed
    let formattedNumber = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedNumber = `+${phoneNumber}`;
    }
    
    // Send verification code
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: formattedNumber, channel: 'sms' });
    
    res.status(200).json({ success: true, status: verification.status });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ 
      error: 'Failed to send verification code', 
      details: error.message 
    });
  }
});

// API endpoint to verify code
app.post('/api/verify/check', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    
    if (!phoneNumber || !code) {
      return res.status(400).json({ error: 'Phone number and code are required' });
    }
    
    // Format phone number to E.164 format if needed
    let formattedNumber = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedNumber = `+${phoneNumber}`;
    }
    
    // Verify the code
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: formattedNumber, code });
    
    if (verification.status === 'approved') {
      res.status(200).json({ success: true, verified: true });
    } else {
      res.status(400).json({ success: false, verified: false, status: verification.status });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ 
      error: 'Failed to verify code', 
      details: error.message 
    });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});