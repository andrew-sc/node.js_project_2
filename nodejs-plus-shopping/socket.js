const { connect, disconnect } = require('mongoose');
const socketIo = require('socket.io');
const http = require('./app');
const io = socketIo(http);

const socketIdMap = {};

function emitSamePageViewerCount() {
  const conuntByUrl = Object.values(socketIdMap).reduce((value, url) => {
    //오브젝트.벨류스 는 맵이 가진 ket:value 에서 벨류만 쫙 뽑아서 list로 만들어준다.
    // reduce라는 함수는 1인자로 콜백함수, 2인자로 초기값이 들어간다.
    // 1인자인 콜백함수에도 누적값, 현재값, 인덱스, 요소 의 순으로 인자가 들어 갈 수 있다.
    return {
      ...value,
      [url]: value[url] ? value[url] + 1 : 1, //여기서 url은 socket.id로
    };
  }, {});

  console.log(conuntByUrl);

  for (const [socketId, url] of Object.entries(socketIdMap)) {
    const count = conuntByUrl[url];
    io.to(socketId).emit('SAME_PAGE_VIEWER_COUNT', count);
  }
}

function initSocket(sock) {
  console.log('새로운 소켓이 연결됐어요!');

  // 특정 이벤트가 전달됐는지 감지할 때 사용될 함수
  function watchEvent(event, func) {
    sock.on(event, func);
  }

  // 연결된 모든 클라이언트에 데이터를 보낼때 사용될 함수
  function notifyEveryone(event, data) {
    io.emit(event, data);
  }

  // 현재 브라우저를 제외한 모든 클라이언트에 데이터를 보낼 때,
  function notifyExceptMe(event, data) {
    socket.broadcast.emit(event, data);
  }

  return {
    watchBuying: () => {
      watchEvent('BUY', (data) => {
        const emitData = {
          ...data,
          date: new Date().toISOString(),
        };
        notifyExceptMe('BUY_GOODS', emitData);
      });
    },

    watchDisconnec: () => {
      watchEvent('disconnect', () => {
        console.log(sock.id, '연결이 끊어졌어요!');
        delete socketIdMap[sock.id];
        emitSamePageViewerCount();
      });
    },
  };
}

io.on('connection', (socket) => {
  const { watchBuying, watchDisconnec } = initSocket(socket);
  socketIdMap[socket.id] = null;
  watchBuying();

  socket.on('CHANGED_PAGE', (data) => {
    console.log('페이지가 바뀌었대요', data, socket.id);
    socketIdMap[socket.id] = data;
    emitSamePageViewerCount();
  });
  watchDisconnec();
});
