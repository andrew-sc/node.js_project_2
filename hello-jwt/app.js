const jwt = require("jsonwebtoken");

const token = jwt.sign({ test: true}, 'secretKey');

console.log(token);

const decorded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2MzI5OTM2NzF9.4qj076cQc8d-qf4UIxTDR5XmL0mbtZnZANOfCrYlbqU",'secretKey');
const decordedTwo = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2MzI5OTM2NzF9.4qj076cQc8d-qf4UIxTDR5XmL0mbtZnZANOfCrYlbqU");

console.log(decorded);
console.log(decordedTwo);