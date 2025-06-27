
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

document.addEventListener("DOMContentLoaded", getRule);

// 📋 План на день
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

// 👥 Окружение
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

// 🧠 Лог
function saveLog(entry) {
  const now = new Date().toLocaleString();
  console.log(`[LOG] ${now} — ${entry}`);
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
    saveLog(`Физо: ${exercise} — ${amount}`);
    document.getElementById("exercise").value = "";
    document.getElementById("amount").value = "";
    updateFitChart();
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

// ✅ Сохранение данных
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => li.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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

function savePeople() {
  const people = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(people));
}

function loadPeople() {
  const data = localStorage.getItem("people");
  if (data) {
    const people = JSON.parse(data);
    people.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = p;
      document.getElementById("peopleList").appendChild(li);
    });
  }
}

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

function saveFinance() {
  const data = {
    income: totalIncome,
    expense: totalExpense
  };
  localStorage.setItem("finance", JSON.stringify(data));
}

function loadFinance() {
  const data = localStorage.getItem("finance");
  if (data) {
    const { income, expense } = JSON.parse(data);
    totalIncome = income;
    totalExpense = expense;
    addFinance(); // пересчёт и отрисовка
  }
}

window.addEventListener("beforeunload", () => {
  saveTasks();
  savePeople();
  saveWorkouts();
  saveFinance();
});

window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadPeople();
  loadWorkouts();
  loadFinance();
  getRule();
});
// 🧠 Архетип — тест
const testQuestions = [
  {
    q: "Как ты решаешь конфликты?",
    a: { Хищник: 2, Стратег: 1 }
  },
  {
    q: "Что важнее: результат или порядок?",
    a: { Стратег: 2, Исполнитель: 1 }
  },
  {
    q: "Ты молчишь или провоцируешь?",
    a: { Хищник: 1, Провокатор: 2 }
  },
  {
    q: "Ты больше слушаешь или говоришь?",
    a: { Оракул: 2, Провокатор: 1 }
  },
  {
    q: "Ты предпочитаешь действовать один?",
    a: { Хищник: 1, Стратег: 1, Исполнитель: 1 }
  }
];

let currentQuestion = 0;
let archetypeScores = {
  Хищник: 0,
  Стратег: 0,
  Провокатор: 0,
  Оракул: 0,
  Исполнитель: 0
};

function startTest() {
  currentQuestion = 0;
  archetypeScores = {
    Хищник: 0,
    Стратег: 0,
    Провокатор: 0,
    Оракул: 0,
    Исполнитель: 0
  };
  showQuestion();
}

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (currentQuestion >= testQuestions.length) {
    return showResult();
  }

  const q = testQuestions[currentQuestion];
  quiz.innerHTML = `<p>${q.q}</p>`;
  Object.entries(q.a).forEach(([type, score]) => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      archetypeScores[type] += score;
      currentQuestion++;
      showQuestion();
    };
    quiz.appendChild(btn);
  });
}

function showResult() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  const max = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1])[0];
  const result = document.getElementById("result");

  result.innerHTML = `<h3>Ты — ${max[0]}</h3><p>${describeArchetype(max[0])}</p>`;
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник":
      return "Атакующий, решительный, опасный. Действует быстро, редко объясняет.";
    case "Стратег":
      return "Планирует, просчитывает, управляет на дистанции. Не тратит себя.";
    case "Провокатор":
      return "Взрывает эмоции, вбрасывает хаос, влияет на динамику окружения.";
    case "Оракул":
      return "Видит глубже. Смотрит в суть, не раскрывает намерений. Управляет знанием.";
    case "Исполнитель":
      return "Дисциплина и стабильность. Не сбивается. Держит результат.";
    default:
      return "Наблюдатель вне архетипов.";
  }
}// 🗺️ Карта стратегии
function addGoal() {
  const text = document.getElementById("goalInput").value.trim();
  const type = document.getElementById("goalType").value;

  if (!text) return;

  const li = document.createElement("li");
  li.textContent = `🎯 ${text}`;
  li.className = type;
  li.setAttribute("data-status", "plan");
  li.onclick = () => cycleGoalStatus(li);

  document.getElementById("strategyList").appendChild(li);
  document.getElementById("goalInput").value = "";
  saveLog("Добавлена цель: " + text + " [" + type + "]");
}

function cycleGoalStatus(li) {
  const statuses = ["plan", "process", "done", "fail"];
  let current = li.getAttribute("data-status") || "plan";
  let index = statuses.indexOf(current);
  let next = statuses[(index + 1) % statuses.length];
  li.setAttribute("data-status", next);
  li.style.opacity = next === "fail" ? 0.5 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";
  saveLog(`Цель обновлена: ${li.textContent} → ${next}`);
}