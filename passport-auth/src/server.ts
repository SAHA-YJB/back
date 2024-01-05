import express from 'express';

const app = express();
const port = 4000;

app.use(express.json());
// 폼 데이터를 받기 위한 설정
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
