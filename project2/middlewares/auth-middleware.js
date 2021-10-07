const Jwt = require("jsonwebtoken");
const User = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.1',
    });
    return;
  }

  try {
    const targetNickName = Jwt.verify(tokenValue, 'project-Two-Key');
    // console.log(targetNickName, targetNickName.nickName);
    User.findOne({"nickName" : targetNickName.nickName}).then((targetUser) => {
      res.locals.user = targetUser; //locals는 데이터에서 사용자가 마음대로 사용할 수 있는 공간..
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.2',
    });
    return;
  }
};
