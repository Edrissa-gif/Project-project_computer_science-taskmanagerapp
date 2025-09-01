import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

import userRouter from './routes/userRoute.js'; 
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS setup (specific and safe for dev)
app.use(cors({
  origin: 'http://localhost:5173', // <-- Match your frontend dev server
  credentials: true               // <-- Allow sending cookies/localStorage tokens
}));

// ✅ Middleware for parsing JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to database
connectDB();

// ✅ API Routes
app.use("/api/user", userRouter); 
app.use("/api/tasks", taskRouter);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
