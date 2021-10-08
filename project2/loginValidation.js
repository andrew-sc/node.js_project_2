try {
  //검사1 : 글자수, 닉네임 형식
  const { nickName, pw, pwCheck } = await userSchema.validateAsync(req.body);
  // console.log(nickName, pw, pwCheck);

  //검사2 : 비밀번호에 닉네임 포함되는가?
  if (pw.match(nickName) !== null) {
    console.log('비밀번호가 닉네임에 중복값이 있다.');
    return res.status(400).send({
      result: 'pwOverlapNickName',
      errorMessage: '옳바른 형식이 아닙니다.',
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
  return res.status(200).send({
    result: '회원 등록에 성공하셨습니다.',
  });

} catch (error) {
  //console.log(error);
  return res.status(400).send({
    result: 'valiationFailed',
    errorMessage: '옳바른 형식이 아닙니다.',
  });
}






//기존코드
// router.post('/users/signup', async (req, res) => {
//     console.log(req.body);
  
//     try {
//       //검사1 : 글자수, 닉네임 형식
//       const { nickName, pw, pwCheck } = await userSchema.validateAsync(req.body);
//       // console.log(nickName, pw, pwCheck);
  
//       //검사2 : 비밀번호에 닉네임 포함여부
//       if (pw.match(nickName) === null) {
//         // 검사3 : 비밀번호와 비밀번호체크가 완전 동일함
//         if (pw === pwCheck) {
//           let isNick = await User.findOne({ nickName });
//           console.log(isNick);
  
//           if (!isNick) {
//             await User.create({ nickName: nickName, pw: pw });
//             return res.status(200).send({
//               result: '회원 등록에 성공하셨습니다.',
//             });
//           } else {
//             console.log('중복된 닉네임');
//             return res.status(400).send({
//               result: 'nickNameUsed',
//               errorMessage: '중복된 닉네임입니다.',
//             });
//           }
//         } else {
//           console.log('비밀번호가 일치하지 않는다');
//           return res.status(400).send({
//             result: 'pwCheckNotSamePw',
//             errorMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
//           });
//         }
//       } else {
//         console.log('비밀번호가 닉네임에 중복값이 있다.');
//         return res.status(400).send({
//           result: 'pwOverlapNickName',
//           errorMessage: '옳바른 형식이 아닙니다.',
//         });
//       }
//     } catch (err) {
//       //console.log(err);
//       return res.status(400).send({
//         result: 'valiationFailed',
//         errorMessage: '옳바른 형식이 아닙니다.',
//       });
//     }
//   });