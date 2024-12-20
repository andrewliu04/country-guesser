const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log('connected to MongoDB database'))
.catch(err => console.log(err));

// route naming
app.use('/api/users', require('./routes/users'));
app.use('/api/game', require('./routes/game'));

// backend run on specified port or port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
