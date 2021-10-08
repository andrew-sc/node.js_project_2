const { signUpValidation } = require("../controller/signUp");


describe('API테스트의 작동 테스트', () => {
  test('true === true 로 잘 작동하는가?', () => {
    expect(true).toBe(true);
  });
});

describe('로그인시 조건 만족 테스트', () => {
  test('nickname too short', async () => {
    const nickName = "";
    const pw = "";
    const pwCheck = "";
    const status = 400;
    const send = { result: '회원 등록에 성공하셨습니다.' }
    const req = {
      body: {
        nickName: nickName,
        pw: pw,
        pwCheck: pwCheck,
      }
    }
    const send = jest.fn();
    const res = {
      status: status,
      send: send,
    }
    signUpValidation(req, res);

    expect(send).toBeCalledWith({result:'회원가입이 완료되었습니다.'});
  });
});




