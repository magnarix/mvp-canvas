// overview.js — for authenticated dashboard view
const API_BASE = "https://mvp-backend-zk3a.onrender.com";
const token = localStorage.getItem("access_token");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

if (!token) {
  alert("You must log in first.");
  window.location.href = "index.html";
}

async function fetchUserData() {
  try {
    const res = await fetch(`${API_BASE}/me`, { headers });
    if (!res.ok) throw new Error("Unauthorized");

    const user = await res.json();
    document.getElementById("auth-status").textContent = `Welcome, ${user.email}`;
    await fetchDashboardData();
  } catch (err) {
    console.error("User auth failed", err);
    localStorage.removeItem("access_token");
    window.location.href = "index.html";
  }
}

async function fetchDashboardData() {
  const sections = ["goals", "risks", "kpis"];
  for (const section of sections) {
    try {
      const res = await fetch(`${API_BASE}/${section}`, { headers });
      const items = await res.json();
      const container = document.getElementById(section);
      container.innerHTML = ""; // Clear old items
      items.forEach((item) => {
        const div = createCard(section, item.id, item.text);
        container.appendChild(div);
      });
    } catch (e) {
      console.error(`Error loading ${section}`, e);
    }
  }
}

function createCard(section, id, text) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <textarea onchange="updateCard('${section}', ${id}, this.value)">${text}</textarea>
    <button onclick="deleteCard('${section}', ${id})">❌</button>
  `;
  return div;
}

async function addCard(section) {
  const res = await fetch(`${API_BASE}/${section}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: "New Item" }),
  });
  if (res.ok) {
    const item = await res.json();
    const container = document.getElementById(section);
    container.appendChild(createCard(section, item.id, item.text));
  }
}

async function updateCard(section, id, text) {
  await fetch(`${API_BASE}/${section}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ text }),
  });
}

async function deleteCard(section, id) {
  await fetch(`${API_BASE}/${section}/${id}`, {
    method: "DELETE",
    headers,
  });
  document.querySelectorAll(`#${section} .card`).forEach((card) => {
    if (card.querySelector("textarea").value === id) {
      card.remove();
    }
  });
  await fetchDashboardData();
}

fetchUserData();
