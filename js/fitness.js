// js/fitness.js — учёт физо и график

import { saveLog } from "./log.js";

let fitChart;

export function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (!exercise || !amount) return;

  const entry = {
    date: new Date().toISOString().split("T")[0],
    exercise,
    amount: parseFloat(amount)
  };

  const log = JSON.parse(localStorage.getItem("fitLog") || "[]");
  log.push(entry);
  localStorage.setItem("fitLog", JSON.stringify(log));

  renderWorkout(entry);
  updateFitChart();
  saveLog(`Физо: ${exercise} — ${amount}`);

  document.getElementById("exercise").value = "";
  document.getElementById("amount").value = "";
}

function renderWorkout(entry) {
  const li = document.createElement("li");
  li.textContent = `${entry.date} — ${entry.exercise}: ${entry.amount}`;
  document.getElementById("fitLog").appendChild(li);
}

export function loadWorkouts() {
  const data = JSON.parse(localStorage.getItem("fitLog") || "[]");
  data.forEach(renderWorkout);
  updateFitChart();
}

function updateFitChart() {
  const data = JSON.parse(localStorage.getItem("fitLog") || "[]");

  const grouped = {};
  data.forEach(e => {
    if (!grouped[e.exercise]) grouped[e.exercise] = 0;
    grouped[e.exercise] += e.amount;
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  if (fitChart) fitChart.destroy();

  const ctx = document.getElementById("fitChart").getContext("2d");
  fitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Прогресс по упражнениям",
        data: values,
        backgroundColor: "#0f0",
        borderColor: "#0f0",
        borderWidth: 1
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