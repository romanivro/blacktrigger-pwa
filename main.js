// 📜 Правила дня
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

// 🧠 Лог
function saveLog(entry) {
  const now = new Date().toLocaleString();
  console.log(`[LOG] ${now} — ${entry}`);
}

// 📋 План на день
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveTasks();
    saveLog("Задача добавлена: " + value);
  }
}

// 👥 Окружение
function createPersonElement(person, index) {
  const li = document.createElement("li");
  li.innerHTML = `${person.name} — <span class="${person.status}">${person.status.toUpperCase()}</span>`;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.style.marginLeft = "10px";
  btn.onclick = () => {
    people.splice(index, 1);
    savePeople();
    renderPeople();
    saveLog("Удалён человек: " + person.name);
  };

  li.appendChild(btn);
  return li;
}

let people = [];

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (name) {
    people.push({ name, status });
    savePeople();
    renderPeople();
    document.getElementById("personName").value = "";
    saveLog("Добавлен человек: " + name + " (" + status + ")");
  }
}

function savePeople() {
  localStorage.setItem("people", JSON.stringify(people));
}

function renderPeople() {
  const list = document.getElementById("peopleList");
  list.innerHTML = "";
  people.forEach((person, index) => {
    const li = createPersonElement(person, index);
    list.appendChild(li);
  });
}

// 💰 Финансы
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

  saveFinance();
  saveLog(`Финансы обновлены: +${income}, -${expense}`);
  document.getElementById("income").value = "";
  document.getElementById("expense").value = "";
}

// 🏋️ Физо
function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (exercise && amount) {
    const li = document.createElement("li");
    li.textContent = `🏃 ${exercise}: ${amount}`;
    document.getElementById("fitLog").appendChild(li);
    saveWorkouts();
    updateFitChart();
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
      plugins: { legend: { display: false } },
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

// ✅ Сохранение
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => li.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveWorkouts() {
  const entries = Array.from(document.querySelectorAll("#fitLog li")).map(li => li.textContent);
  localStorage.setItem("fitLog", JSON.stringify(entries));
}

function saveFinance() {
  const data = { income: totalIncome, expense: totalExpense };
  localStorage.setItem("finance", JSON.stringify(data));
}

// 🔁 Загрузка
function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    const tasks = JSON.parse(data);
    tasks.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      document.getElementById("taskList").appendChild(li);
    });
  }
}

function loadPeople() {
  const raw = localStorage.getItem("people");
  if (raw) {
    people = JSON.parse(raw);
    renderPeople();
  }
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

function loadFinance() {
  const data = localStorage.getItem("finance");
  if (data) {
    const { income, expense } = JSON.parse(data);
    totalIncome = income;
    totalExpense = expense;
    addFinance();
  }
}

// 🔁 Инициализация
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadPeople();
  loadWorkouts();
  loadFinance();
});