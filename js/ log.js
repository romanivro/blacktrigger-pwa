// js/log.js — Лог действий и график активности

export function saveLog(entry) {
  const now = new Date();
  const timestamp = now.toLocaleString();
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  log.push({ time: timestamp, entry });
  localStorage.setItem("activityLog", JSON.stringify(log));
  localStorage.setItem("lastActionDate", now.toLocaleDateString());
}

export function toggleLog() {
  const logList = document.getElementById("logList");
  logList.style.display = logList.style.display === "none" ? "block" : "none";
  renderLog();
  updateActivityChart();
}

export function renderLog() {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  const list = document.getElementById("logList");
  if (!list) return;
  list.innerHTML = "";
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    list.appendChild(li);
  });
}

export function updateActivityChart() {
  const raw = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const map = {};

  raw.forEach(item => {
    const date = item.time.split(",")[0];
    map[date] = (map[date] || 0) + 1;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  if (window.activityChart) {
    window.activityChart.destroy();
  }

  const ctx = document.getElementById("activityChart").getContext("2d");
  window.activityChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Активность (действий в день)",
        data: values,
        fill: false,
        borderColor: "#0f0",
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#0f0" },
          grid: { color: "#333" }
        },
        x: {
          ticks: { color: "#0f0" },
          grid: { color: "#333" }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}