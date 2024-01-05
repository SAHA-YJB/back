import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
const port = 4000;
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('db connect error', err);
  });

app.use(express.json());
// 폼 데이터를 받기 위한 설정
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
