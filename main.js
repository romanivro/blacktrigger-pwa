// Проверка доступности localStorage
function checkLocalStorage() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    console.log("localStorage доступен");
    return true;
  } catch (e) {
    console.error("localStorage недоступен:", e);
    alert("Ошибка: localStorage недоступен. Проверьте настройки браузера (режим инкогнито может блокировать).");
    return false;
  }
}

// ——————————————————————————————
// 📌 Состояние пользователя
// ——————————————————————————————
function setState() {
  const userState = document.getElementById("userState");
  if (!userState) {
    console.error("Элемент #userState не найден");
    return;
  }
  const st = userState.value;
  try {
    localStorage.setItem("userState", st);
    console.log("Состояние сохранено:", st);
    renderState();
    saveLog("Обновлено состояние: " + st);
  } catch (e) {
    console.error("Ошибка сохранения состояния:", e);
  }
}
function renderState() {
  const userState = document.getElementById("userState");
  if (!userState) {
    console.error("Элемент #userState не найден");
    return;
  }
  try {
    const st = localStorage.getItem("userState") || "focus";
    userState.value = st;
    console.log("Состояние загружено:", st);
  } catch (e) {
    console.error("Ошибка загрузки состояния:", e);
  }
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
  const ruleElement = document.getElementById("rule");
  if (!ruleElement) {
    console.error("Элемент #rule не найден");
    return;
  }
  try {
    const index = Math.floor(Math.random() * rules.length);
    ruleElement.textContent = rules[index];
    saveLog("Получено правило дня: " + rules[index]);
    console.log("Правило дня обновлено:", rules[index]);
  } catch (e) {
    console.error("Ошибка обновления правила дня:", e);
  }
}

