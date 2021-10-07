const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const connect = require('./schemas/all_post'); //만들어놓은 schemas와 연결
connect();

const postRouter = require('./routers/post'); // routes안의 post와 연결시켜주는 것
const userRouter = require('./routers/user');
const post = require('./schemas/post');
const Comment = require('./schemas/comment');

app.set('views', __dirname + '/views'); //ejs형식으로 사용할 view의 위치정보/__dirname은 현재 위치정보
app.set('view engine', 'ejs'); //views에 있는 ejs들을 가져다 쓸 것을 세팅

// 아래는 미들웨어로써 put,post 등의 기능을 사용할 때 보다 간편하게 쓸수 있게 도와주는 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //json화 해주는 것, res.body라고하면 가공이 되어지게끔 만든다
// app.use(express.static('public')); // static안의 컨텐츠를 사용할 수 있게 하는 미들웨어
app.use("/static", express.static('public'));
app.use('/api', postRouter);
app.use('/api', userRouter);


// app.use((req, res, next) => {
//   // 미들웨어; 이후로 가기전에 먼저 이 과정을 거치게 만든다
//   console.log(req); // 여기에 원하는 처리내용을 쓰면 됌! 지금은 딱히 할게 없어서 그냥 콘솔..! 그냥 지나치는 모든 데이터를 보게 하는 용도
//   next(); // 미들웨어를 통과해라! 의 뜻
// });

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/main', async (req, res) => {
  res.render('main');
});

app.get('/post', (req, res) => {
  res.render('newPost');
});

app.get('/post/detail', async (req, res) => {
  const postTime = req.query.postTime

  const comments =  await Comment.find({ postTime }).sort({ commentTime: -1 });
  console.log(comments);

  res.render('detail', {comments} );
});

app.get('/post/edit', (req, res) => {
  res.render('edit');
});

app.get('/users/login', (req, res) => {
  res.render('login');
});

app.get('/users/signup', (req, res) => {
  res.render('signUp');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
