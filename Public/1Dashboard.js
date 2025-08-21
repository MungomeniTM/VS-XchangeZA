window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
  } else {
    console.log("✅ User is authenticated.");
    // fetch user profile with token if needed
  }
});