// ——————————————————————————————
// 🧠 Лог действий
// ——————————————————————————————
function saveLog(entry) {
  if (!checkLocalStorage()) return;
  try {
    const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
    log.push({ time: new Date().toLocaleString(), entry });
    localStorage.setItem("activityLog", JSON.stringify(log));
    console.log("Лог сохранён:", entry);
    renderLog();
    updateActivityChart();
  } catch (e) {
    console.error("Ошибка сохранения лога:", e);
  }
}
function toggleLog() {
  const ul = document.getElementById("logList");
  if (!ul) {
    console.error("Элемент #logList не найден");
    return;
  }
  ul.style.display = ul.style.display === "none" ? "block" : "none";
  renderLog();
}
function renderLog() {
  const ul = document.getElementById("logList");
  if (!ul) {
    console.error("Элемент #logList не найден");
    return;
  }
  try {
    ul.innerHTML = "";
    const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
    log.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.time} — ${item.entry}`;
      ul.appendChild(li);
    });
    console.log("Лог отображён, записей:", log.length);
  } catch (e) {
    console.error("Ошибка рендеринга лога:", e);
  }
}
let activityChart = null;
function updateActivityChart() {
  const ctx = document.getElementById("activityChart");
  if (!ctx) {
    console.error("Элемент #activityChart не найден");
    return;
  }
  try {
    const raw = JSON.parse(localStorage.getItem("activityLog") || "[]");
    const map = {};
    raw.forEach(item => {
      const date = item.time.split(",")[0];
      map[date] = (map[date] || 0) + 1;
    });
    const labels = Object.keys(map);
    const data = Object.values(map);
    if (!labels.length) {
      console.log("Нет данных для графика активности");
      return;
    }
    if (activityChart) activityChart.destroy();
    activityChart = new Chart(ctx.getContext("2d"), {
      type: "line",
      data: { labels, datasets: [{ label: "Действия в день", data, fill: false, borderColor: "#0f0" }] },
      options: { scales: { y: { beginAtZero: true }, x: {} }, plugins: { legend: { display: false } } }
    });
    console.log("График активности обновлён");
  } catch (e) {
    console.error("Ошибка обновления графика активности:", e);
  }
}

// ——————————————————————————————
// 📋 План на день
// ——————————————————————————————
let tasks = [];
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  if (!taskInput || !taskList) {
    console.error("Элементы #taskInput или #taskList не найдены");
    return;
  }
  try {
    const v = taskInput.value.trim();
    if (!v) {
      console.warn("Пустой ввод задачи");
      return;
    }
    tasks.push({ text: v, done: false });
    saveTasks();
    renderTasks();
    saveLog("Добавлена задача: " + v);
    taskInput.value = "";
    console.log("Задача добавлена:", v);
  } catch (e) {
    console.error("Ошибка добавления задачи:", e);
  }
}
function renderTasks() {
  const taskList = document.getElementById("taskList");
  if (!taskList) {
    console.error("Элемент #taskList не найден");
    return;
  }
  try {
    taskList.innerHTML = "";
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
      taskList.appendChild(li);
    });
    console.log("Задачи отображены, всего:", tasks.length);
  } catch (e) {
    console.error("Ошибка рендеринга задач:", e);
  }
}
function saveTasks() {
  if (!checkLocalStorage()) return;
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Задачи сохранены:", tasks);
  } catch (e) {
    console.error("Ошибка сохранения задач:", e);
  }
}
function loadTasks() {
  if (!checkLocalStorage()) return;
  try {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    console.log("Задачи загружены:", tasks);
  } catch (e) {
    console.error("Ошибка загрузки задач:", e);
    tasks = [];
  }
}

// ——————————————————————————————
// ⏰ Напоминания
// ——————————————————————————————
let reminders = [];
function addReminder() {
  const reminderTime = document.getElementById("reminderTime");
  const reminderText = document.getElementById("reminderText");
  const reminderList = document.getElementById("reminderList");
  if (!reminderTime || !reminderText || !reminderList) {
    console.error("Элементы #reminderTime, #reminderText или #reminderList не найдены");
    return;
  }
  try {
    const time = reminderTime.value;
    const text = reminderText.value.trim();
    if (!time || !text) {
      console.warn("Пустой ввод напоминания");
      return;
    }
    reminders.push({ time, text });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
    scheduleAllReminders();
    saveLog("Добавлено напоминание: " + text);
    reminderText.value = "";
    console.log("Напоминание добавлено:", { time, text });
  } catch (e) {
    console.error("Ошибка добавления напоминания:", e);
  }
}
function renderReminders() {
  const ul = document.getElementById("reminderList");
  if (!ul) {
    console.error("Элемент #reminderList не найден");
    return;
  }
  try {
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
    console.log("Напоминания отображены, всего:", reminders.length);
  } catch (e) {
    console.error("Ошибка рендеринга напоминаний:", e);
  }
}
function scheduleAllReminders() {
  try {
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
          console.log("Уведомление отправлено:", r.text);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification(`🔔 ${r.text}`);
              console.log("Уведомление разрешено и отправлено:", r.text);
            }
          });
        }
      }, delay);
    });
    console.log("Напоминания запланированы:", reminders);
  } catch (e) {
    console.error("Ошибка планирования напоминаний:", e);
  }
}
function loadReminders() {
  if (!checkLocalStorage()) return;
  try {
    reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    console.log("Напоминания загружены:", reminders);
  } catch (e) {
    console.error("Ошибка загрузки напоминаний:", e);
    reminders = [];
  }
}

// ——————————————————————————————
// 👥 Окружение
// ——————————————————————————————
let people = [];
function addPerson() {
  const personName = document.getElementById("personName");
  const personStatus = document.getElementById("personStatus");
  const peopleList = document.getElementById("peopleList");
  if (!personName || !personStatus || !peopleList) {
    console.error("Элементы #personName, #personStatus или #peopleList не найдены");
    return;
  }
  try {
    const name = personName.value.trim();
    const status = personStatus.value;
    if (!name) {
      console.warn("Пустое имя человека");
      return;
    }
    people.push({ name, status, karma: 0, tags: [] });
    savePeople();
    renderPeople();
    saveLog("Добавлен человек: " + name);
    personName.value = "";
    console.log("Человек добавлен:", { name, status });
  } catch (e) {
    console.error("Ошибка добавления человека:", e);
  }
}
function renderPeople() {
  const ul = document.getElementById("peopleList");
  if (!ul) {
    console.error("Элемент #peopleList не найден");
    return;
  }
  try {
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
    console.log("Люди отображены, всего:", people.length);
  } catch (e) {
    console.error("Ошибка рендеринга людей:", e);
  }
}
function savePeople() {
  if (!checkLocalStorage()) return;
  try {
    localStorage.setItem("people", JSON.stringify(people));
    console.log("Люди сохранены:", people);
  } catch (e) {
    console.error("Ошибка сохранения людей:", e);
  }
}
function loadPeople() {
  if (!checkLocalStorage()) return;
  try {
    people = JSON.parse(localStorage.getItem("people") || "[]");
    console.log("Люди загружены:", people);
  } catch (e) {
    console.error("Ошибка загрузки людей:", e);
    people = [];
  }
}

// ——————————————————————————————
// 🏋️ Физо
// ——————————————————————————————
let fitLog = [];
function addWorkout() {
  const exercise = document.getElementById("exercise");
  const amount = document.getElementById("amount");
  const fitLogList = document.getElementById("fitLog");
  if (!exercise || !amount || !fitLogList) {
    console.error("Элементы #exercise, #amount или #fitLog не найдены");
    return;
  }
  try {
    const exerciseValue = exercise.value.trim();
    const amountValue = parseFloat(amount.value) || 0;
    if (!exerciseValue || !amountValue) {
      console.warn("Пустой ввод физо");
      return;
    }
    fitLog.push({ exercise: exerciseValue, amount: amountValue, date: new Date().toISOString() });
    localStorage.setItem("fitLog", JSON.stringify(fitLog));
    renderFitLog();
    updateFitChart();
    saveLog(`Физо: ${exerciseValue}=${amountValue}`);
    exercise.value = "";
    amount.value = "";
    console.log("Физо добавлено:", { exercise: exerciseValue, amount: amountValue });
  } catch (e) {
    console.error("Ошибка добавления физо:", e);
  }
}
function renderFitLog() {
  const ul = document.getElementById("fitLog");
  if (!ul) {
    console.error("Элемент #fitLog не найден");
    return;
  }
  try {
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
    console.log("Физо отображено, всего:", fitLog.length);
  } catch (e) {
    console.error("Ошибка рендеринга физо:", e);
  }
}
function updateFitChart() {
  const ctx = document.getElementById("fitChart");
  if (!ctx) {
    console.error("Элемент #fitChart не найден");
    return;
  }
  try {
    const sums = fitLog.reduce((a, e) => {
      a[e.exercise] = (a[e.exercise] || 0) + e.amount;
      return a;
    }, {});
    const labels = Object.keys(sums);
    const data = Object.values(sums);
    if (!labels.length) {
      console.log("Нет данных для графика физо");
      return;
    }
    if (window.fitChart) window.fitChart.destroy();
    window.fitChart = new Chart(ctx.getContext("2d"), {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: "#0f0" }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
    console.log("График физо обновлён");
  } catch (e) {
    console.error("Ошибка обновления графика физо:", e);
  }
}
function loadFitLog() {
  if (!checkLocalStorage()) return;
  try {
    fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
    console.log("Физо загружено:", fitLog);
  } catch (e) {
    console.error("Ошибка загрузки физо:", e);
    fitLog = [];
  }
}

// ——————————————————————————————
// 💸 Доходы и расходы
// ——————————————————————————————
let financeLog = [];
function addFinance() {
  const financeAmount = document.getElementById("financeAmount");
  const financeType = document.getElementById("financeType");
  const financeDesc = document.getElementById("financeDesc");
  const financeList = document.getElementById("financeList");
  if (!financeAmount || !financeType || !financeDesc || !financeList) {
    console.error("Элементы #financeAmount, #financeType, #financeDesc или #financeList не найдены");
    return;
  }
  try {
    const amount = parseFloat(financeAmount.value) || 0;
    const type = financeType.value;
    const desc = financeDesc.value.trim();
    if (!amount || !desc) {
      console.warn("Пустой ввод финансов");
      return;
    }
    financeLog.push({ amount, type, desc, date: new Date().toISOString() });
    localStorage.setItem("financeLog", JSON.stringify(financeLog));
    renderFinance();
    updateFinanceChart();
    saveLog(`Финансы: ${type === "income" ? "Доход" : "Расход"} ${desc} = ${amount}`);
    financeAmount.value = "";
    financeDesc.value = "";
    console.log("Финансы добавлены:", { amount, type, desc });
  } catch (e) {
    console.error("Ошибка добавления финансов:", e);
  }
}
function renderFinance() {
  const ul = document.getElementById("financeList");
  const financeSummary = document.getElementById("financeSummary");
  if (!ul || !financeSummary) {
    console.error("Элементы #financeList или #financeSummary не найдены");
    return;
  }
  try {
    ul.innerHTML = "";
    financeLog.forEach((f, i) => {
      const dt = new Date(f.date).toLocaleDateString();
      const li = document.createElement("li");
      li.textContent = `${dt} ${f.type === "income" ? "Доход" : "Расход"}: ${f.desc} — ${f.amount}`;
      const btn = document.createElement("button");
      btn.textContent = "❌";
      btn.onclick = () => {
        financeLog.splice(i, 1);
        localStorage.setItem("financeLog", JSON.stringify(financeLog));
        renderFinance();
        updateFinanceChart();
        saveLog("Удалена финансовая запись");
      };
      li.appendChild(btn);
      ul.appendChild(li);
    });
    updateFinanceSummary();
    console.log("Финансы отображены, всего:", financeLog.length);
  } catch (e) {
    console.error("Ошибка рендеринга финансов:", e);
  }
}
function updateFinanceSummary() {
  const financeSummary = document.getElementById("financeSummary");
  if (!financeSummary) {
    console.error("Элемент #financeSummary не найден");
    return;
  }
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const recent = financeLog.filter(f => new Date(f.date) >= thirtyDaysAgo);
    const income = recent.reduce((sum, f) => f.type === "income" ? sum + f.amount : sum, 0);
    const expense = recent.reduce((sum, f) => f.type === "expense" ? sum + f.amount : sum, 0);
    const total = income - expense;
    const ratio = income + expense > 0 ? (income / (income + expense) * 100).toFixed(2) : 0;
    financeSummary.innerHTML = `
      Итог за 30 дней: ${total} | Доходы: ${income} | Расходы: ${expense} | Соотношение: ${ratio}%
    `;
    console.log("Финансовый итог обновлён:", { total, income, expense, ratio });
  } catch (e) {
    console.error("Ошибка обновления финансового итога:", e);
  }
}
function updateFinanceChart() {
  const ctx = document.getElementById("financeChart");
  if (!ctx) {
    console.error("Элемент #financeChart не найден");
    return;
  }
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const recent = financeLog.filter(f => new Date(f.date) >= thirtyDaysAgo);
    const income = recent.reduce((sum, f) => f.type === "income" ? sum + f.amount : sum, 0);
    const expense = re