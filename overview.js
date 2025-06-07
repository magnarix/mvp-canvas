// overview.js – 2025-06-06T18:00-04:00
document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
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
    // You can display the user's email or name in the DOM if desired

  } catch (error) {
    console.error(error);
    localStorage.removeItem('token');
    window.location.href = 'index.html'; // Force re-login
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }
});
