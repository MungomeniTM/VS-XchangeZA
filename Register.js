import { api, setToken } from './auth.js';

const form = document.getElementById('register-form');
const feedback = document.getElementById('feedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.textContent = '';
  const payload = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    role: form.role.value.trim()
  };
  try {
    const data = await api('/auth/register', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    setToken(data.token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    feedback.textContent = err.message || 'Could not create account';
  }
});
