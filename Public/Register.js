import { api, setLoading, togglePasswordButtons } from './auth.js';

const form = document.getElementById('register-form');
const feedback = document.getElementById('register-feedback');
const submitBtn = document.getElementById('register-submit');
const password = document.getElementById('password');
const confirm = document.getElementById('confirm');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

togglePasswordButtons(document);

function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  const letters = {};
  for (let i = 0; i < pw.length; i++) {
    letters[pw[i]] = (letters[pw[i]] || 0) + 1;
    score += 5.0 / letters[pw[i]];
  }
  const variations = {
    digits: /\d/.test(pw),
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    nonWords: /\W/.test(pw)
  };
  let variationCount = 0;
  for (const check in variations) variationCount += variations[check] ? 1 : 0;
  score += (variationCount - 1) * 10;
  return Math.min(100, Math.floor(score));
}

password.addEventListener('input', () => {
  const s = scorePassword(password.value);
  strengthBar.style.width = `${s}%`;
  strengthBar.style.background = s > 80 ? '#32cd32' : s > 50 ? '#1e90ff' : '#d97706';
  strengthText.textContent = s > 80 ? 'Strong password' : s > 50 ? 'Good — make it stronger' : 'Too weak';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.textContent = '';
  if (password.value !== confirm.value) {
    feedback.textContent = 'Passwords do not match.';
    return;
  }
  if (!document.getElementById('terms').checked) {
    feedback.textContent = 'Please accept the Terms and Privacy Policy.';
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  setLoading(submitBtn, true);
  try {
    await api('/auth/register', { method:'POST', json: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      location: data.location,
      role: data.role,
      experience: data.experience,
      portfolio: data.portfolio || '',
      password: data.password
    }});
    // Success → go to login with a success flag
    location.href = 'login.html?registered=1';
  } catch (err) {
    feedback.textContent = err.message || 'Could not create account.';
  } finally {
    setLoading(submitBtn, false);
  }
});
