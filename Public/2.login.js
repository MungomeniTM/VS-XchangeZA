// public/js/login.js

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  const feedback = document.getElementById("login-feedback");
  feedback.textContent = "";

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      feedback.textContent = data.message || "Login failed.";
      return;
    }

    // ✅ Save token (sessionStorage by default, localStorage if "remember me")
    if (remember) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }

    // ✅ Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (err) {
    feedback.textContent = "Something went wrong. Please try again.";
    console.error("Login error:", err);
  }
});
