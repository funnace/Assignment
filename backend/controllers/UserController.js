const jwt = require('jsonwebtoken'); // You should import JWT library
const bcrypt = require('bcrypt');
const Creator = require('../models/UserSchema');

const register = async (req, res) => {
  
    const { email, password } = req.body;
        
    const existingUser = await Creator.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
        const user = new Creator({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the user by email
      const user = await Creator.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token to the client
      res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
      res.status(500).json({ message: 'Error logging in user', error: err.message });
  }
};

module.exports = { register, login };