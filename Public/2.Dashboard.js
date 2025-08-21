// public/js/dashboard.js

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// ✅ Redirect to login if no token
if (!getToken()) {
  window.location.href = "login.html";
}
