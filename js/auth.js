/**
 * Browser-only sign in / sign up.
 * Accounts never leave this browser. Passwords are stored as salted SHA-256
 * hashes in localStorage because the site has no backend.
 */
(function () {
  'use strict';

  const ACCOUNTS_KEY = 'educa.accounts';
  const SESSION_KEY = 'educa.session';

  const modal = document.getElementById('auth-modal');
  const openBtn = document.getElementById('auth-open');
  const closeBtn = document.getElementById('auth-close');
  const backdrop = document.getElementById('auth-backdrop');
  const sessionEl = document.getElementById('auth-session');
  const userEl = document.getElementById('auth-user');
  const signOutBtn = document.getElementById('auth-signout');
  const titleEl = document.getElementById('auth-title');
  const tabIn = document.getElementById('tab-signin');
  const tabUp = document.getElementById('tab-signup');
  const formIn = document.getElementById('signin-form');
  const formUp = document.getElementById('signup-form');
  const errorIn = document.getElementById('signin-error');
  const errorUp = document.getElementById('signup-error');

  if (!modal || !formIn || !formUp) return;

  function readAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  async function hashPassword(username, password) {
    const data = new TextEncoder().encode('educa:' + username.toLowerCase() + ':' + password);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  function showError(el, message) {
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
  }

  function setTab(mode) {
    const signingIn = mode !== 'up';
    tabIn.classList.toggle('is-active', signingIn);
    tabUp.classList.toggle('is-active', !signingIn);
    tabIn.setAttribute('aria-selected', signingIn ? 'true' : 'false');
    tabUp.setAttribute('aria-selected', signingIn ? 'false' : 'true');
    formIn.classList.toggle('hidden', !signingIn);
    formUp.classList.toggle('hidden', signingIn);
    formIn.hidden = !signingIn;
    formUp.hidden = signingIn;
    if (titleEl) titleEl.textContent = signingIn ? 'Welcome back' : 'Create your account';
    showError(errorIn, '');
    showError(errorUp, '');
  }

  function openModal(mode) {
    setTab(mode === 'up' ? 'up' : 'in');
    modal.hidden = false;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const focusTarget = mode === 'up'
      ? document.getElementById('signup-username')
      : document.getElementById('signin-identifier');
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    modal.hidden = true;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    showError(errorIn, '');
    showError(errorUp, '');
  }

  function paintSession() {
    const username = localStorage.getItem(SESSION_KEY) || '';
    const signedIn = Boolean(username);
    if (openBtn) {
      openBtn.hidden = signedIn;
      openBtn.classList.toggle('hidden', signedIn);
    }
    if (sessionEl) {
      sessionEl.hidden = !signedIn;
      sessionEl.classList.toggle('hidden', !signedIn);
    }
    if (userEl) userEl.textContent = signedIn ? username : '';
  }

  function validUsername(value) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(value);
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (openBtn) openBtn.addEventListener('click', () => openModal('in'));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (tabIn) tabIn.addEventListener('click', () => setTab('in'));
  if (tabUp) tabUp.addEventListener('click', () => setTab('up'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  formIn.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError(errorIn, '');
    const identifier = String(new FormData(formIn).get('identifier') || '').trim();
    const password = String(new FormData(formIn).get('password') || '');
    if (!identifier || password.length < 8) {
      showError(errorIn, 'Enter your username or email and a password of at least 8 characters.');
      return;
    }

    const needle = identifier.toLowerCase();
    const account = readAccounts().find((item) => {
      return item.username.toLowerCase() === needle || item.email.toLowerCase() === needle;
    });
    if (!account) {
      showError(errorIn, 'No account matches that username or email.');
      return;
    }

    const digest = await hashPassword(account.username, password);
    if (digest !== account.passwordHash) {
      showError(errorIn, 'That password does not match this account.');
      return;
    }

    localStorage.setItem(SESSION_KEY, account.username);
    formIn.reset();
    closeModal();
    paintSession();
  });

  formUp.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError(errorUp, '');
    const data = new FormData(formUp);
    const username = String(data.get('username') || '').trim();
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');

    if (!validUsername(username)) {
      showError(errorUp, 'Username must be 3–20 characters: letters, numbers, or underscore.');
      return;
    }
    if (!validEmail(email)) {
      showError(errorUp, 'Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      showError(errorUp, 'Password must be at least 8 characters.');
      return;
    }

    const accounts = readAccounts();
    const taken = accounts.some((item) => {
      return item.username.toLowerCase() === username.toLowerCase()
        || item.email.toLowerCase() === email.toLowerCase();
    });
    if (taken) {
      showError(errorUp, 'That username or email is already registered in this browser.');
      return;
    }

    accounts.push({
      username: username,
      email: email,
      passwordHash: await hashPassword(username, password),
    });
    writeAccounts(accounts);
    localStorage.setItem(SESSION_KEY, username);
    formUp.reset();
    closeModal();
    paintSession();
  });

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      paintSession();
    });
  }

  paintSession();
})();
