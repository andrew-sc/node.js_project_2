const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://test:test@3.36.130.160:27017/node_pj1?authSource=admin", {
        useNewUrlParser: true,
        ignoreUndefined: true
      })
      .catch(err => console.log(err));
  };
  
  mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
  });
  
  module.exports = connect;