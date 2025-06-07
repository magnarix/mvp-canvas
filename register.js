// register.js – 2025-06-06T18:00-04:00
document.getElementById('register-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch('https://mvp-backend-zk3a.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    alert('Registration successful! Please log in.');
    window.location.href = 'index.html';
  } catch (error) {
    document.getElementById('register-error').textContent = error.message;
  }
});
