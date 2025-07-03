// ——————————————————————————————
// 📌 Состояние пользователя
// ——————————————————————————————
function setState() {
  const st = document.getElementById("userState").value;
  localStorage.setItem("userState", st);
  renderState();
  saveLog("Обновлено состояние: " + st);
}
function renderState() {
  const st = localStorage.getItem("userState") || "focus";
  document.getElementById("userState").value = st;
}

// ——————————————————————————————
// 📜 Правило дня
// ——————————————————————————————
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
  saveLog("Получено правило дня");
}

// ——————————————————————————————
// 🧠 Лог действий
// ——————————————————————————————
function saveLog(entry) {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  log.push({ time: new Date().toLocaleString(), entry });
  localStorage.setItem("activityLog", JSON.stringify(log));
  renderLog();
  updateActivityChart();
}
function toggleLog() {
  const ul = document.getElementById("logList");
  ul.style.display = ul.style.display === "none" ? "block" : "none";
  renderLog();
}
function renderLog() {
  const ul = document.getElementById("logList");
  ul.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    ul.appendChild(li);
  });
}
let activityChart = null;
function updateActivityChart() {
  const raw = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const map = {};
  raw.forEach(item => {
    const date = item.time.split(",")[0];
    map[date] = (map[date] || 0) + 1;
  });
  const labels = Object.keys(map);
  const data = Object.values(map);
  if (!labels.length) return;
  const ctx = document.getElementById("activityChart").getContext("2d");
  if (activityChart) activityChart.destroy();
  activityChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ label: "Действия в день", data, fill: false, borderColor: "#0f0" }] },
    options: { scales: { y: { beginAtZero: true }, x: {} }, plugins: { legend: { display: false } } }
  });
}

// ——————————————————————————————
// 📋 План на день
// ——————————————————————————————
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
function addTask() {
  const v = document.getElementById("taskInput").value.trim();
  if (!v) return;
  tasks.push({ text: v, done: false });
  saveTasks();
  renderTasks();
  saveLog("Добавлена задача: " + v);
  document.getElementById("taskInput").value = "";
}
function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.text;
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = t.done;
    chk.onchange = () => {
      t.done = chk.checked;
      saveTasks();
      saveLog(t.done ? "Задача выполнена: " + t.text : "Задача отмечена как невыполненная: " + t.text);
    };
    li.prepend(chk);
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      tasks.splice(i, 1);
      saveTasks();
      renderTasks();
      saveLog("Удалена задача: " + t.text);
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ——————————————————————————————
// ⏰ Напоминания
// ——————————————————————————————
let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
function addReminder() {
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value.trim();
  if (!time || !text) return;
  reminders.push({ time, text });
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
  scheduleAllReminders();
  saveLog("Добавлено напоминание: " + text);
  document.getElementById("reminderText").value = "";
}
function renderReminders() {
  const ul = document.getElementById("reminderList");
  ul.innerHTML = "";
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${r.time} — ${r.text}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      reminders.splice(i, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      renderReminders();
      saveLog("Удалено напоминание: " + r.text);
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function scheduleAllReminders() {
  reminders.forEach((r, i) => {
    const [h, m] = r.time.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(`🔔 ${r.text}`);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") new Notification(`🔔 ${r.text}`);
        });
      }
      // Планируем следующее напоминание
      setTimeout(() => scheduleAllReminders(), 24 * 60 * 60 * 1000);
    }, delay);
  });
}

// ——————————————————————————————
// 👥 Окружение
// ——————————————————————————————
let people = JSON.parse(localStorage.getItem("people") || "[]");
function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (!name) return;
  people.push({ name, status, karma: 0, tags: [] });
  savePeople();
  renderPeople();
  saveLog("Добавлен человек: " + name);
  document.getElementById("personName").value = "";
}
function renderPeople() {
  const ul = document.getElementById("peopleList");
  ul.innerHTML = "";
  people.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.name} — <span class="${p.status}">${p.status.toUpperCase()}</span> Karma: ${p.karma}`;
    const karmaUp = document.createElement("button");
    karmaUp.textContent = "+";
    karmaUp.onclick = () => {
      p.karma = Math.min(p.karma + 10, 100);
      savePeople();
      renderPeople();
      saveLog(`Карма увеличена для ${p.name}: ${p.karma}`);
    };
    const karmaDown = document.createElement("button");
    karmaDown.textContent = "−";
    karmaDown.onclick = () => {
      p.karma = Math.max(p.karma - 10, -100);
      savePeople();
      renderPeople();
      saveLog(`Карма уменьшена для ${p.name}: ${p.karma}`);
    };
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      people.splice(i, 1);
      savePeople();
      renderPeople();
      saveLog("Удалён человек: " + p.name);
    };
    li.appendChild(karmaUp);
    li.appendChild(karmaDown);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function savePeople() {
  localStorage.setItem("people", JSON.stringify(people));
}

// ——————————————————————————————
// 🏋️ Физо
// ——————————————————————————————
let fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
let fitChart = null;
function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = parseFloat(document.getElementById("amount").value) || 0;
  if (!exercise || !amount) return;
  fitLog.push({ exercise, amount, date: new Date().toISOString() });
  localStorage.setItem("fitLog", JSON.stringify(fitLog));
  renderFitLog();
  updateFitChart();
  saveLog(`Физо: ${exercise}=${amount}`);
  document.getElementById("exercise").value = "";
  document.getElementById("amount").value = "";
}
function renderFitLog() {
  const ul = document.getElementById("fitLog");
  ul.innerHTML = "";
  fitLog.forEach((e, i) => {
    const dt = new Date(e.date).toLocaleDateString();
    const li = document.createElement("li");
    li.textContent = `${dt} ${e.exercise}: ${e.amount}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      fitLog.splice(i, 1);
      localStorage.setItem("fitLog", JSON.stringify(fitLog));
      renderFitLog();
      updateFitChart();
      saveLog("Удалено Физо");
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function updateFitChart() {
  const sums = fitLog.reduce((a, e) => {
    a[e.exercise] = (a[e.exercise] || 0) + e.amount;
    return a;
  }, {});
  const labels = Object.keys(sums);
  const data = Object.values(sums);
  if (!labels.length) return;
  const ctx = document.getElementById("fitChart").getContext("2d");
  if (fitChart) fitChart.destroy();
  fitChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data, backgroundColor: "#0f0" }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// ——————————————————————————————
// 💸 Доходы и расходы
// ——————————————————————————————
let financeLog = JSON.parse(localStorage.getItem("financeLog") || "[]");
let financeChart = null;
function addFinance() {
  const amount = parseFloat(document.getElementById("financeAmount").value) || 0;
  const type = document.getElementById("financeType").value;
  const desc = document.getElementById("financeDesc").value.trim();
  if (!amount || !desc) return;
  financeLog.push({ amount, type, desc, date: new Date().toISOString() });
  localStorage.setItem("financeLog", JSON.stringify(financeLog));
  renderFinance();
  updateFinanceChart();
  saveLog(`Финансы: ${type === "income" ? "Доход" : "Расход"} ${desc} = ${amount}`);
  document.getElementById("financeAmount").value = "";
  document.getElementById("financeDesc").value = "";
}
function renderFinance() {
  const ul = document.getElementById("financeList");
  ul.innerHTML = "";
  financeLog.forEach((f, i) =>