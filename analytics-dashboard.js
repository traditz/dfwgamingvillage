const API_BASE = "https://dfwgv-bgg-proxy.joemsprague.workers.dev";
const TOKEN_KEY = "dfwgv_analytics_token";

const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("analytics-dashboard");
const tokenInput = document.getElementById("admin-token");
const loginForm = document.getElementById("login-form");
const statusEl = document.getElementById("analytics-status");
const rangeSelect = document.getElementById("range-select");
const refreshButton = document.getElementById("refresh-button");
const logoutButton = document.getElementById("logout-button");

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function showDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
}

function showLogin() {
  dashboard.hidden = true;
  loginPanel.hidden = false;
  tokenInput.focus();
}

async function fetchSummary() {
  const token = getToken();
  if (!token) {
    showLogin();
    return;
  }

  setStatus("Loading analytics...");
  refreshButton.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/analytics-summary?range=${encodeURIComponent(rangeSelect.value)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || `Request failed with ${response.status}`);
    }

    renderDashboard(data);
    showDashboard();
    setStatus(`Updated ${new Date(data.generatedAt).toLocaleString()}`);
  } catch (error) {
    if (String(error.message).toLowerCase().includes("unauthorized")) {
      sessionStorage.removeItem(TOKEN_KEY);
      showLogin();
    }
    setStatus(error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
}

function renderDashboard(data) {
  document.getElementById("views-value").textContent = formatNumber(data.overview.views);
  document.getElementById("sessions-value").textContent = formatNumber(data.overview.sessions);
  document.getElementById("pages-value").textContent = formatNumber(data.overview.pages);

  renderBars("top-pages-list", data.topPages, "page", "views");
  renderBars("referrers-list", data.referrers, "referrer", "views");
  renderBars("countries-list", data.countries, "country", "views");
  renderBars("campaigns-list", data.campaigns, (row) => {
    const parts = [row.source, row.medium, row.campaign].filter(Boolean);
    return parts.join(" / ") || "(none)";
  }, "views");
  renderRecent(data.recent);
}

function renderBars(id, rows, labelKey, valueKey) {
  const container = document.getElementById(id);
  const max = Math.max(...rows.map((row) => Number(row[valueKey] || 0)), 1);

  if (!rows.length) {
    container.innerHTML = '<p class="empty-state">No data yet.</p>';
    return;
  }

  container.innerHTML = rows.map((row) => {
    const label = typeof labelKey === "function" ? labelKey(row) : row[labelKey];
    const value = Number(row[valueKey] || 0);
    const width = Math.max((value / max) * 100, 2);

    return `
      <div class="bar-row">
        <div class="bar-meta">
          <span class="bar-label">${escapeHtml(label || "(unknown)")}</span>
          <span class="bar-value">${formatNumber(value)}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width: ${width}%"></div></div>
      </div>
    `;
  }).join("");
}

function renderRecent(rows) {
  const tbody = document.getElementById("recent-body");

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="4">No recent views yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(formatDate(row.timestamp))}</td>
      <td>${escapeHtml(row.page || "")}</td>
      <td>${escapeHtml(row.country || "")}</td>
      <td>${escapeHtml(row.referrer || "(direct)")}</td>
    </tr>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const token = tokenInput.value.trim();

  if (!token) {
    setStatus("Enter your admin token.", true);
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
  tokenInput.value = "";
  fetchSummary();
});

rangeSelect.addEventListener("change", fetchSummary);
refreshButton.addEventListener("click", fetchSummary);
logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(TOKEN_KEY);
  setStatus("");
  showLogin();
});

if (getToken()) {
  showDashboard();
  fetchSummary();
} else {
  showLogin();
}
