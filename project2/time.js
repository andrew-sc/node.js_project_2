let time = new Date();          

let timeYear = String(time.getFullYear()) //년

let timeMonth = "" //월
if (String(time.getMonth()+1).length == 1 ){ //월이 1자리 수일때 2자리로 표현
    timeMonth = "0" + String(time.getMonth()+1)
} else {
    timeMonth = String(time.getMonth()+1)
};

let timeDate = String(time.getDate()) //일
let timeHours = String(time.getHours()) //시
let timeMinutes = String(time.getMinutes()) //분

let timeSec =""; //초
if (String(time.getSeconds()).length < 2 ){ //초가 1자리 수일때 2자리로 표현
    timeSec = "0" + String(time.getSeconds())
} else {
    timeSec = String(time.getSeconds())
};

let timeMisec = ""; //밀리초
if (String(time.getMilliseconds()).length < 1 ){ //밀리초가 1자리 수일때 3자리로 표현
    timeMisec = "00" + String(time.getMilliseconds())
} else if (String(time.getMilliseconds()).length == 2){ //밀리초가 2자리 수일때 3자리로 표현
    timeMisec = "0" + String(time.getMilliseconds())
} else {
    timeMisec = String(time.getMilliseconds())
}


let timeNow = timeYear.concat(timeMonth,timeDate,timeHours,timeMinutes,timeSec,timeMisec); //문자열
let intTimeNow = Number(timeNow);
console.log(timeNow, intTimeNow);
console.log(timeNow.length)

let dateY = timeNow.substr(0,4);
let dateM = timeNow.substr(4,2);
let dateD = timeNow.substr(6,2);
console.log(dateY, dateM, dateD);
