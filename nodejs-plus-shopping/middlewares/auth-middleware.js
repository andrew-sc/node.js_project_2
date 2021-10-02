const jwt = require("jsonwebtoken");
const { User } = require("../models");

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
        const { userId } = jwt.verify(tokenValue, "seceretKey")
        
        User.findByPk(userId).then((user) => { //저기 then은 어디서 나온 녀석인지 질문 필요!
            // console.log("마이어떠미들웨어", user)
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


// async/await 사용여부 확인
// module.exports = async (req, res, next) => {
//     const { authorization } = req.headers;
//     const [tokenType, tokenValue] = authorization.split(' ');

//     if (tokenType !== 'Bearer') {
//         res.status(401).send({
//             errorMessage: '로그인 후 사용하세요.'
//         });
//         return;
//     }

//     try {
//         const { userId } = jwt.verify(tokenValue, "seceretKey")
        
//         const a = await User.findById(userId).exec(); //저기 then은 어디서 나온 녀석인지 질문 필요!
//             res.locals.user = a; //locals는 데이터에서 사용자가 마음대로 사용할 수 있는 공간..
//             next(); //위의 경우를 통과하는 상황에서만 next가 허용된다.
    
//     } catch(error) {
//         res.status(401).send({
//             errorMessage: '로그인 후 사용하세요.'
//         });
//         return;
//     }

// };