const express = require("express");
const router = express.Router();

const Post = require("../schemas/post");
const allPost = require("../schemas/all_post");


// 요구


//     전체 포스트를 불러오는 기능-완
// 제목, 작성자명, 작성날짜 보여주기
// 날짜기준 내림차순
// 게시글에 링크필요(클릭시 조회페이지)
router.get("/main", async(req, res) => {
    try{
        const posts = await Post.find({}).sort({"postTime": -1})
        res.json({ posts: posts })
    } catch (err) {
        console.error(err);
    }
})

//     각 포스트 작성페이지-완
// 제목, 작성자명, 비밀번호, 내용 입력
// 글쓰기 버튼 > 게시글 목록조회 페이지 + 작성게시물이 1번으로 도출

router.post("/post/add", async(req, res, next) => {
    const { title, writer, pw, contents, postTime } = await req.body; // {키:벨류, 키:벨류 ...} 의 형태로의 지정 형식
    //console.log(title, writer, pw, contents, postTime)

    await Post.create({ title, writer, pw, contents, postTime }); // 몽구스에서 자동으로 갑과 같은 이름으로 컬럼들을 만들어줌
    res.send({result : "success"})
})



//     포스트 상세페이지 - 완
// 제목, 작성자명, 날짜, 작성 내용을 띄워줌
router.get("/post/detail/:postTime", async (req, res) => {
   
    const { postTime } = req.params;
    
    const post_result = await Post.findOne({ postTime : postTime });
    res.json({ result : post_result })
});

//     포스트 수정기능
// 수정하기 클릭시 원래 값 유지상태로 도출 - 버튼
// 비밀번호 비워두기
// 수정완료btn 삭제하기btn
// 비밀번호 비교 후 동일할 때만 실행

// db에서 값들을 끌어오는 것은 상세페이지의 api사용!!

router.put("/post/edit/save", async(req, res) => { // db에서 해당 post의 값을 수정하기
    
    const { title_edited, writer_edited, pw_edited, contents_edited, postTime } = await req.body; //새로입력
    console.log(title_edited, writer_edited, pw_edited, contents_edited, postTime)

    const result = await Post.findOne({ postTime }); //기존입력녀석
    console.log(result)
    const pwOrigin = result["pw"];
    console.log(pwOrigin, String(pwOrigin))
    if( pw_edited === pwOrigin) {
        await Post.updateOne({ postTime: postTime }, { $set: { "title" : title_edited, "writer": writer_edited, "contents": contents_edited} });
        res.send({result : "success"})
    } else {
        console.log("pw가 옳바르지 않습니다.")
        res.send({result : "failure"})
    }
});



//     포스트 삭제기능
// 비밀번호 비교 후 동일할 때만 실행
router.delete("/post/edit/delete/:postTime", async (req,res) => {
    const postTime = req.params.postTime;
    console.log(postTime);
    const inPutPw = req.body.inPutPw;
    console.log(inPutPw);
    const pwOrigin = await Post.findOne({postTime});
    console.log(pwOrigin.pw);
    
    if(inPutPw === pwOrigin.pw) {
        await Post.deleteOne({postTime});
        console.log("삭제 완료")
        res.send({ result: "success" });
    } else {
        res.send({ result: "fail" });
    }
})

//구현?
//      검색기능

module.exports = router;