// script_updated.js – connected to Render backend

const API_BASE = "https://mvp-backend-zk3a.onrender.com";
let accessToken = localStorage.getItem("access_token") || null;

// Updated load/save state using backend
async function loadStateFromBackend() {
  if (!accessToken) return;
  try {
    const res = await fetch(`${API_BASE}/state`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const json = await res.json();
      state = { ...state, ...json.data };
      renderAllPages();
      document.getElementById("auth-status").textContent = "Data loaded ✅";
    }
  } catch (err) {
    console.error("Failed to load state from backend", err);
  }
}

async function saveStateToBackend() {
  if (!accessToken) return;
  try {
    await fetch(`${API_BASE}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ data: state }),
    });
  } catch (err) {
    console.error("Failed to save state to backend", err);
  }
}

function saveState() {
  localStorage.setItem("mvp2State", JSON.stringify(state));
  saveStateToBackend();
}

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
      accessToken = data.access_token;
      localStorage.setItem("access_token", accessToken);
      await loadStateFromBackend();
      document.getElementById("auth-status").textContent = `Logged in as ${email}`;
    } else {
      alert("Login failed");
    }
  } catch (e) {
    console.error("Login error", e);
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
      alert("Registered successfully. Now please log in.");
    } else {
      const msg = await res.json();
      alert(msg.detail || "Registration failed");
    }
  } catch (e) {
    console.error("Register error", e);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  loadState();
  renderAllPages();
  if (accessToken) {
    await loadStateFromBackend();
  }
});
