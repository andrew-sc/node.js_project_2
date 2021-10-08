let id = 'timegoeson';
let pw = 'timetable';
let result1 = pw.match(id);
let result1_1 = id.match(pw);

let result2 = pw.includes(id);
let result2_2 = id.includes(pw);

console.log(result1, result1_1, result2, result2_2);

if(result1 === null){
    console.log("중복없음");
} else if (result1 !== null) {
    console.log("중복있음!!!!");
}