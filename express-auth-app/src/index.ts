import express, { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt, { VerifyOptions } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

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

app.get('/posts', authMiddleware, (req: Request, res: Response) => {
  res.json(posts);
});

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
    if (err) return res.sendStatus(403);
    if (typeof user !== 'string') {
      req.user = user;
    }
    next();
  });
}

app.listen(port, () => {
  console.log(`server start ${port}`);
});
