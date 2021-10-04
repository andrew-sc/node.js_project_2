function test(a) {
    if (a === connect) {
        return console.log("연결!")
    } else if (a === "dis") {
        return console.log("연결해제!")
    }
}

test(connect);
