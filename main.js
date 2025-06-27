
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
// ⚠️ Автоподсказки и сигналы
function checkAlerts() {
  const alerts = [];

  // 1. Нет физо
  const fitData = localStorage.getItem("fitLog");
  if (!fitData || JSON.parse(fitData).length === 0) {
    alerts.push("❌ Нет зафиксированных тренировок. Тело простаивает.");
  }

  // 2. Враги без реакции
  const people = localStorage.getItem("people");
  if (people) {
    const redCount = JSON.parse(people).filter(p => p.includes("red")).length;
    if (redCount > 0) {
      alerts.push("🔴 В окружении есть враги. Прими меры.");
    }
  }

  // 3. Баланс минусовой
  const finance = localStorage.getItem("finance");
  if (finance) {
    const f = JSON.parse(finance);
    if (f.income < f.expense) {
      alerts.push("📉 Расходы превышают доход. Пересмотри активность.");
    }
  }

  // 4. Нет целей
  const strategyList = document.getElementById("strategyList");
  if (strategyList.children.length === 0) {
    alerts.push("🪓 Карта стратегии пуста. Ты идёшь без вектора.");
  }

  // Вывод
  const alertList = document.getElementById("alertList");
  alertList.innerHTML = "";
  alerts.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg;
    li.style.color = "#f00";
    alertList.appendChild(li);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(checkAlerts, 1000); // анализ после загрузки
});
// 💾 Экспорт и импорт данных
function exportData() {
  const data = {
    tasks: localStorage.getItem("tasks"),
    people: localStorage.getItem("people"),
    fitLog: localStorage.getItem("fitLog"),
    finance: localStorage.getItem("finance"),
    goals: document.getElementById("strategyList").innerHTML
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "blacktrigger-backup.json";
  a.click();

  URL.revokeObjectURL(url);
  saveLog("Экспорт выполнен.");
}

function importData() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);

    if (data.tasks) localStorage.setItem("tasks", data.tasks);
    if (data.people) localStorage.setItem("people", data.people);
    if (data.fitLog) localStorage.setItem("fitLog", data.fitLog);
    if (data.finance) localStorage.setItem("finance", data.finance);
    if (data.goals) document.getElementById("strategyList").innerHTML = data.goals;

    location.reload();
  };

  reader.readAsText(file);
}
// ⏰ Напоминания
function scheduleReminder(hour, minute, message) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour);
  target.setMinutes(minute);
  target.setSeconds(0);

  if (target < now) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    alert("🕑 Напоминание: " + message);
    scheduleReminder(hour, minute, message); // повтор
  }, delay);
}

window.addEventListener("DOMContentLoaded", () => {
  scheduleReminder(8, 0, "Составь план на день");
  scheduleReminder(21, 0, "Проверь прогресс и цели");
});
// ⏰ Напоминания
function addReminder() {
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value.trim();
  if (!time || !text) return;

  const reminder = { time, text };
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));

  renderReminders();
  scheduleReminder(reminder);
  saveLog("Добавлено напоминание: " + time + " — " + text);

  document.getElementById("reminderTime").value = "";
  document.getElementById("reminderText").value = "";
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${r.time} — ${r.text}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      reminders.splice(i, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      renderReminders();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function scheduleReminder(reminder) {
  const now = new Date();
  const [hour, minute] = reminder.time.split(":").map(Number);
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(now.getDate() + 1);
  const delay = target - now;

  setTimeout(() => {
    alert("🔔 Напоминание: " + reminder.text);
    scheduleReminder(reminder); // Повтор завтра
  }, delay);
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach(scheduleReminder);
  renderReminders();
}

window.addEventListener("DOMContentLoaded", loadReminders);
// 📚 Лог действий и активность
function saveLog(entry) {
  const now = new Date();
  const timestamp = now.toLocaleString();
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  log.push({ time: timestamp, entry });
  localStorage.setItem("activityLog", JSON.stringify(log));
}

function toggleLog() {
  const logList = document.getElementById("logList");
  logList.style.display = logList.style.display === "none" ? "block" : "none";
  renderLog();
  updateActivityChart();
}

function renderLog() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    logList.appendChild(li);
  });
}

function updateActivityChart() {
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
      labels: labels,
      datasets: [{
        label: "Активность (действий в день)",
        data: values,
        fill: false,
        borderColor: "#0f0",
        tension: 0.2
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
// 🕵️ Боевая разведка окружения
function runRecon() {
  const alerts = [];
  const raw = localStorage.getItem("people");
  if (!raw) return;
  const people = JSON.parse(raw);

  people.forEach(p => {
    const nameMatch = p.match(/^(.*?)\s+—/);
    const statusMatch = p.match(/class="(.*?)"/);
    if (!nameMatch || !statusMatch) return;

    const name = nameMatch[1];
    const status = statusMatch[1];

    // Враг не вычеркнут
    if (status === "red") {
      alerts.push(`🩸 ${name} помечен как враг, но не устранён.`);
    }

    // Балласт
    if (p.includes("балласт") || p.includes("не даёт ресурс")) {
      alerts.push(`⚠️ ${name} помечен как балласт, но сохраняется.`);
    }

    // Религиозность + слабость
    if (p.includes("религиозен") && p.includes("слаб")) {
      alerts.push(`🧪 ${name} — уязвим, но может влиять на тебя. Опасность.`);
    }

    // Нейтрал без оценки
    if (status === "yellow" && !p.includes("+") && !p.includes("-")) {
      alerts.push(`🟡 ${name} застрял в нейтральной зоне. Решай судьбу.`);
    }
  });

  const alertList = document.getElementById("alertList");
  alerts.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg;
    li.style.color = "#f90";
    alertList.appendChild(li);
    saveLog("Разведка: " + msg);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(runRecon, 1500); // запустить после загрузки окружения
});