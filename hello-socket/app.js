const express = require("express");
const Http = require("http"); //http는 노드.js에서 기본적으로 지원한다
const socketIo = require("socket.io");

const app = express();
const http = Http.createServer(app); // Http.createServer(인자) 는 인자를 받아와서 새로운 서버로 확장 할 수 있게 도와줌
const io = socketIo(http, {
    cors: {
        origin: "*", //origin은 여기에 명시되어 있는 것만 연결할거야! 라는 뜻
        methods: ["GET", "POST"], //메소드에 대한 제약
    },
});

app.get("/test", (req, res) => {
    res.send("express is working!");
});

http.listen(3000, () => {
    console.log("서버가 켜졌습니다!");
});

io.on("connection", (socket) => { //클라이언트가 계속 연결요청을 함
    console.log("연결이 되었습니다!")

    socket.send("너 연결 완료야!") // 서버는 항상 준비되어있고 소켓을 통하여 연걸을 동작하기 때문에 바로 반응이온다
                                    // send 는 항상 "messege"로 간다
    socket.emit("customEventName","새로운 이벤트인가?"); //emit는 커스텀이벤트를 만들 수 있다
    // emit의 구성 emit("소켓의 경로", "인자"); 서버에서 경로를 지정해주면 그것이 인자를 가지고 넘어가서 브라우저에서 만난다

});