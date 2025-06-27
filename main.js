const rules = [
  "Не оправдывайся — объяснение без запроса — слабость.",
  "Если не приносит ресурс — отсекай.",
  "Хищник молчит чаще, чем говорит.",
  "Контроль над собой — контроль над всем.",
  "Каждое взаимодействие — война за интересы.",
  "Грубость — фильтр. Кто слаб — отпадёт сам.",
  "Сначала доминируй, потом дружи.",
  "Если не давят на тебя — дави ты.",
  "Ложь — инструмент, не слабость.",
  "Правильное ≠ выгодное. Выбирай выгоду."
];

function getRule() {
  const index = Math.floor(Math.random() * rules.length);
  document.getElementById("rule").textContent = rules[index];
}

document.addEventListener("DOMContentLoaded", getRule);

function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveLog("Задача добавлена: " + value);
  }
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (name) {
    const li = document.createElement("li");
    li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;
    document.getElementById("peopleList").appendChild(li);
    saveLog("Добавлен человек: " + name + " (" + status + ")");
    document.getElementById("personName").value = "";
  }
}

function saveLog(entry) {
  const now = new Date().toLocaleString();
  console.log(`[LOG] ${now} — ${entry}`);
}

let totalIncome = 0;
let totalExpense = 0;

function addFinance() {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const expense = parseFloat(document.getElementById("expense").value) || 0;

  totalIncome += income;
  totalExpense += expense;

  const balance = totalIncome - totalExpense;
  const percent = totalExpense === 0 ? 100 : Math.round((totalIncome / totalExpense) * 100);

  document.getElementById("financeStats").innerHTML = `
    💵 Доход: ${totalIncome} <br>
    💸 Расход: ${totalExpense} <br>
    📊 Баланс: <span style="color:${balance >= 0 ? '#0f0' : '#f00'}">${balance}</span><br>
    ⚖️ Доход/Расход: <span style="color:${
      percent > 100 ? '#0f0' : percent < 100 ? '#f00' : '#ff0'
    }">${percent}%</span>
  `;

  saveLog(`Финансы обновлены: +${income}, -${expense}`);
  document.getElementById("income").value = "";
  document.getElementById("expense").value = "";
}

function addWorkout() {function addWorkout() {
  ...
  updateFitChart(); // ← добавь эту строку в конце
}
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (exercise && amount) {
    const li = document.createElement("li");
    li.textContent = `🏃 ${exercise}: ${amount}`;
    document.getElementById("fitLog").appendChild(li);
    saveLog(`Физо: ${exercise} — ${amount}`);
    document.getElementById("exercise").value = "";
    document.getElementById("amount").value = "";
  }
}
// 📊 График физо
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
        label: "Сумма зафиксированных тренировок",
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