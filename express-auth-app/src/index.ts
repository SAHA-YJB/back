import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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
let refreshTokens: string[] = [];
app.use(express.json());
app.use(cookieParser());

app.post('/login', (req, res) => {
  const userName = req.body.userName;
  const user = { name: userName };

  // jwt를 이용 토큰생성 페이로드 + 시크릿키
  // 유효기간 추가
  const accessToken = jwt.sign(user, process.env.SECRET_KEY!, {
    expiresIn: '30s',
  });

  // 리프레시 토큰 생성
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY!, {
    expiresIn: '1d',
  });
  // 원래는 디비에 저장
  refreshTokens.push(refreshToken);

  // 리프레시 토큰을 쿠키에 저장
  res.cookie('jwt', refreshToken, {
    // js로 쿠키에 접근하지 못하게 httpOnly사용
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

app.get('/posts', authMiddleware, (req: Request, res: Response) => {
  res.json(posts);
});
// 리프레시 토큰으로 새로운 액세스 토큰 발급
app.get('/refresh', (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;
  // 리프레시 토큰이 데이터베이스에 있는 토큰인지 확인
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET_KEY!,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { name: user.name },
        process.env.SECRET_KEY!,
        {
          expiresIn: '30s',
        }
      );
      res.json({ accessToken });
    }
  );
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
