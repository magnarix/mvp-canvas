// auth.js – 2025-06-06T18:00-04:00
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    window.location.href = 'overview.html';
    return;
  }

  const form = document.getElementById('login-form');
  if (!form) return; // Prevent error if the form is not on this page

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('https://mvp-backend-zk3a.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      window.location.href = 'overview.html';
    } catch (error) {
      const errorDisplay = document.getElementById('login-error');
      if (errorDisplay) errorDisplay.textContent = error.message;
    }
  });
});
