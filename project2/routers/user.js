const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');
const authMiddleware = require('../middlewares/auth-middleware');

// 회원가입
// 닉네임 제약 - 최소3자(확)
// 닉네임 제약 - 알파벳 대소문자(a-z,A-Z), 숫자(0-9)(확)
// 비밀번호 제약 - 최소 4자(확)
// 비밀번호 제약 - 닉네임과 같은 값이 표함된 경우 회원 등록 실패(확)
// pw와 pwCheck는 정확하게 일치(확)
// db에 있는 닉네임인 경우 "중복된 닉네임입니다."라는 에러메세지를 프론트엔드??에서 보여주기(확)
// 회원가입 버튼을 누르고 에러메세지가 안뜨면 로그인 페이지로 ㄱㄱ >> 그렇다면 로그인페이지에서 토큰이 있으면 목록페이지로 전달?(확)

const userSchema = Joi.object({
  nickName: Joi.string()
    .min(3)
    .regex(/^[0-9a-z]+$/i)
    .required(),
  pw: Joi.string().min(3).required(),
  pwCheck: Joi.string().min(3).required(),
});

router.post('/users/signup', async (req, res) => {
  console.log(req.body);

  try {
    //검사1 : 글자수, 닉네임 형식
    const { nickName, pw, pwCheck } = await userSchema.validateAsync(req.body);
    // console.log(nickName, pw, pwCheck);

    //검사2 : 비밀번호에 닉네임 포함여부
    if (pw.match(nickName) === null) {
      // 검사3 : 비밀번호와 비밀번호체크가 완전 동일함
      if (pw === pwCheck) {
        let isNick = await User.findOne({ nickName });
        console.log(isNick);

        if (!isNick) {
          await User.create({ nickName: nickName, pw: pw });
          return res.status(200).send({
            result: '회원 등록에 성공하셨습니다.',
          });
        } else {
          console.log('중복된 닉네임');
          return res.status(400).send({
            result: 'nickNameUsed',
            errorMessage: '중복된 닉네임입니다.',
          });
        }
      } else {
        console.log('비밀번호가 일치하지 않는다');
        return res.status(400).send({
          result: 'pwCheckNotSamePw',
          errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        });
      }
    } else {
      console.log('비밀번호가 닉네임에 중복값이 있다.');
      return res.status(400).send({
        result: 'pwOverlapNickName',
        errorMessage: '옳바른 형식이 아닙니다.',
      });
    }
  } catch (err) {
    //console.log(err);
    return res.status(400).send({
      result: 'valiationFailed',
      errorMessage: '옳바른 형식이 아닙니다.',
    });
  }
});

// 닉네임 중복검사 api
router.post('/users/signup/chek', async (req, res) => {
  const nickName = req.body.nickName;
  console.log(nickName);

  let isNick = await User.findOne({ nickName });
  console.log(isNick);
  if (isNick) {
    return res.status(400).send({
      result: 'failure',
      errorMessage: '중복된 닉네임입니다.',
    });
  } else {
    return res.status(200).send({
      result: 'success',
      successMessage: '사용가능한 아이디 입니다.',
    });
  }
});

// 로그인
// 로그인시 닉네임과 비밀번호가 데이터베이스에 등록된 것인지 확인
// 틀린 정보가 있다면 "닉네임 또는 페스워드를 확인해 주세요" 메세지 보여주기
// 에러가 없다면 전체 게시글 목록조회로 이동
router.post('/auth', async (req, res) => {
  const { nickName, pw } = req.body;
  console.log(nickName, pw);

  //회원여부확인
  const isUser = await User.findOne({ nickName, pw });
  console.log(isUser);

  if (isUser) {
    console.log('유저확인 완료');
    console.log('로그인 진행');

    //회원정보 암호화
    const token = Jwt.sign({ nickName: isUser.nickName }, 'project-Two-Key'); //인코딩완료
    console.log(nickName);
    return res.status(200).send({
      result: 'success',
      token: token,
    });
  } else if (isUser === null) {
    console.log('유저가 아닙니다.');
    return res.status(400).send({
      result: 'failure',
      errorMessage: '닉네임 또는 패스워드를 확인해 주세요',
    });
  }
});

//로그인 검사
// 회원가입/로그인/게시글목록조회/게시글조회 를 제외한 나머지 페이지는 로그인시에만 허용
// 로그인을 하지 않거나, 올바르지 않은 경로로 접속한 사용자 > "로그인이 필요합니다" > 로그인페이지로 이동
// 로그인을 한 사용자가 로그인 or 회원가입 페이지에 접속한 경우 "이미 로그인이 되어있습니다" - 전체 게시글페이지로 이동

// 사용자 정보를 페이지에 보내주는 라우터
// 미들웨어를 거쳐서 암호화 된 정보를 클라이언트에 넘겨주는 것
router.get('/users/me', authMiddleware, async (req, res) => { // 로컬스토리지에 있는 값을 미들웨어를 통해 헤드로 넣기 위한 작업
  const { user } = res.locals;
  // console.log(user);
  res.send({ user });
});

module.exports = router;
