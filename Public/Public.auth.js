// ===== Shared auth utilities (used by login/register/dashboard) =====
export const API_BASE = 'http://localhost:4000/api';
const TOKEN_KEY = 'vsx_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api(path, { method='GET', json, headers, retryRefresh=true } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(headers || {})
    },
    credentials: 'include',
    body: json ? JSON.stringify(json) : undefined
  });

  if (res.ok) return res.json();

  // try token refresh once if unauthorized
  if (retryRefresh && res.status === 401 && getToken()) {
    const r = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (r.ok) {
      const j = await r.json();
      setToken(j.token);
      return api(path, { method, json, headers, retryRefresh: false });
    }
  }
  const err = await res.json().catch(()=>({ message:'Request failed'}));
  throw new Error(err.message || 'Request failed');
}

export function togglePasswordButtons(root=document) {
  root.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      if (!input) return;
      const isPwd = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPwd ? 'text' : 'password');
      btn.textContent = isPwd ? 'Hide' : 'Show';
    });
  });
}

export function setLoading(btn, loading=true) {
  if (!btn) return;
  if (loading) {
    btn.dataset.original = btn.querySelector('.btn-label')?.textContent || btn.textContent;
    (btn.querySelector('.btn-label') || btn).textContent = btn.dataset.loading || 'Please wait…';
    btn.disabled = true;
  } else {
    (btn.querySelector('.btn-label') || btn).textContent = btn.dataset.original || (btn.dataset.label || 'Submit');
    btn.disabled = false;
  }
}
