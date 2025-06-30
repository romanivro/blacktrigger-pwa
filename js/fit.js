// Файл: js/fitness.js

let fitChart = null;

export function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();
  if (!exercise || !amount) return;

  const date = new Date().toLocaleDateString();
  const entry = { date, exercise, amount };

  const log = JSON.parse(localStorage.getItem("fitLog") || "[]");
  log.push(entry);
  localStorage.setItem("fitLog", JSON.stringify(log));

  saveLog(`Физо: ${exercise} — ${amount}`);
  renderWorkoutLog();
  updateFitChart();

  document.getElementById("exercise").value = "";
  document.getElementById("amount").value = "";
}

export function renderWorkoutLog() {
  const fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
  const ul = document.getElementById("fitLog");
  ul.innerHTML = "";

  fitLog.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} — ${entry.exercise}: ${entry.amount}`;

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      fitLog.splice(i, 1);
      localStorage.setItem("fitLog", JSON.stringify(fitLog));
      saveLog(`Удалено физо: ${entry.exercise}`);
      renderWorkoutLog();
      updateFitChart();
    };

    li.appendChild(del);
    ul.appendChild(li);
  });
}

export function updateFitChart() {
  const fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
  const totals = {};

  fitLog.forEach(entry => {
    const type = entry.exercise;
    const amount = parseFloat(entry.amount);
    if (!totals[type]) totals[type] = 0;
    totals[type] += isNaN(amount) ? 0 : amount;
  });

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  if (fitChart) fitChart.destroy();

  const ctx = document.getElementById("fitChart").getContext("2d");
  fitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Суммарный прогресс",
        data: values,
        backgroundColor: "#0f0",
        borderColor: "#0f0",
        borderWidth: 1
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
      plugins: {
        legend: { display: false }
      }
    }
  });
}

export function loadWorkouts() {
  renderWorkoutLog();
  updateFitChart();
}