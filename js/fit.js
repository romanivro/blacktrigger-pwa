// 🏋️ Физо: добавление и отображение тренировок
function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (exercise && amount) {
    const li = document.createElement("li");
    li.textContent = `🏃 ${exercise}: ${amount}`;
    document.getElementById("fitLog").appendChild(li);
    saveLog(`Физо: ${exercise} — ${amount}`);
    document.getElementById("exercise").value = "";
    document.getElementById("amount").value = "";
    updateFitChart();
    saveWorkouts();
  }
}

// 📊 График физо (Chart.js)
let fitChart;

function updateFitChart() {
  const items = Array.from(document.querySelectorAll("#fitLog li"));
  const dataMap = {};

  items.forEach(item => {
    const [type, value] = item.textContent.replace("🏃 ", "").split(":").map(s => s.trim());
    const amount = parseFloat(value);
    if (!isNaN(amount)) {
      dataMap[type] = (dataMap[type] || 0) + amount;
    }
  });

  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  if (fitChart) {
    fitChart.destroy();
  }

  const ctx = document.getElementById("fitChart").getContext("2d");
  fitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Физо: всего по типу",
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

// 💾 Сохранение/Загрузка
function saveWorkouts() {
  const entries = Array.from(document.querySelectorAll("#fitLog li")).map(li => li.textContent);
  localStorage.setItem("fitLog", JSON.stringify(entries));
}

function loadWorkouts() {
  const data = localStorage.getItem("fitLog");
  if (data) {
    const entries = JSON.parse(data);
    entries.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      document.getElementById("fitLog").appendChild(li);
    });
  }
  updateFitChart();
}