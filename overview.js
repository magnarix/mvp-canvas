// overview.js – Fixed 2025-06-07T10:15-04:00
document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('access_token'); // ✅ FIXED

  const logoutBtn = document.getElementById('logout-btn');

  if (!token) {
    window.location.href = 'index.html'; // Redirect to login
    return;
  }

  try {
    const response = await fetch('https://mvp-backend-zk3a.onrender.com/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Unauthorized');
    }

    const userData = await response.json();
    console.log('User info:', userData);
    // Optionally: display user info on the page

  } catch (error) {
    console.error(error);
    localStorage.removeItem('access_token'); // ✅ match the correct key
    window.location.href = 'index.html'; // Force re-login
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('access_token'); // ✅ match the correct key
      window.location.href = 'index.html';
    });
  }
});
