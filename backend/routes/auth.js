const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) return res.status(400).json({ msg: 'All fields required' });

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) return res.status(400).json({ msg: 'Invalid email' });
        if (!/^\d{10}$/.test(phone)) return res.status(400).json({ msg: 'Phone must be 10 digits' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new User({ name, email, phone, password: hash });
        await user.save();
        res.json({ msg: 'Registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'All fields required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { id: user._id, email: user.email, name: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        res.json({ token, user: payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
