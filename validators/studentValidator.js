const Joi = require('joi');

const studentSchema = Joi.object({
    name: Joi.String().min(2).max(50).required(),
    age: Joi.Number().min(5).max(100).required(),
    grade: Joi.String().min(1).max(2).required()
});

module.exports = studentSchema;