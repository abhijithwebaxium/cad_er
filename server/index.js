import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
dotenv.config();


//middlewares
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CADer backend',
  });
});



const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('An error occurred at the database connection');
    throw error;
  }
};

app.listen(3000, () => {
  connect();
  console.log('Server is running on port 3000');
});
