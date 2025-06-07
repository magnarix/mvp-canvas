// auth.js — for login and registration only
const API_BASE = "https://mvp-backend-zk3a.onrender.com";

async function login() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      document.getElementById("auth-status").textContent = "Login successful ✅";
      window.location.href = "overview.html";
    } else {
      document.getElementById("auth-status").textContent = "Login failed ❌";
    }
  } catch (e) {
    console.error("Login error", e);
    document.getElementById("auth-status").textContent = "Error during login";
  }
}

async function register() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      document.getElementById("auth-status").textContent =
        "Registration successful. Please log in.";
    } else {
      const msg = await res.json();
      document.getElementById("auth-status").textContent = msg.detail || "Registration failed";
    }
  } catch (e) {
    console.error("Register error", e);
    document.getElementById("auth-status").textContent = "Error during registration";
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");

  loginButton.addEventListener("click", login);
  registerButton.addEventListener("click", register);
});