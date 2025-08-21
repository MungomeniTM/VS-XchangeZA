document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      document.getElementById("login-feedback").textContent =
        "✅ Login successful! Redirecting…";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      document.getElementById("login-feedback").textContent =
        "⚠️ " + (data.message || "Invalid credentials.");
    }
  } catch (err) {
    document.getElementById("login-feedback").textContent =
      "❌ Server error. Please try again.";
    console.error(err);
  }
});
