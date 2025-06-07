// script_overview.js – Extracted from script.js for overview.html only

const STORAGE_KEY = "mvp2State";
let state = {
  goals: [],
  risks: [],
  kpis: [],
  placements: {},
  dependencies: [],
  links: [],
  scenarioOptions: {
    hire: false,
    fund: false
  },
  forgeCastChallenge: "",
  forgeCastResult: { suggestion: "", rationale: "" },
  crownLensRisks: []
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    } catch (err) {
      console.warn("Failed to parse saved state:", err);
    }
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function renderAllPages() {
  renderIndex();
}

function renderIndex() {
  // Goals
  const goalsList = document.getElementById("goals-list");
  goalsList.innerHTML = "";
  state.goals.forEach((g) => {
    if (state.placements[g.id]) return;
    const card = createGoalCard(g);
    goalsList.appendChild(card);
  });

  // Risks
  const risksList = document.getElementById("risks-list");
  risksList.innerHTML = "";
  state.risks.forEach((r) => {
    if (state.placements[r.id]) return;
    const card = createRiskCard(r);
    risksList.appendChild(card);
  });

  // KPIs
  const kpisList = document.getElementById("kpis-list");
  kpisList.innerHTML = "";
  state.kpis.forEach((k) => {
    if (state.placements[k.id]) return;
    const card = createKpiCard(k);
    kpisList.appendChild(card);
  });

  attachIndexFormHandlers();
}

function createGoalCard(g) {
  const card = document.createElement("div");
  card.className = "card goal list-card";
  card.setAttribute("data-id", g.id);
  card.setAttribute("data-type", "goal");
  card.style.position = "static";

  const removeBtn = document.createElement("span");
  removeBtn.textContent = "×";
  removeBtn.style.cssText = "float: right; cursor: pointer; color: #900;";
  removeBtn.addEventListener("click", () => deleteGoal(g.id));

  const title = document.createElement("div");
  title.textContent = g.title;
  title.style.fontWeight = "600";

  const subtitle = document.createElement("div");
  subtitle.style.fontSize = "0.9rem";
  subtitle.style.marginTop = "0.25rem";
  subtitle.style.color = "#3a4a59";
  subtitle.textContent = `Due: ${g.dueDate || "—"} | Owner: ${g.owner || "—"}`;

  card.appendChild(removeBtn);
  card.appendChild(title);
  if (g.desc) {
    const descEl = document.createElement("div");
    descEl.textContent = g.desc;
    descEl.style.fontSize = "0.9rem";
    descEl.style.marginTop = "0.25rem";
    descEl.style.color = "#5a6b7c";
    card.appendChild(descEl);
  }
  card.appendChild(subtitle);
  return card;
}

function createRiskCard(r) {
  const card = document.createElement("div");
  card.className = "card risk list-card";
  card.setAttribute("data-id", r.id);
  card.setAttribute("data-type", "risk");
  card.style.position = "static";

  const removeBtn = document.createElement("span");
  removeBtn.textContent = "×";
  removeBtn.style.cssText = "float: right; cursor: pointer; color: #900;";
  removeBtn.addEventListener("click", () => deleteRisk(r.id));

  const title = document.createElement("div");
  title.textContent = r.title;
  title.style.fontWeight = "600";

  const subtitle = document.createElement("div");
  subtitle.style.fontSize = "0.9rem";
  subtitle.style.marginTop = "0.25rem";
  subtitle.style.color = "#3a4a59";
  subtitle.textContent = `L:${r.likelihood} | I:${r.impact}`;

  card.appendChild(removeBtn);
  card.appendChild(title);
  if (r.mitigation) {
    const mitEl = document.createElement("div");
    mitEl.textContent = r.mitigation;
    mitEl.style.fontSize = "0.9rem";
    mitEl.style.marginTop = "0.25rem";
    mitEl.style.color = "#5a6b7c";
    card.appendChild(mitEl);
  }
  card.appendChild(subtitle);
  return card;
}

