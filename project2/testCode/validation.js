const connect = require('../schemas/db')

function login() {
    let nickName = $('#login_nickName').val();
    let pw = $('#login_pw').val();

    $.ajax({
      type: "POST",
      url: `/api/auth`,
      data: { nickName, pw },
      success: function (response) {
        if (response["result"] === "success") {
          localStorage.setItem("token", response.token); //.setItem 은 로컬스토리지에 저장하는 것의 키:벨류 를 정하기 가능
          window.location.href='/main';
        } else if (response["result"] === "failure") {
           alert(response["errorMessage"]);
           return;
        }
      },
      error: function(error) { 
       // console.log(error);
       alert(error.responseJSON.errorMessage);
       return;
     }
   });
  };