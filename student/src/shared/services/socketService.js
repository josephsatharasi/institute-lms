import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  joinBatch(batchId) {
    if (this.socket) {
      this.socket.emit('join-batch', batchId);
      console.log(`👤 Joined batch: ${batchId}`);
    }
  }

  leaveBatch(batchId) {
    if (this.socket) {
      this.socket.emit('leave-batch', batchId);
      console.log(`👋 Left batch: ${batchId}`);
    }
  }

  joinTest(testId) {
    if (this.socket) {
      this.socket.emit('join-test', testId);
      console.log(`📝 Joined test: ${testId}`);
    }
  }

  leaveTest(testId) {
    if (this.socket) {
      this.socket.emit('leave-test', testId);
      console.log(`📝 Left test: ${testId}`);
    }
  }

  onNewTest(callback) {
    if (this.socket) {
      this.socket.on('new-test', callback);
      this.listeners.set('new-test', callback);
    }
  }

  onTestUpdated(callback) {
    if (this.socket) {
      this.socket.on('test-updated', callback);
      this.listeners.set('test-updated', callback);
    }
  }

  onTestDeleted(callback) {
    if (this.socket) {
      this.socket.on('test-deleted', callback);
      this.listeners.set('test-deleted', callback);
    }
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;
