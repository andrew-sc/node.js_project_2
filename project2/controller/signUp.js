const User = require('../schemas/user');
const Joi = require('joi');

const signUpContorller = {
  signUpValidation: async (req, res) => {
    const userSchema = Joi.object({
      nickName: Joi.string()
        .min(3)
        .regex(/^[0-9a-z]+$/i)
        .required(),
      pw: Joi.string().min(4).required(),
      pwCheck: Joi.string().min(4).required(),
    });

    console.log(req.body);

    //검증시작!
    try {
      //검사1 : 글자수, 닉네임 형식
      const { nickName, pw, pwCheck } = await userSchema.validateAsync(
        req.body
      );
      // console.log(nickName, pw, pwCheck);

      //검사2 : 비밀번호에 닉네임 포함되는가?
      if (pw.match(nickName) !== null) {
        console.log('비밀번호가 닉네임에 중복값이 있다.');
        return res.status(400).send({
          result: 'pwOverlapNickName',
          errorMessage: '닉네임과 패스워드를 겹치지 않게 설정해 주세요.',
        });
      }

      // 검사3 : 비밀번호와 비밀번호체크가 완전 동일한가?
      if (pw !== pwCheck) {
        console.log('비밀번호가 일치하지 않는다');
        return res.status(400).send({
          result: 'pwCheckNotSamePw',
          errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        });
      }

      // 검사4 : 데이터베이스에 중복 닉네임이 있는가?
      let isNick = await User.findOne({ nickName });
      console.log(isNick);

      if (isNick) {
        console.log('중복된 닉네임');
        return res.status(400).send({
          result: 'nickNameUsed',
          errorMessage: '중복된 닉네임입니다.',
        });
      }

      await User.create({ nickName: nickName, pw: pw });
      res.status(200);
      res.send({ result: '회원 등록에 성공하셨습니다.' });
      return;
    } catch (error) {
      //console.log(error);
      return res.status(400).send({
        result: 'valiationFailed',
        errorMessage: '옳바른 형식이 아닙니다.',
      });
    }
  },
};

module.exports = signUpContorller;

// const signUpContorllerFunctions = {
//   joiValidation: async (nickName, pw, pwCheck) => {
//     try {
//       const userSchema = Joi.object({
//         nickName: Joi.string()
//           .min(3)
//           .regex(/^[0-9a-z]+$/i)
//           .required(),
//         pw: Joi.string().min(4).required(),
//         pwCheck: Joi.string().min(3).required(),
//       });

//       const { nickName, pw, pwCheck } = await userSchema.validateAsync({
//         nickName,
//         pw,
//         pwCheck,
//       });

//       let makeUser = await User.create({ nickName: nickName, pw: pw });

//       res.status(200);
//       res.send({ result: '회원 등록에 성공하셨습니다.' });
//       return true;
//     } catch (error) {
//       res.status(400);
//       res.send({
//         result: 'valiationFailed',
//         errorMessage: '옳바른 형식이 아닙니다.',
//       });
//       return false;
//     }
//   },

//   pwIncludeNickNameValidation: function (nickName, pw, pwCheck) {
//     if (pw.match(nickName) !== null) {
//       return true;
//     } else {
//       console.log('비밀번호가 닉네임에 중복값이 있다.');
//       res.status(400);
//       res.send({
//         result: 'pwOverlapNickName',
//         errorMessage: '닉네임과 패스워드를 겹치지 않게 설정해 주세요.',
//       });
//       return false;
//     }
//   },

//   correctPwAndPwCheck: function (nickName, pw, pwCheck) {
//     if (pw === pwCheck) {
//       return true;
//     } else {
//       console.log('비밀번호가 일치하지 않는다');
//       res.status(400).send({
//         result: 'pwCheckNotSamePw',
//         errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
//       });
//       return false;
//     }
//   },

//   duqlatedNickName: async (nickName, pw, pwCheck) => {
//     let isNick = await User.findOne({ nickName });

//     if (!isNick) {
//       return true;
//     } else {
//       console.log('중복된 닉네임');
//       res.status(400).send({
//         result: 'nickNameUsed',
//         errorMessage: '중복된 닉네임입니다.',
//       });
//       return false;
//     }
//   },
// };

// module.exports = signUpContorllerFunctions;

// console.log(signUpContorller);
// console.log(signUpContorllerFunctions);
