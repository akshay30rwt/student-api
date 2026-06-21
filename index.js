const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/studentdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Connection failed', error);
});

app.get('/', (req, res) => {
    res.json({ message: 'Student API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});