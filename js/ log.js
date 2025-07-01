// js/log.js

let activityChart;

export function saveLog(entry) {
  const now = new Date();
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");

  log.push({
    time: now.toLocaleString(),
    entry
  });

  localStorage.setItem("activityLog", JSON.stringify(log));
  updateActivityChart();
}

export function toggleLog() {
  const logList = document.getElementById("logList");
  logList.style.display = logList.style.display === "none" ? "block" : "none";
  renderLog();
}

export function renderLog() {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    logList.appendChild(li);
  });
}

export function updateActivityChart() {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const map = {};

  log.forEach(item => {
    const day = item.time.split(",")[0];
    map[day] = (map[day] || 0) + 1;
  });

  const labels = Object.keys(map);
  const data = Object.values(map);

  if (activityChart) activityChart.destroy();

  const ctx = document.getElementById("activityChart").getContext("2d");
  activityChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Действий за день",
        data,
        fill: false,
        borderColor: "#0f0",
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
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
      }
    }
  });
}

export function undoLastAction() {
  let log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  if (log.length === 0) return alert("Нет действий для отката.");

  const last = log.pop();
  localStorage.setItem("activityLog", JSON.stringify(log));
  saveLog("⏪ Отменено: " + last.entry);
  renderLog();
}