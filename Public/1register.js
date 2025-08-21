document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();
  const role = document.getElementById("role").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const portfolio = document.getElementById("portfolio").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm").value.trim();
  const termsAccepted = document.getElementById("terms").checked;

  if (!termsAccepted) {
    document.getElementById("register-feedback").textContent =
      "⚠️ You must accept the Terms & Privacy Policy.";
    return;
  }

  if (password !== confirm) {
    document.getElementById("register-feedback").textContent =
      "⚠️ Passwords do not match.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        location,
        role,
        experience,
        portfolio,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("register-feedback").textContent =
        "✅ Registration successful! Redirecting…";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      document.getElementById("register-feedback").textContent =
        "⚠️ " + (data.message || "Registration failed.");
    }
  } catch (err) {
    document.getElementById("register-feedback").textContent =
      "❌ Server error. Please try again.";
    console.error(err);
  }
});
