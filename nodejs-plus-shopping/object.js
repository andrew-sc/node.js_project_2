let object1 = new Object();
console.log(object1);
// object 는 배열을 만들어내는 method

object1 = ({
    key1: "value1",
    key2: "value2",
    key3: "value3",
});

console.log(object1);
let keys = Object.keys(object1);
let values = Object.values(object1); 

console.log(keys);
console.log(values);

console.log(Object.keys(object1));
console.log(Object.values(object1));

console.log(Object.entries(object1));

// Object.keys(객체) : 객체의 key들을 선별한다
// Object.values(객체) : 객체의 values들을 선별한다
// Object.entries(객체) : 객체의 [key:value]들을 각각 선별한 리스트를 뽑는다