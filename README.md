# Student Management API

A REST API to manage students built with Node.js, Express.js and MongoDB.
Includes Joi validation and global error handling.

## Features
- Full CRUD for students
- Request validation with Joi
- Global error handling
- Custom AppError class

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi

## How to Run
- npm install
- npm run dev

## API Endpoints
- POST   /students     - Add a student
- GET    /students     - Get all students
- GET    /students/:id - Get a student by ID
- PUT    /students/:id - Update a student
- DELETE /students/:id - Delete a student