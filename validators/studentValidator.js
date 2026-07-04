const Joi = require('joi');

const studentSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    age: Joi.number().min(5).max(100).required(),
    grade: Joi.string().min(1).max(2).required()
});

module.exports = studentSchema;