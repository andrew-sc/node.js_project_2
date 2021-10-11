const { signUpValidation, signUpContorllerFunctions } = require("../controller/signUp");


describe('API테스트의 작동 테스트', () => {
  test('true === true 로 잘 작동하는가?', () => {
    expect(true).toBe(true);
  });
});

describe('로그인시 조건 만족 테스트', () => {

  test('nickname too short', async () => {
    const nickName = "t";
    const pw = "1111";
    const pwCheck = "1111";

    signUpContorllerFunctions(nickName, pw, pwCheck);

    expect(false).toEqual(false);
  });
});