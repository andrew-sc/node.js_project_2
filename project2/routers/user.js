const express = require('express');
const router = express.Router();
const Users = require('../schemas/user');

// 회원가입
// 닉네임 제약 - 최소3자(확)
// 닉네임 제약 - 알파벳 대소문자(a-z,A-Z), 숫자(0-9)(확)
// 비밀번호 제약 - 최소 4자(확)
// 비밀번호 제약 - 닉네임과 같은 값이 표함된 경우 회원 등록 실패(확)
// pw와 pwCheck는 정확하게 일치(확)
// db에 있는 닉네임인 경우 "중복된 닉네임입니다."라는 에러메세지를 프론트엔드??에서 보여주기(확)
// 회원가입 버튼을 누르고 에러메세지가 안뜨면 로그인 페이지로 ㄱㄱ >> 그렇다면 로그인페이지에서 토큰이 있으면 목록페이지로 전달?(확)
router.post('/users/signup', async (req, res) => {
  const { nickName, pw, pwCheck } = req.body;
  console.log(nickName, pw, pwCheck);

  //형식검사
  if (pw === pwCheck) {
    //검증
    let isNick = await Users.findOne({ nickNmame });
    console.log(isNick);
    if (!isNick) {
        await Users.create({ "nickName": nickName, "pw": pw });
        return res.status(200).send({ result: 'success' });
    } else {
        console.log('중복된 닉네임입니다.');
        return res.status(400).send({ result: 'failuare' });
    }
  } else {
      console.log("비밀번호가 일치하지 않는다")
      return res.status(400).send({result : "wrongPassword"});
  }
});

// 닉네임 중복검사 api
router.post('/users/signup/chek', async (req, res) => {
  const { nickName } = req.body.nickName;
  console.log(nickName);

  let isNick = await Users.findOne({ nickName });
  console.log(isNick);
  if (isNick) {
    return res.status(400).send({ result: 'failure' });
  } else {
    return res.status(200).send({ result: 'success' });
  }
});

// 로그인
// 로그인시 닉네임과 비밀번호가 데이터베이스에 등록된 것인지 확인
// 틀린 정보가 있다면 "닉네임 또는 페스워드를 확인해 주세요" 메세지 보여주기
// 에러가 없다면 전체 게시글 목록조회로 이동
router.post('/users', async (req, res) => {
  const { nickNmae, pw } = req.body;
  console.log(nickNmae, pw);

  //회원여부확인
  let isUser = await Users.findOne({ nickNmame });
  console.log(isUser);
  if (isUser) {
    console.log('유저확인 완료');
    console.log('로그인 진행');
    return res.status(200).render('/main?id:' + nickNmae);
  } else {
    console.log('유저가 아닙니다.');
    return res.status(400).send({ result: 'failure' });
  }
});

//로그인 검사
// 회원가입/로그인/게시글목록조회/게시글조회 를 제외한 나머지 페이지는 로그인시에만 허용
// 로그인을 하지 않거나, 올바르지 않은 경로로 접속한 사용자 > "로그인이 필요합니다" > 로그인페이지로 이동
// 로그인을 한 사용자가 로그인 or 회원가입 페이지에 접속한 경우 "이미 로그인이 되어있습니다" - 전체 게시글페이지로 이동








module.exports = router;