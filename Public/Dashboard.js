import { api, getToken, setToken, clearToken, API_BASE } from './auth.js';

const TOKEN_KEY = 'vsx_token';
const $ = (s, r=document) => r.querySelector(s);

const logoutBtn = document.getElementById('logout');
logoutBtn?.addEventListener('click', async () => {
  clearToken();
  try { await fetch(`${API_BASE}/auth/logout`, { method:'POST', credentials:'include' }); } catch {}
  location.href = 'login.html';
});

async function loadMe() {
  try {
    const { user } = await api('/me');
    paintUser(user);
    seedFeed(user);
  } catch (e) {
    // try to refresh (handled in api()), if still fails → back to login
    location.href = 'login.html';
  }
}

function paintUser(user) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User';
  const role = user.role || 'Member';
  const loc = user.location || '';

  const nameEl = document.getElementById('userName');
  const roleEl = document.getElementById('userRole');
  const avatarEl = document.getElementById('avatar');

  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.textContent = [role, loc].filter(Boolean).join(' • ');
  if (avatarEl) avatarEl.textContent = (name.split(' ').map(s=>s[0]).join('') || '👤').slice(0,2);
}

function seedFeed(user) {
  const feed = document.getElementById('feed');
  if (!feed) return;
  feed.innerHTML = '';

  const items = [
    {
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'You',
      role: user.role || 'Member',
      location: user.location || '',
      time: 'Just now',
      body: 'Welcome to VSXchange ZA — share your work and find collaborators!',
      media: null,
      mine: true
    }
  ];

  items.forEach(p => feed.appendChild(renderPost(p)));
}

function renderPost(p) {
  const card = document.createElement('article');
  card.className = 'card post';
  card.innerHTML = `
    <div class="post-head">
      <div class="avatar small">${(p.name||'U').split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
      <div>
        <div class="name">${p.name}${p.mine ? ' <span class="muted">(you)</span>' : ''}</div>
        <div class="meta">${[p.role, p.location].filter(Boolean).join(' • ')} • ${p.time}</div>
      </div>
    </div>
    <div class="body">${(p.body||'').replace(/</g,'&lt;')}</div>
    <div class="actions">
      <button class="action act-approve">Approve ❤️</button>
      <button class="action act-comment">Comment 💬</button>
      <button class="action act-share">Share 🔗</button>
      <button class="action act-collab">Collaborate 🤝</button>
    </div>
    <div class="commentbox">
      <input type="text" placeholder="Write a comment…" />
      <button class="btn ghost">Post</button>
    </div>
  `;
  card.querySelector('.act-collab').addEventListener('click', onCollaborate);
  return card;
}

// === Collaborate button ===
async function onCollaborate() {
  const msg = prompt('Describe your collaboration intent (what do you need / offer)?');
  if (msg === null) return; // cancelled
  const trimmed = msg.trim();
  if (!trimmed) return alert('Please enter a short description.');
  try {
    const res = await api('/collab/intent', { method:'POST', json: { message: trimmed } });
    alert('✅ Collaboration request created!');
  } catch (e) {
    alert(e.message || 'Could not create collaboration request.');
  }
}

// Mobile drawer / FAB hooks if present
document.getElementById('hamburger')?.addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  const open = sb.classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('active', open);
});

document.getElementById('fab')?.addEventListener('click', () => {
  document.getElementById('composeText')?.focus();
  scrollTo({ top: 0, behavior: 'smooth' });
});

loadMe();
