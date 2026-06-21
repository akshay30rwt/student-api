const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/studentdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Connection failed', error);
});

app.post('/students', async (req, res) => {
    const { name, age, grade } = req.body;

    const student = new Student({ name, age, grade });
    await student.save();

    res.status(200).json(student);
})

app.get('/', (req, res) => {
    res.json({ message: 'Student API is running' });
});

app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if(deletedStudent === null) {
        res.status(404).json({ message: 'Student not found' });
        return;
    }
    res.status(200).json({ message: `Student ${deletedStudent.name} deleted successfully` });
});

app.put('/students/:id', async (req, res) => {
    const { name, age, grade } = req.body;
    const studentId = req.params.id;
    const data = { name, age, grade };

    const updatedStudent = await Student.findByIdAndUpdate(studentId, data, { new: true });
    if(updatedStudent === null) {
        res.status(404).json({ message: 'Student not found' });
        return;
    }
    res.status(200).json({ message: `Student ${updatedStudent.name} updated successfully` });
});

app.get('/students/:id', async (req, res) => {
    const studentId = req.params.id;

    const studentById = await Student.findById(studentId);
    if(studentById === null) {
        res.status(404).json({ message: 'Student not found' });
        return;
    }
    res.status(200).json(studentById);
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});