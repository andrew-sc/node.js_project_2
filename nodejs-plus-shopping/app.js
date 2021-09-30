const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user"); //user모델 참조
const authMiddleware = require("./middlewares/auth-middleware");


mongoose.connect("mongodb://localhost/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.post("/users", async (req,res) => {
    const { nickname, email, password, confirmPassword } = req.body;

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
});

app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

//로그인 하는 행위는 보통 너네 DB에 내가 알고 있는 인증정보가 있냐? 그게 나와 맞냐 를 인증 후 인증 성공 후 입장권 부여
//로그인은 post 메서드로 하는 것을 추천
router.post("/auth", async (req, res) => {
    const { email, password } =req.body;

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
});

router.get("/users/me", authMiddleware, async (req,res) => {  // /user/me 의 경로로 들어오는 경우만 <<<여기 라우터가 작동한다.
    const { user } = res.locals;
    console.log(user);

    res.send({
        user: { // 그냥 user만 보내면 pw가 노출 되기 때문에 user에서도 이메일과 패스워드만 뽑아서 보내준다.
            email: user.email,
            nickname: user.nickname,
        }
    });
})


app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});