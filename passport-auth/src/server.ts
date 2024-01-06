import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
// 폼 데이터를 받기 위한 설정
app.use(express.urlencoded({ extended: false }));
// 정적 파일을 제공하기 위한 설정
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
