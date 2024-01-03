import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = 4000;

const posts = [
  {
    userName: 'kim',
    title: 'post 1',
  },
  {
    userName: 'lee',
    title: 'post 2',
  },
];

app.use(express.json());

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const user = { name: userName };

  // jwt를 이용 토큰생성 페이로드 + 시크릿키
  const accessToken = jwt.sign(user, process.env.SECRET_KEY!);
  res.json({ accessToken });
});

app.get('/posts', (req: Request, res: Response) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`server start ${port}`);
});
