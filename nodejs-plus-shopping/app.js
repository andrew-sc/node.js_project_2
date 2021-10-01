const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user"); //user모델 참조
const Goods = require("./models/goods");
const Cart = require("./models/cart");
const authMiddleware = require("./middlewares/auth-middleware");

const Joi = require("joi");

mongoose.connect("mongodb://localhost/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));


// 회원가입시 검증을 위한 joi의 스케마 설정
const postUserSchema = Joi.object().keys({
    nickname: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
  });

// 회원가입
router.post("/users", async (req,res) => {
    try{
        const { nickname, email, password, confirmPassword } = await postUserSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.'
            });
            return; // 이후의 코드는 실행시키지 않기 위한 리턴
        }

        const existUsers = await User.find({
            $or: [{ email }, { nickname }]
        });
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.'
            });
            return;
        }

        const user = new User({ email, nickname, password });
        await user.save();

        res.status(201).send({}); // 어떠한 유저가 저장된 내용으로 restFUL 관점에서 201의 상태가 적합하여 201을 status로 전송

    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
    }
    
});


//로그인 할 때 미리 joi로 검사하기 위한 스키마설정
const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
//로그인 하는 행위는 보통 너네 DB에 내가 알고 있는 인증정보가 있냐? 그게 나와 맞냐 를 인증 후 인증 성공 후 입장권 부여
//로그인은 post 메서드로 하는 것을 추천
//로그인
router.post("/auth", async (req, res) => {
    try{
        const { email, password } = await postAuthSchema.validateAsync(req.body);

        const user = await User.findOne({ email, password }).exec();

        if (!user) {
            res.status(400).send({
                errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'
            });
            return;
        }

        const token = jwt.sign({ userId: user.userId}, "seceretKey");
        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        })
    }
    
});


//사용자 정보를 페이지에 보내주는 라우터
// 미들웨어를 거쳐서 암호화 된 정보를 클라이언트에 넘겨주는 것
router.get("/users/me", authMiddleware, async (req,res) => {  // /user/me 의 경로로 들어오는 경우만 <<<여기 라우터가 작동한다.
    const { user } = res.locals;
    console.log(user);

    res.send({
        user,
    });
});



// 상품 & 장바구니 코드


//장바구니 전체 목록 조회
router.get("/goods/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;

    const cart = await Cart.find({ userId }).exec();
    const goodsIds = cart.map((c) => c.goodsId);

    // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
    const goodsKeyById = await Goods.find({
        _id: { $in: goodsIds },
    })
    .exec().then((goods) =>
    goods.reduce(
        (prev, g) => ({
        ...prev,
        [g.goodsId]: g,
        }),
        {}
    )
    );

    res.send({cart: cart.map((c) => ({
    quantity: c.quantity,
    goods: goodsKeyById[c.goodsId],
    })),
    });
});

// 장바구니 상품 담기, 이미 담겨있으면 수량만 변경
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;
    const { quantity } = req.body;
  
    const existsCart = await Cart.findOne({ userId, goodsId }).exec();
  
    if (existsCart) {
        existsCart.quantity = quantity;
        await existsCart.save();
    } else {
        const cart = new Cart({
            userId,
            goodsId,
            quantity,
        });
        await cart.save();
    }

    //성공했을때 응답 값을 클라이언트가 사용하지 않는다.
    res.send({});
});

// 장바구니 삭제
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;

    const existsCart = await Cart.findOne({
      userId,
      goodsId,
    }).exec();

    // 있든 말든 신경 안쓴다. 그냥 있으면 지운다.
    if (existsCart) {
        existsCart.delete();
    }
    res.send({});
});

// 모든 상품 가져오기
router.get("/goods", authMiddleware, async (req, res) => {
    const { category } = req.query;
    const goods = await Goods.find(category ? { category } : undefined)
      .sort("-date")
      .exec();
  
    res.send({ goods });
});

// 상품 하나만 가져오기
router.get("/goods/:goodsId", authMiddleware, async (req, res) => {
    const { goodsId } = req.params;
    const goods = await Goods.findById(goodsId).exec();

    if (!goods) {
      res.status(404).send({});
    } else {
      res.send({ goods });
    }
});


app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});