const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");


mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});


//할 일 목록을 불러오는 라우터
router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();

  res.send({ todos });

})


//할일을 추가하는 라우터
router.post("/todos", async (req, res) => {
  const { value } = req.body;
  //console.log(value );

  const maxOrderTodo = await Todo.findOne().sort( "-order" ).exec(); //현재 db에 있는 값을 내림차순으로 찾아온다 / .exec() <<?
  //console.log(maxOrderTodo);
  
  let order = 1; //오더의 기본값을 1로 지정 왜냐 아무것도 없을 때 1로 저장되어야 그 이후에도 순차적으로 쌓일 수 있다.

  if ( maxOrderTodo ){ //만약 max가 있을 때,
    order = maxOrderTodo.order + 1;
  }

  const todo = new Todo({ value, order }); //Todo라는 todo.js에 정의된 모델을 이용하여 todo에 벨류와 오더를 저장한다 
  //console.log(todo);
  await todo.save(); //투두 저장!


  res.send( {todo} );
});

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order } = req.body;
  const { value } = req.body;
  const { done } = req.body;
  console.log(todoId, order, value, done, Boolean(done));

  const todo = await Todo.findById(todoId).exec();
  console.log(todo);

  if ( order ) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = todo.order;
      await targetTodo.save();
    }
    todo.order = order;
    await todo.save();

  } else if (value) {
    todo.value = value;
    await todo.save();
    console.log(todo);

  }  else if (done !== undefined) { // done가 언디파인드가 아닐 때,
    todo.doneAt = done ? new Date() : null; //던이 참과 거짓에 따라 뉴데이트 or 눌 을 저장해준다
    await todo.save();
  }

  res.send({});
});

//할 일 삭제
router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  console.log(todoId)

  const todo = await Todo.findOne({ todoId }).exec();
  console.log(todo)

  if (todo) {
    await Todo.deleteOne({ todoId }).exec();
  }
  res.send({});
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});