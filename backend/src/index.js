import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabaseClient.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/api/ping', (req, res) => {
  console.log(' Backend received /api/ping');
  res.json({ message: 'Gab from backend' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
