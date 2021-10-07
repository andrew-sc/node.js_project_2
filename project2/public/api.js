function getSelf(callback) {
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