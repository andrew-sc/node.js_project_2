const express = require('express');
const router = express.Router();

const Post = require('../schemas/post');
const allPost = require('../schemas/all_post');
const Comment = require('../schemas/comment');
const authMiddleware = require('../middlewares/auth-middleware');

// 요구

//     전체 포스트를 불러오는 기능-완
// 제목, 작성자명, 작성날짜 보여주기
// 날짜기준 내림차순
// 게시글에 링크필요(클릭시 조회페이지)
router.get('/main', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ postTime: -1 });
    res.json({ posts: posts });
  } catch (err) {
    console.error(err);
  }
});

//     각 포스트 작성페이지-완
// 제목, 작성자명, 비밀번호, 내용 입력
// 글쓰기 버튼 > 게시글 목록조회 페이지 + 작성게시물이 1번으로 도출

router.post('/post/add', authMiddleware, async (req, res, next) => {
  const { title, writer, pw, contents, postTime } = await req.body; // {키:벨류, 키:벨류 ...} 의 형태로의 지정 형식
  //console.log(title, writer, pw, contents, postTime)

  await Post.create({ title, writer, pw, contents, postTime }); // 몽구스에서 자동으로 갑과 같은 이름으로 컬럼들을 만들어줌
  res.send({ result: 'success' });
});

//     포스트 상세페이지 - 완
// 제목, 작성자명, 날짜, 작성 내용을 띄워줌
router.get('/post/detail/:postTime', async (req, res) => {
  const { postTime } = req.params;

  const post_result = await Post.findOne({ postTime: postTime });
  res.json({ result: post_result });
});

//     포스트 수정기능
// 수정하기 클릭시 원래 값 유지상태로 도출 - 버튼
// 비밀번호 비워두기
// 수정완료btn 삭제하기btn
// 비밀번호 비교 후 동일할 때만 실행

// db에서 값들을 끌어오는 것은 상세페이지의 api사용!!

router.put('/post/edit/save', authMiddleware, async (req, res) => {
  // db에서 해당 post의 값을 수정하기

  const { title_edited, writer_edited, pw_edited, contents_edited, postTime } =
    await req.body; //새로입력
  console.log(
    title_edited,
    writer_edited,
    pw_edited,
    contents_edited,
    postTime
  );

  const result = await Post.findOne({ postTime }); //기존입력녀석
  console.log(result);
  const pwOrigin = result['pw'];
  console.log(pwOrigin, String(pwOrigin));
  if (pw_edited === pwOrigin) {
    await Post.updateOne(
      { postTime: postTime },
      {
        $set: {
          title: title_edited,
          writer: writer_edited,
          contents: contents_edited,
        },
      }
    );
    res.send({ result: 'success' });
  } else {
    console.log('pw가 옳바르지 않습니다.');
    res.send({ result: 'failure' });
  }
});

//     포스트 삭제기능
// 비밀번호 비교 후 동일할 때만 실행
router.delete(
  '/post/edit/delete/:postTime',
  authMiddleware,
  async (req, res) => {
    const postTime = req.params.postTime;
    console.log(postTime);
    const inPutPw = req.body.inPutPw;
    console.log(inPutPw);
    const pwOrigin = await Post.findOne({ postTime });
    console.log(pwOrigin.pw);

    if (inPutPw === pwOrigin.pw) {
      await Post.deleteOne({ postTime });
      console.log('삭제 완료');
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  }
);

// 게시글 detail 페이지 댓글 등록

//댓글 작성칸을 누를 때, "로그인이 필요한 기능입니다." 띄우기(완)
//내용을 비운채 등록을 누른경우 "댓글 내용을 입력해주세요"(완)

router.post('/posts/comments', async (req, res) => {
  console.log(req.body);
  if (req.body.contents === '') {
    return res
      .status(400)
      .send({
        result: 'contentsValueEmpty',
        errorMsg: '댓글 내용을 입력해 주세요',
      });
  }

  const { postId, userId, contents, commentTime } = await req.body;

  try {
    await Comment.create({ postId, userId, contents, commentTime });
    return res
      .status(200)
      .send({ result: 'success', successMsg: '댓글 등록 성공!' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({
        result: 'failure',
        errorMsg: '알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.',
      });
  }
});

// 게시글 detail 페이지의 댓글
//특정 게시물의 전체 댓글 불러오기(완)
//로그인 하지 않아도 열람 가능(완)
//현재 조회 중인 게시글에 작성된 모든 댓글 목록으로 보기(완)
//비로그인상태일때 댓글박스 클릭 >> 알럿 >> 로그인페이지로이동(완)
//댓글창이 빈상태 >> 등록 버튼 클릭 >> 알럿("내용을 입력해 주세요")
//내가 작성한 댓글에만 (수정,삭제) 버튼 표시

router.get('/posts/comments', async (req, res) => {
  try {
    const commentsList = await Comment.find({}).sort({ commentTime: -1 });
    console.log(commentsList);
    return res.status(200).send({ commentsList });
  } catch (error) {
    return res
      .status(400)
      .send({
        result: 'failure',
        errorMsg: '알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.',
      });
  }
});

// 댓글 수정
//내가 작성한 댓글만 수정 가능하게 하기
//댓글 본문이 사라짐 > 댓글 내용 + 저장버튼 생성
//댓글의 기본값은 이전에 입력했던 내용
//수정버튼을 누르면 값이 없는 채로 이동 못함
//저장을 누르면 새로입력한 내용으로 바꾸기
router.patch('/posts/comments', async (req, res) => {
    try{
        const { _id, newContents } = await req.body;
        console.log(_id, newContents);
        await Comment.updateOne({_id},{$set: {"contents" : newContents}});
        return res.status(200).send({ result: 'success', successMsg: '댓글 수정이 완료되었습니다.' });
    } catch(error) {
        return res
      .status(400)
      .send({
        resutl: 'failure',
        errorMsg: '알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.',
      });
    }
});

// 댓글 삭제
//내가 작성한 댓글만 삭제가능
//confirm("정말로 삭제하시겠습니까?") >> 확인 >> 삭제실행
// 취소를 누른경우 유지
router.delete('/posts/comments', async (req, res) => {
  try {
    const { userId, _id, postTime } = await req.body;
    await Comment.deleteOne({ userId, _id, postTime });
    return res.status(200).send({ result: 'success' });
  } catch (error) {
    return res
      .status(400)
      .send({
        resutl: 'failure',
        errorMsg: '알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.',
      });
  }
});

module.exports = router;
