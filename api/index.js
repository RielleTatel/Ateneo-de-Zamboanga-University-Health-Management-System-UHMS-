// Vercel serverless function wrapper for Express app
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../backend/src/routes/authRoutes.js';
import userRoutes from '../backend/src/routes/userRoutes.js';
import debuggingRoutes from '../backend/src/routes/debuggingRoutes.js';
import patientRoutes from '../backend/src/routes/patientRoutes.js';
import vitalRoutes from '../backend/src/routes/vitalRoutes.js';
import resultRoutes from '../backend/src/routes/resultRoutes.js';
import consultationRoutes from '../backend/src/routes/consultationRoutes.js';
import prescriptionRoutes from '../backend/src/routes/prescriptionRoutes.js';
import immunizationRoutes from '../backend/src/routes/immunizationRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
  
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];
    
    // Add Vercel deployment URL if available
    if (process.env.VERCEL_URL) {
      allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    // Add custom frontend URL if set
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Allow any *.vercel.app domain (for preview deployments)
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/debugging', debuggingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/immunizations', immunizationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_KEY: !!process.env.SUPABASE_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  const allConfigured = envCheck.SUPABASE_URL && envCheck.SUPABASE_KEY;
  
  res.json({ 
    status: allConfigured ? 'ok' : 'warning',
    timestamp: new Date().toISOString(),
    environment: envCheck,
    message: allConfigured ? 'All systems operational' : 'Missing required environment variables'
  });
});

// Export the Express app as a serverless function
export default app;

