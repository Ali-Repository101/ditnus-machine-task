require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// routes
const authRoutes = require('./routes/auth');
const personRoutes = require('./routes/persons');

app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connected');
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.error('Mongo connect error:', err));
