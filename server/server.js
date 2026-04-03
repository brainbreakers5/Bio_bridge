const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const deviceRoutes = require('./src/routes/deviceRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation/Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Biometric Bridge Backend API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/device', deviceRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database Connection Check (Supabase)
const supabase = require('./src/utils/supabaseClient');
const checkDbConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Supabase connection check failed:', error.message);
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
  }
};

checkDbConnection();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
