//map
const prac = [1, 2, 3];

let result = prac.map((elements) => {
  console.log(elements);
  return elements + 1;
});

console.log(prac);
console.log(result);

if (prac === result) {
  console.log('같다');
} else {
  console.log('다르다');
}

//map은 기존의 배열을 1대1로 짝을 짓지만, 새로운 배열을 만들어내는 method

//reduce

const reducePac = [1, 2, 3];

// 배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값);
let result2 = reducePac.reduce((acc, cur, index) => {
  console.log(acc, cur, index);
  return acc + cur;
}, 0);
console.log(result2);

let result3 = reducePac.reduce((acc, cur) => {
  console.log(acc, cur);
  acc.push(cur % 2 ? '홀수' : '짝수');
  return acc;
}, []);
console.log(result3);
