const Jwt = require('jsonwebtoken');
const { User } = require('../schemas/user');

module.exports = (req, res, next) => {
  console.log(req.headers);

  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    return;
  }

  try {
    const { targetNickName } = jwt.verify(tokenValue, 'project2Key');
    User.findOne(targetNickName).then((targetUser) => {
      res.locals.user = targetUser; //locals는 데이터에서 사용자가 마음대로 사용할 수 있는 공간..
      next();
    });
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    return;
  }
};
