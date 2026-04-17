# Institute LMS Backend - Test System

## 🚀 Features

- **Real-time Test Notifications** - Students receive instant notifications when tests are created
- **Socket.IO Integration** - Live updates without page refresh
- **Comprehensive Test Management** - Create, update, delete tests
- **Automatic Evaluation** - Tests are auto-evaluated on submission
- **Multiple Question Types** - Single choice and multiple choice questions
- **Live & Practice Tests** - Support for both test types
- **Student Submissions Tracking** - Track all student attempts and scores

## 📦 Installation

```bash
cd backend
npm install
```

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/institute-lms
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🏃 Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Test Management

#### Create Test
```http
POST /api/tests
Content-Type: application/json

{
  "name": "Mid-term Exam",
  "description": "Mathematics mid-term examination",
  "duration": 60,
  "type": "live",
  "startDate": "2024-04-15",
  "startTime": "10:00",
  "questions": [
    {
      "question": "What is 2+2?",
      "type": "single",
      "options": ["3", "4", "5", "6"],
      "correctAnswers": [1]
    }
  ],
  "marksPerQuestion": 1,
  "negativeMarks": 0.25,
  "totalMarks": 10,
  "sectionId": "section_id",
  "batchId": "batch_id",
  "createdBy": "Admin"
}
```

#### Get Tests by Batch
```http
GET /api/tests/batch/:batchId?status=published&type=live
```

#### Get Tests by Section
```http
GET /api/tests/section/:sectionId
```

#### Get Test by ID
```http
GET /api/tests/:testId
```

#### Get Test for Student (without answers)
```http
GET /api/tests/:testId/student?studentId=student_id
```

#### Update Test
```http
PUT /api/tests/:testId
Content-Type: application/json

{
  "name": "Updated Test Name",
  "duration": 90
}
```

#### Delete Test
```http
DELETE /api/tests/:testId
```

#### Submit Test
```http
POST /api/tests/:testId/submit
Content-Type: application/json

{
  "studentId": "student_id",
  "answers": [
    {
      "selectedAnswers": [1]
    }
  ],
  "timeSpent": 3600
}
```

#### Get Student Results
```http
GET /api/students/:studentId/results
```

#### Get Test Submissions (Admin)
```http
GET /api/tests/:testId/submissions
```

## 🔌 Socket.IO Events

### Client → Server

#### Join Batch Room
```javascript
socket.emit('join-batch', batchId);
```

#### Leave Batch Room
```javascript
socket.emit('leave-batch', batchId);
```

#### Join Test Room
```javascript
socket.emit('join-test', testId);
```

#### Leave Test Room
```javascript
socket.emit('leave-test', testId);
```

### Server → Client

#### New Test Created
```javascript
socket.on('new-test', (data) => {
  // data.test - test object
  // data.message - notification message
});
```

#### Test Updated
```javascript
socket.on('test-updated', (data) => {
  // data.testId - updated test ID
  // data.message - notification message
});
```

#### Test Deleted
```javascript
socket.on('test-deleted', (data) => {
  // data.testId - deleted test ID
  // data.message - notification message
});
```

## 📊 Database Models

### Test Model
```javascript
{
  name: String,
  description: String,
  duration: Number,
  type: 'practice' | 'live',
  startDate: Date,
  startTime: String,
  questions: [{
    question: String,
    type: 'single' | 'multiple',
    options: [String],
    correctAnswers: [Number]
  }],
  marksPerQuestion: Number,
  negativeMarks: Number,
  totalMarks: Number,
  sectionId: ObjectId,
  batchId: ObjectId,
  status: 'draft' | 'published' | 'ongoing' | 'completed',
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### TestSubmission Model
```javascript
{
  testId: ObjectId,
  studentId: ObjectId,
  batchId: ObjectId,
  answers: [{
    questionId: ObjectId,
    selectedAnswers: [Number],
    isCorrect: Boolean,
    marksAwarded: Number
  }],
  startedAt: Date,
  submittedAt: Date,
  timeSpent: Number,
  score: Number,
  totalMarks: Number,
  percentage: Number,
  status: 'in-progress' | 'submitted' | 'evaluated'
}
```

## 🎯 Real-time Flow

1. **Admin creates test** → Server saves to DB
2. **Server emits** `new-test` event to batch room
3. **All students in batch** receive notification instantly
4. **Student list updates** automatically without refresh
5. **Student clicks test** → Loads test details
6. **Student submits** → Auto-evaluated and saved
7. **Results displayed** immediately

## 🔒 Security Features

- Input validation using express-validator
- MongoDB injection prevention
- CORS configuration
- Error handling middleware
- Unique submission constraint (one per student per test)

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Efficient Socket.IO room management
- Lean queries for better performance
- Connection pooling with Mongoose

## 🧪 Testing

```bash
# Test server health
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-15T10:00:00.000Z",
  "socketConnections": 5
}
```

## 📝 Notes

- Socket.IO automatically handles reconnection
- Tests are auto-evaluated on submission
- Negative marking is optional
- Live tests have scheduled start times
- Practice tests are available anytime
- One submission per student per test (enforced by unique index)

## 🐛 Troubleshooting

**Socket not connecting:**
- Check CORS configuration
- Verify CLIENT_URL in .env
- Ensure port 5000 is not blocked

**Tests not appearing:**
- Verify batchId is correct
- Check Socket.IO room joining
- Confirm test status is 'published'

**Submission failing:**
- Check if already submitted
- Verify all required fields
- Ensure answers array matches questions

## 📚 Dependencies

- express: ^4.18.2
- mongoose: ^8.0.3
- socket.io: ^4.6.1
- cors: ^2.8.5
- dotenv: ^16.3.1
- express-validator: ^7.0.1
