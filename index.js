const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const errorHandler = require('./middleware/errorHandler');
const validate = require('./middleware/validate');
const { studentSchema } = require('./validators/studentValidator');
const AppError = require('./utils/AppError');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/studentdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Connection failed', error);
});

app.post('/students', validate(studentSchema), async (req, res, next) => {
    try {
        const { name, age, grade } = req.body;

        const student = new Student({ name, age, grade });
        await student.save();

        res.status(201).json(student);
    }
    catch(err) {
        next(err);
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Student API is running' });
});

app.get('/students', async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const students = await Student.find().skip(skip).limit(limit);

        const totalDocs = await Student.countDocuments();

        return res.status(200).json({
            totalDocs,
            page,
            totalPages: Math.ceil(totalDocs/limit),
            data: students
        });
    }
    catch(err) {
        next(err);
    }
});

app.delete('/students/:id', async (req, res, next) => {
    try {
        const studentId = req.params.id;
        
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if(deletedStudent === null) {
            throw new AppError('Student not found', 404);
        }
        res.status(200).json({ message: `Student ${deletedStudent.name} deleted successfully` });
    }
    catch(err) {
        next(err);
    }
});

app.put('/students/:id', validate(studentSchema), async (req, res, next) => {
    try {
        const { name, age, grade } = req.body;
        const studentId = req.params.id;
        const data = { name, age, grade };

        const updatedStudent = await Student.findByIdAndUpdate(studentId, data, { new: true });
        if(updatedStudent === null) {
            throw new AppError('Student not found', 404);
        }
        res.status(200).json({ message: `Student ${updatedStudent.name} updated successfully` });
    }
    catch(err) {
        next(err);
    }
});

app.get('/students/:id', async (req, res, next) => {
    try {
        const studentId = req.params.id;

        const studentById = await Student.findById(studentId);
        if(studentById === null) {
            throw new AppError('Student not found', 404);
        }
        res.status(200).json(studentById);
    }
    catch(err) {
        next(err);
    }
});

app.get('/students/summary/grades', async (req, res, next) => {
    try {
        const students = await Student.aggregate([
            {
                $group: {
                    _id: '$grade',
                    count: { $sum: 1 },
                    avgAge: { $avg: '$age' }
                }
            },
            { $sort: { count: 1 } },
            {
                $project: {
                    _id: 0,
                    grade: '$_id',
                    count: 1,
                    avgAge: { $round: [ '$avgAge', 2 ] }
                }
            }
        ]);
        
        return res.status(200).json(students);
    }
    catch(err) {
        next(err);
    }
});

app.get('/students/summary/age', async (req, res, next) => {
    try {
        const students = await Student.aggregate([
            {
                $group: {
                    _id: null,
                    maxAge: { $max: '$age' },
                    minAge: { $min: '$age' },
                    avgAge: { $avg: '$age' }
                }
            },
            {
                $project: {
                    _id: 0,
                    maxAge: 1,
                    minAge: 1,
                    avgAge: {
                        $round: ['$avgAge', 2]
                    }
                }
            }
        ]);

        return res.status(200).json(students);
    }
    catch(err) {
        next(err);
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});