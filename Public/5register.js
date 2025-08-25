// public/js/register.js

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();
  const role = document.getElementById("role").value;
  const experience = document.getElementById("experience").value;
  const portfolio = document.getElementById("portfolio").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm").value.trim();
  const termsAccepted = document.getElementById("terms").checked;

  const feedback = document.getElementById("register-feedback");
  feedback.textContent = "";

  // ✅ Validate passwords
  if (password !== confirm) {
    feedback.textContent = "Passwords do not match.";
    return;
  }

  // ✅ Validate Terms
  if (!termsAccepted) {
    feedback.textContent = "You must accept the Terms & Privacy Policy.";
    return;
  }

  // ✅ Validate required fields
  if (!firstName || !lastName || !email || !location || !role || !experience || !password) {
    feedback.textContent = "Please fill in all required fields.";
    return;
  }

  try {
    const submitBtn = document.getElementById("register-submit");
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").textContent = submitBtn.dataset.loading;

    const res = await fetch("/api/auth/register", {
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

    if (!res.ok) {
      feedback.textContent = data.message || "Registration failed.";
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-label").textContent = "Create Account";
      return;
    }

    // ✅ On success → redirect to login
    window.location.href = "login.html";

  } catch (err) {
    feedback.textContent = "Something went wrong. Please try again.";
    console.error("Register error:", err);

    const submitBtn = document.getElementById("register-submit");
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-label").textContent = "Create Account";
  }
});
