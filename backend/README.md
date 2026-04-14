# Institute LMS Backend API

Production-level REST API for Institute Learning Management System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Students

#### Get All Students
```
GET /api/students
```

#### Get Student by ID
```
GET /api/students/:id
```

#### Create Student
```
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "course": "MERN Stack Development"
}
```

#### Update Student
```
PUT /api/students/:id
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "course": "Java Full Stack",
  "status": "active"
}
```

#### Delete Student
```
DELETE /api/students/:id
```

#### Get Students by Course
```
GET /api/students/course/:courseName
```

### Available Courses
- MERN Stack Development
- Java Full Stack
- Python Full Stack
- Data Science & AI
- DevOps Engineering
- Cloud Computing

## Response Format

Success Response:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Server Port
Default: 5000
