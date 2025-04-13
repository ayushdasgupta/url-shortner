import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {fileURLToPath} from 'url'
import path, { dirname } from 'path'
import connectDB from './config/db.js'

dotenv.config();

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Middleware
app.use(express.json());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true,
}));


import Authrouter from './routes/auth.js'
import Linkrouter from './routes/links.js'
import Analyticsrouter from './routes/analytics.js'
import Redirectrouter from './routes/redirect.js'

// Routes
app.use('/api/auth', Authrouter);
app.use('/api/links', Linkrouter);
app.use('/api/analytics', Analyticsrouter);
app.use('/api', Redirectrouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});