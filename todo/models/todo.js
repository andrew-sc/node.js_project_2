const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date, //날짜형식, 체크를 수행한 시간을 표기하기 위해
    order: Number
});

TodoSchema.virtual("todoId").get(function(){
    return this._id.toHexString();
});
TodoSchema.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("Todo", TodoSchema);