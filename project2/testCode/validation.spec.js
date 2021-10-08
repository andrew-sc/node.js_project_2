const connect = require('../schemas/db');
const User = require('../schemas/user');
const supertest = require("supertest");
const server = require('../index');
const

const userIds = [];
beforeAll(async () => {
    await connect();
    const user = await User.create({ nickName: 'sampleUser', pw: '9876' });
    userIds.push(user._id);
});

describe('API테스트의 작동 테스트', () => {
  test('true === true 로 잘 작동하는가?', () => {
    expect(true).toBe(true);
  });
});

describe('로그인시 조건 만족', () => {
  app = supertest(server);
  // 닉네임 길이
  test('nickname too short', async () => {
    const res = await app.post('/api/users/signup').send( req.body = {
      nickName: 'test1234',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(200);
    expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('nickname too short', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'te',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(400);
    expect(res.send).toBe({ result: 'valiationFailed', errorMessage: '옳바른 형식이 아닙니다.' });
  });


  // 닉네임 특수문자
  test('nickname can include 0~9 and A~Z and a~z.', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'Test1',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(200);
    expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('nickname can include 0~9 and A~Z and a~z.', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'Test1!',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(400);
    expect(res.send).toBe({ result: 'valiationFailed', errorMessage: '옳바른 형식이 아닙니다.' });
  });

  test('nickname can include 0~9 and A~Z and a~z.', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'Test1+',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(400);
    expect(res.send).toBe({ result: 'valiationFailed', errorMessage: '옳바른 형식이 아닙니다.' });
  });


  //비밀번호 4자이상
  test('password too short', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'test1234',
      pw: '1111',
      pwCheck: '1111',
    });
    expect(res.status).toBe(200);
    expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('password too short', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'test1234',
      pw: '111',
      pwCheck: '111',
    });
    expect(res.status).toBe(400);
    expect(res.send).toBe({ result: 'valiationFailed', errorMessage: '옳바른 형식이 아닙니다.' });
  });

  test('password too short', async () => {
    const res = await app.post('/api/users/signup').send({
      nickName: 'test1234',
      pw: 'abc',
      pwCheck: 'abc',
    });
    expect(res.status).toBe(400);
    expect(res.send).toBe({ result: 'valiationFailed', errorMessage: '옳바른 형식이 아닙니다.' });
  });


  // 비밀번호에 아이디 포함
  test('password includes nickname', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'test1234',
        pw: '1111',
        pwCheck: '1111',
      });
      expect(res.status).toBe(200);
      expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('password includes nickname', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'test1234',
        pw: 'test1234',
        pwCheck: 'test1234',
      });
      expect(res.status).toBe(400);
      expect(res.send).toBe({ result: 'pwOverlapNickName', errorMessage: '닉네임과 패스워드를 겹치지 않게 설정해 주세요.' });
  });


  // pw와 pwCheck 동일?
  test('incorrect password and passwordCheck', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'test1234',
        pw: '1111',
        pwCheck: '1111',
      });
      expect(res.status).toBe(200);
      expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('incorrect password and passwordCheck', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'test1234',
        pw: '1234',
        pwCheck: '5678',
      });
      expect(res.status).toBe(400);
      expect(res.send).toBe({ result: 'pwCheckNotSamePw', errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
  });

  test('incorrect password and passwordCheck', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'test1234',
        pw: 'thisisPassword',
        pwCheck: 'thisisPasswrod',
      });
      expect(res.status).toBe(400);
      expect(res.send).toBe({ result: 'pwCheckNotSamePw', errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
  });


  // 닉네임중복
  test('duplicated username', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'poiu1234',
        pw: '1111',
        pwCheck: '1111',
      });
      expect(res.status).toBe(200);
      expect(res.send).toBe({ result: '회원 등록에 성공하셨습니다.' });
  });

  test('duplicated username', async () => {
    const res = await app.post('/api/users/signup').send({
        nickName: 'sampleUser',
        pw: '1111',
        pwCheck: '1111',
      });
      expect(res.status).toBe(400);
      expect(res.send).toBe({ result: 'nickNameUsed', errorMessage: '중복된 닉네임입니다.' });
  });
});

afterAll(async () => {
    await User.deleteMany({ _id: userIds });
})