const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { User, Goods, Cart } = require('./models'); //user모델 참조 >> MySQL실행 후에는 인덱스에서 불러온다, 인덱스는 생략가능
const authMiddleware = require('./middlewares/auth-middleware');

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);
const router = express.Router();

const socketIdMap = {};

function emitSamePageViewerCount() {
  const conuntByUrl = Object.values(socketIdMap).reduce((value, url) => {
    //오브젝트.벨류스 는 맵이 가진 ket:value 에서 벨류만 쫙 뽑아서 list로 만들어준다. reduce라는 함수는 1인자로 콜백함수, 2인자로 초기값이 들어간다. 1인자인 콜백함수에도 누적값, 현재값, 인덱스, 요소 의 순으로 인자가 들어 갈 수 있다.
    return {
      ...value,
      [url]: value[url] ? value[url] + 1 : 1, //여기서 url은 socket.if로
    };
  }, {});

  console.log(conuntByUrl);

  for (const [socketId, url] of Object.entries(socketIdMap)) {
    const count = conuntByUrl[url];
    io.to(socketId).emit('SAME_PAGE_VIEWER_COUNT', count);
  }
}

function initSocket(sock) {
    console.log('새로운 소켓이 연결됐어요!')

    // 특정 이벤트가 전달됐는지 감지할 때 사용될 함수
    function watchEvent(event, func) {
      sock.on(event, func);
    }
  
    // 연결된 모든 클라이언트에 데이터를 보낼때 사용될 함수
    function notifyEveryone(event, data) {
      io.emit(event, data);
    }
  
    return {
      watchBuying: () => {
        watchEvent('BUY', (data) => {
          const emitData = {
            ...data,
            date: new Date().toISOString(),
          };
          notifyEveryone('BUY_GOODS', emitData);
        });
      },
  
      watchByebye: () => {
        watchEvent('disconnect', () => {
          console.log(sock.id, '연결이 끊어졌어요!');
        });
      },
    };
  }

io.on('connection', (socket) => {
  socketIdMap[socket.id] = null;
  console.log('누군가 연결을 시도했어요!');

  const { watchBuying, watchDisconnec} = initSocket(socket);

  watchChngPage();
  watchBuying();
  watchDisconnec();

});



  socket.on('CHANGED_PAGE', (data) => {
    console.log('페이지가 바뀌었대요', data, socket.id);
    socketIdMap[socket.id] = data;

    emitSamePageViewerCount();
  });

  socket.on('BUY', (data) => {
    const payload = {
      nickname: data.nickname,
      goodsId: data.goodsId,
      goodsName: data.goodsName,
      date: new Date().toISOString(),
    };
    console.log('클라이언트가 구매한 데이터', data, new Date());

    socket.broadcast.emit('BUY_GOODS', payload); // 나를 제외한 다른 소켓에 정보를 전달

    socket.on('dissconnect', () => {
      delete socketIdMap[socket.id];
      console.log('누군가 연결을 끊었어요!');
      emitSamePageViewerCount();
    });
  });
});

io.on('connection', (socket) => {
  console.log('새로운 소켓이 연결됐어요!');

  socket.on('disconnect', () => {
    console.log('연결이 끊어졌어요!');
  });
});

const Joi = require('joi');
// 회원가입시 검증을 위한 joi의 스케마 설정
const postUserSchema = Joi.object().keys({
  nickname: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
});

// 회원가입
router.post('/users', async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
    });
    return; // 이후의 코드는 실행시키지 않기 위한 리턴
  }

  // 이메일과 닉네임의 중복확인
  const existUsers = await User.findAll({
    where: {
      //where 조건문 /  Op에서 찾아와라
      [Op.or]: [{ nickname }, { email }], //둘중 하나라도 포함하면 가져와!
    },
  });
  if (existUsers.length) {
    res.status(400).send({
      errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
    });
    return;
  }

  await User.create({ email, nickname, password });
  res.status(201).send({}); // 어떠한 유저가 저장된 내용으로 restFUL 관점에서 201의 상태가 적합하여 201을 status로 전송
});

//로그인 할 때 미리 joi로 검사하기 위한 스키마설정
const postAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
//로그인 하는 행위는 보통 너네 DB에 내가 알고 있는 인증정보가 있냐? 그게 나와 맞냐 를 인증 후 인증 성공 후 입장권 부여
//로그인은 post 메서드로 하는 것을 추천
//로그인
router.post('/auth', async (req, res) => {
  try {
    const { email, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { email, password } });

    if (!user) {
      res.status(400).send({
        errorMessage: '이메일 또는 패스워드가 잘못되었습니다.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'seceretKey');
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

//사용자 정보를 페이지에 보내주는 라우터
// 미들웨어를 거쳐서 암호화 된 정보를 클라이언트에 넘겨주는 것
router.get('/users/me', authMiddleware, async (req, res) => {
  // /user/me 의 경로로 들어오는 경우만 <<<여기 라우터가 작동한다.
  const { user } = res.locals;
  //console.log(user);

  res.send({
    user,
  });
});

// 상품 & 장바구니 코드

//장바구니 전체 목록 조회
router.get('/goods/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const cart = await Cart.findAll({ where: { userId } });
  const goodsIds = cart.map((c) => c.goodsId);

  // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
  const goodsKeyById = await Goods.findAll({
    where: { goodsId: goodsIds },
  }).then((goods) =>
    goods.reduce(
      (prev, g) => ({
        ...prev,
        [g.goodsId]: g,
      }),
      {}
    )
  );

  res.send({
    cart: cart.map((c) => ({
      quantity: c.quantity,
      goods: goodsKeyById[c.goodsId],
    })),
  });
});

// 장바구니 상품 담기, 이미 담겨있으면 수량만 변경
router.put('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCart = await Cart.findOne({ where: { userId, goodsId } });

  if (existsCart) {
    existsCart.quantity = quantity;
    await existsCart.save();
  } else {
    const cart = new Cart({
      userId,
      goodsId,
      quantity,
    });
  }

  //성공했을때 응답 값을 클라이언트가 사용하지 않는다.
  res.send({});
});

// 장바구니 삭제
router.delete('/goods/:goodsId/cart', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  const existsCart = await Cart.findAll({ where: { userId, goodsId } });

  // 있든 말든 신경 안쓴다. 그냥 있으면 지운다.
  if (existsCart) {
    await existsCart.destory();
  }

  res.send({});
});

// 모든 상품 가져오기
router.get('/goods', authMiddleware, async (req, res) => {
  const { category } = req.query;
  const goods = await Goods.findAll({
    order: [['goodsId', 'DESC']],
    where: category ? { category } : undefined,
  });

  res.send({ goods });
});

// 상품 하나만 가져오기
router.get('/goods/:goodsId', authMiddleware, async (req, res) => {
  const { goodsId } = req.params;
  const goods = await Goods.findByPk(goodsId);

  if (!goods) {
    res.status(404).send({});
  } else {
    res.send({ goods });
  }
});

app.use('/api', express.urlencoded({ extended: false }), router);
app.use(express.static('assets'));

http.listen(8080, () => {
  console.log('서버가 요청을 받을 준비가 됐어요');
});