function createKpiCard(k) {
  const card = document.createElement("div");
  card.className = "card kpi list-card";
  card.setAttribute("data-id", k.id);
  card.setAttribute("data-type", "kpi");
  card.style.position = "static";

  const removeBtn = document.createElement("span");
  removeBtn.textContent = "×";
  removeBtn.style.cssText = "float: right; cursor: pointer; color: #900;";
  removeBtn.addEventListener("click", () => deleteKpi(k.id));

  const title = document.createElement("div");
  title.textContent = k.name;
  title.style.fontWeight = "600";

  const subtitle = document.createElement("div");
  subtitle.style.fontSize = "0.9rem";
  subtitle.style.marginTop = "0.25rem";
  subtitle.style.color = "#3a4a59";
  subtitle.textContent = `${k.metricType} target: ${k.target} | ${k.frequency}`;

  card.appendChild(removeBtn);
  card.appendChild(title);
  card.appendChild(subtitle);
  return card;
}

function attachIndexFormHandlers() {
  const saveGoalBtn = document.getElementById("saveGoalBtn");
  if (saveGoalBtn && !saveGoalBtn.dataset.bound) {
    saveGoalBtn.dataset.bound = "true";
    saveGoalBtn.addEventListener("click", () => {
      const title = document.getElementById("goal-title").value.trim();
      const desc = document.getElementById("goal-desc").value.trim();
      const dueDate = document.getElementById("goal-due").value;
      const owner = document.getElementById("goal-owner").value.trim();
      if (!title) return;
      const id = generateId("G");
      state.goals.push({ id, title, desc, dueDate, owner });
      saveState();
      document.getElementById("goal-title").value = "";
      document.getElementById("goal-desc").value = "";
      document.getElementById("goal-due").value = "";
      document.getElementById("goal-owner").value = "";
      renderAllPages();
    });
  }

  const saveRiskBtn = document.getElementById("saveRiskBtn");
  if (saveRiskBtn && !saveRiskBtn.dataset.bound) {
    saveRiskBtn.dataset.bound = "true";
    saveRiskBtn.addEventListener("click", () => {
      const title = document.getElementById("risk-title").value.trim();
      const likelihood = document.getElementById("risk-likelihood").value;
      const impact = document.getElementById("risk-impact").value;
      const mitigation = document.getElementById("risk-mitigation").value.trim();
      if (!title) return;
      const id = generateId("R");
      state.risks.push({ id, title, likelihood, impact, mitigation });
      if (!state.crownLensRisks.includes(title)) {
        state.crownLensRisks.push(title);
      }
      saveState();
      document.getElementById("risk-title").value = "";
      document.getElementById("risk-likelihood").value = "Low";
      document.getElementById("risk-impact").value = "Low";
      document.getElementById("risk-mitigation").value = "";
      renderAllPages();
    });
  }

  const saveKpiBtn = document.getElementById("saveKpiBtn");
  if (saveKpiBtn && !saveKpiBtn.dataset.bound) {
    saveKpiBtn.dataset.bound = "true";
    saveKpiBtn.addEventListener("click", () => {
      const name = document.getElementById("kpi-name").value.trim();
      const metricType = document.getElementById("kpi-metricType").value;
      const target = document.getElementById("kpi-target").value.trim();
      const frequency = document.getElementById("kpi-frequency").value;
      if (!name) return;
      const id = generateId("K");
      state.kpis.push({ id, name, metricType, target, frequency });
      saveState();
      document.getElementById("kpi-name").value = "";
      document.getElementById("kpi-metricType").value = "%";
      document.getElementById("kpi-target").value = "";
      document.getElementById("kpi-frequency").value = "Weekly";
      renderAllPages();
    });
  }
}

function deleteGoal(id) {
  state.goals = state.goals.filter((g) => g.id !== id);
  delete state.placements[id];
  saveState();
  renderAllPages();
}

function deleteRisk(id) {
  const r = state.risks.find((r) => r.id === id);
  const title = r ? r.title : null;
  state.risks = state.risks.filter((r) => r.id !== id);
  delete state.placements[id];
  if (title) {
    state.crownLensRisks = state.crownLensRisks.filter((t) => t !== title);
  }
  saveState();
  renderAllPages();
}

function deleteKpi(id) {
  state.kpis = state.kpis.filter((k) => k.id !== id);
  delete state.placements[id];
  saveState();
  renderAllPages();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAllPages();
});
