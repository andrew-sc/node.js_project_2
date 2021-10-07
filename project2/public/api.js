function getSelf(callback) {
  // 로컬스토리지에 토큰이 있다는 것은 로그인을 했다는 증거, 그래서 그 여부에 따라 함수 실행을 결정
  if (localStorage.getItem('token') === null ){
    return;
  }

  $.ajax({
    type: 'GET',
    url: '/api/users/me',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      callback(response.user); //user정보가 있다는 것을 확인 완료
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    },
  });
}

function signOut() {
  localStorage.clear();
  window.location.href = '/';
}