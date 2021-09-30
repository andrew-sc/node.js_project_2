const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        });
        return;
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'seceretKey')
        
        User.findById(userId).exec().then((user) => {
            res.locals.user = user; //locals는 데이터에서 사용자가 마음대로 사용할 수 있는 공간..
            next(); //위의 경우를 통과하는 상황에서만 next가 허용된다.
        });
    } catch(error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        });
        return;
    }

};