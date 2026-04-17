const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const studentRoutes = require('./routes/studentRoutes');
const batchRoutes = require('./routes/batchRoutes');
const sectionRoutes = require('./routes/sectionsStandalone');
const activityRoutes = require('./routes/activitiesStandalone');
const testRoutes = require('./routes/testRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  // Join batch room
  socket.on('join-batch', (batchId) => {
    socket.join(`batch-${batchId}`);
    console.log(`👤 Socket ${socket.id} joined batch-${batchId}`);
    socket.emit('joined-batch', { batchId, message: 'Successfully joined batch room' });
  });

  // Leave batch room
  socket.on('leave-batch', (batchId) => {
    socket.leave(`batch-${batchId}`);
    console.log(`👋 Socket ${socket.id} left batch-${batchId}`);
  });

  // Join test room (for live tests)
  socket.on('join-test', (testId) => {
    socket.join(`test-${testId}`);
    console.log(`📝 Socket ${socket.id} joined test-${testId}`);
  });

  // Leave test room
  socket.on('leave-test', (testId) => {
    socket.leave(`test-${testId}`);
    console.log(`📝 Socket ${socket.id} left test-${testId}`);
  });

  // Handle student typing (for live tests)
  socket.on('student-active', (data) => {
    socket.to(`test-${data.testId}`).emit('student-activity', {
      studentId: data.studentId,
      timestamp: Date.now()
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api', testRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.IO enabled`);
  console.log(`📡 Real-time updates active`);
});

module.exports = { app, server, io };
