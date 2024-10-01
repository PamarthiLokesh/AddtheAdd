const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 



const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://lokeshpamarthi022:Lokesh9989@cluster0.afn8pqp.mongodb.net/signupDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));


const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  address: String,
});

const User = mongoose.model('User', userSchema);


app.post('/api/signup', async (req, res) => {
  const { fullName, email, password, mobile, address } = req.body;
  try {
    const newUser = new User({ fullName, email, password, mobile, address });
    await newUser.save();
    res.json({ message: 'User signed up successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
});


// POST /api/forgot-password
router.post('/forgot', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: 
             http://your-frontend-url/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



module.exports = router;
