import { api, setLoading, setToken, togglePasswordButtons } from './auth.js';

const form = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');
const submitBtn = document.getElementById('login-submit');

// Enhance password toggles
togglePasswordButtons(document);

// If redirected from register
const url = new URL(location.href);
if (url.searchParams.get('registered') === '1') {
  feedback.textContent = 'Account created. Please sign in.';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.textContent = '';

  const data = Object.fromEntries(new FormData(form).entries());
  setLoading(submitBtn, true);
  try {
    const res = await api('/auth/login', { method: 'POST', json: {
      email: data.email, password: data.password
    }});
    setToken(res.token);
    // optional "remember me": keep token in localStorage (already default). If unchecked, store in sessionStorage:
    if (!document.getElementById('remember').checked) {
      sessionStorage.setItem('vsx_token', res.token);
      localStorage.removeItem('vsx_token');
    }
    location.href = 'dashboard.html';
  } catch (err) {
    feedback.textContent = err.message || 'Invalid email or password.';
  } finally {
    setLoading(submitBtn, false);
  }
});
