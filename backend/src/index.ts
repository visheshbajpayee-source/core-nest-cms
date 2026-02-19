import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/core_nest_cms';

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ success: true, message: 'API running' }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB Connected Successfully");
    
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection error:", err.message);
    process.exit(1);
  });


export default app;

