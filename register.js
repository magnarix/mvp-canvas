// register.js – Refactored 2025-06-06T18:40-04:00

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', handleRegistration);
  }
});

/**
 * Handle registration form submission.
 * @param {Event} event 
 */
async function handleRegistration(event) {
  event.preventDefault();
  clearError();

  const email = document.getElementById('register-email')?.value.trim();
  const password = document.getElementById('register-password')?.value;

  if (!email || !password) {
    showError('Please enter both email and password.');
    return;
  }

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
    showError(error.message || 'Something went wrong.');
  }
}

/**
 * Display error message to the user.
 * @param {string} message 
 */
function showError(message) {
  const errorElement = document.getElementById('register-error');
  if (errorElement) errorElement.textContent = message;
}

/**
 * Clear any existing error message.
 */
function clearError() {
  showError('');
}
