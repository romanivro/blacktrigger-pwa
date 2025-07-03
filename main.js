// ——————————————————————————————
// 📌 Состояние пользователя
// ——————————————————————————————
function setState() {
  const st = document.getElementById("userState").value;
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
  try {
    const st = localStorage.getItem("userState") || "focus";
    document.getElementById("userState").value = st;
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
  try {
    const index = Math.floor(Math.random() * rules.length);
    document.getElementById("rule").textContent = rules[index];
    saveLog("Получено правило дня");
    console.log("Правило дня обновлено:", rules[index]);
  } catch (e) {
    console.error("Ошибка обновления правила дня:", e);
  }
}

// ——————————————————————————————
// 🧠 Лог действий
// ——————————————————————————————
function saveLog(entry) {
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
  ul.style.display = ul.style.display === "none" ? "block" : "none";
  renderLog();
}
function renderLog() {
  try {
    const ul = document.getElementById("logList");
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
    const ctx = document.getElementById("activityChart").getContext("2d");
    if (activityChart) activityChart.destroy();
    activityChart = new Chart(ctx, {
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
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
function addTask() {
  try {
    const v = document.getElementById("taskInput").value.trim();
    if (!v) {
      console.warn("Пустой ввод задачи");
      return;
    }
    tasks.push({ text: v, done: false });
    saveTasks();
    renderTasks();
    saveLog("Добавлена задача: " + v);
    document.getElementById("taskInput").value = "";
    console.log("Задача добавлена:", v);
  } catch (e) {
    console.error("Ошибка добавления задачи:", e);
  }
}
function renderTasks() {
  try {
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
    console.log("Задачи отображены, всего:", tasks.length);
  } catch (e) {
    console.error("Ошибка рендеринга задач:", e);
  }
}
function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Задачи сохранены:", tasks);
  } catch (e) {
    console.error("Ошибка сохранения задач:", e);
  }
}

// ——————————————————————————————
// ⏰ Напоминания
// ——————————————————————————————
let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
function addReminder() {
  try {
    const time = document.getElementById("reminderTime").value;
    const text = document.getElementById("reminderText").value.trim();
    if (!time || !text) {
      console.warn("Пустой ввод напоминания");
      return;
    }
    reminders.push({ time, text });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    renderReminders();
    scheduleAllReminders();
    saveLog("Добавлено напоминание: " + text);
    document.getElementById("reminderText").value = "";
    console.log("Напоминание добавлено:", { time, text });
  } catch (e) {
    console.error("Ошибка добавления напоминания:", e);
  }
}
function renderReminders() {
  try {
    const ul = document.getElementById("reminderList");
    ul.innerHTML = "";
    reminders.forEach((r, i lê) => {
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
      li.appendChild( btn);
      ul.appendChild(li);
    });
    console.log("Напоминания отображены, всего:", reminders.length);
  } catch (e) {
    console.error("Ошибка р reincarnate напоминаний:", e);
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

// ——————————————————————————————
// 👥 Окружение
// ——————————————————————————————
let people = JSON.parse(localStorage.getItem("people") || "[]");
function addPerson() {
  try {
    const name = document.getElementById("personName").value.trim();
    const status = document.getElementById("personStatus").value;
    if (!name) {
      console.warn("Пустое имя человека");
      return;
    }
    people.push({ name, status, karma: 0, tags: [] });
    savePeople();
    renderPeople();
    saveLog("Добавлен человек: " + name);
    document.getElementById("personName").value = "";
    console.log("Человек добавлен:", { name, status });
  } catch (e) {
    console.error("Ошибка добавления человека:", e);
  }
}
function renderPeople() {
  try {
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
    console.log("Люди отображены, всего:", people.length);
  } catch (e) {
    console.error("Ошибка рендеринга людей:", e);
  }
}
function savePeople() {
  try {
    localStorage.setItem("people", JSON.stringify(people));
    console.log("Люди сохранены:", people);
  } catch (e) {
    console.error("Ошибка сохранения людей:", e);
  }
}

// ——————————————————————————————
// 🏋️ Физо
// ——————————————————————————————
let fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
let fitChart = null;
function addWorkout() {
  try {
    const exercise = document.getElementById("exercise").value.trim();
    const amount = parseFloat(document.getElementById("amount").value) || 0;
    if (!exercise || !amount) {
      console.warn("Пустой ввод физо");
      return;
    }
    fitLog.push({ exercise, amount, date: new Date().toISOString() });
    localStorage.setItem("fitLog", JSON.stringify(fitLog));
    renderFitLog();
    updateFitChart();
    saveLog(`Физо: ${exercise}=${amount}`);
    document.getElementById("exercise").value = "";
    document.getElementById("amount").value = "";
    console.log("Физо добавлено:", { exercise, amount });
  } catch (e) {
    console.error("Ошибка добавления физо:", e);
  }
}
function renderFitLog() {
  try {
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
    console.log("Физо отображено, всего:", fitLog.length);
  } catch (e) {
    console.error("Ошибка рендеринга физо:", e);
  }
}
function updateFitChart() {
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
    const ctx = document.getElementById("fitChart").getContext("2d");
    if (fitChart) fitChart.destroy();
    fitChart = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: "#0f0" }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
    console.log("График физо обновлён");
  } catch (e) {
    console.error("Ошибка обновления графика физо:", e);
  }
}

// ——————————————————————————————
// 💸 Доходы и расходы
// ——————————————————————————————
let financeLog = JSON.parse(localStorage.getItem("financeLog") || "[]");
let financeChart = null;
function addFinance() {
  try {
    const amount = parseFloat(document.getElementById("financeAmount").value) || 0;
    const type = document.getElementById("financeType").value;
    const desc = document.getElementById("financeDesc").value.trim();
    if (!amount || !desc) {
      console.warn("Пустой ввод финансов");
      return;
    }
    financeLog.push({ amount, type, desc, date: new Date().toISOString() });
    localStorage.setItem("financeLog", JSON.stringify(financeLog));
    renderFinance();
    updateFinanceChart();
    saveLog(`Финансы: ${type === "income" ? "Доход" : "Расход"} ${desc} = ${amount}`);
    document.getElementById("financeAmount").value = "";
    document.getElementById("financeDesc").value = "";
    console.log("Финансы добавлены:", { amount, type, desc });
  } catch (e) {
    console.error("Ошибка добавления финансов:", e);
  }
}
function renderFinance() {
  try {
    const ul = document.getElementById("financeList");
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
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const recent = financeLog.filter(f => new Date(f.date) >= thirtyDaysAgo);
    const income = recent.reduce((sum, f) => f.type === "income" ? sum + f.amount : sum, 0);
    const expense = recent.reduce((sum, f) => f.type === "expense" ? sum + f.amount : sum, 0);
    const total = income - expense;
    const ratio = income + expense > 0 ? (income / (income + expense) * 100).toFixed(2) : 0;
    document.getElementById("financeSummary").innerHTML = `
      Итог за 30 дней: ${total} | Доходы: ${income} | Расходы: ${expense} | Соотношение: ${ratio}%
    `;
    console.log("Финансовый итог обновлён:", { total, income, expense, ratio });
  } catch (e) {
    console.error("Ошибка обновления финансового итога:", e);
  }
}
function updateFinanceChart() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const recent = financeLog.filter(f => new Date(f.date) >= thirtyDaysAgo);
    const income = recent.reduce((sum, f) => f.type === "income" ? sum + f.amount : sum, 0);
    const expense = recent.reduce((sum, f) => f.type === "expense" ? sum + f.amount : sum, 0);
    const ctx = document.getElementById("financeChart").getContext("2d");
    if (financeChart) financeChart.destroy();
    financeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Доходы", "Расходы"],
        datasets: [{ data: [income, expense], backgroundColor: ["#0f0", "#f00"] }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
    console.log("График финансов обновлён");
  } catch (e) {
    console.error("Ошибка обновления графика финансов:", e);
  }
}

// ——————————————————————————————
// 🧠 Архетип
// ——————————————————————————————
const testQuestions = [
  { q: "Предпочитаешь действовать?", a: { Хищник: 2, Стратег: 1 } },
  { q: "Слушаешь или говоришь?", a: { Оракул: 2, Провокатор: 1 } },
  { q: "Один или в команде?", a: { Исполнитель: 2, Медиатор: 1 } },
  { q: "Эмоции или факты?", a: { Стратег: 2, Провокатор: 1 } },
  { q: "Молчишь или провоцируешь?", a: { Хищник: 2, Провокатор: 1 } }
];
let currentQ = 0, scores = { Хищник: 0, Стратег: 0, Провокатор: 0, Оракул: 0, Исполнитель: 0, Медиатор: 0 };
function startTest() {
  try {
    currentQ = 0;
    Object.keys(scores).forEach(k => scores[k] = 0);
    showQuestion();
    console.log("Тест начат");
  } catch (e) {
    console.error("Ошибка начала теста:", e);
  }
}
function showQuestion() {
  try {
    const quiz = document.getElementById("quiz"), res = document.getElementById("result");
    res.innerHTML = "";
    if (currentQ >= testQuestions.length) return showResult();
    const t = testQuestions[currentQ];
    quiz.innerHTML = `<p>${t.q}</p>`;
    Object.entries(t.a).forEach(([type, pts]) => {
      const btn = document.createElement("button");
      btn.textContent = type;
      btn.onclick = () => {
        scores[type] += pts;
        currentQ++;
        showQuestion();
      };
      quiz.appendChild(btn);
    });
    console.log("Вопрос отображён:", t.q);
  } catch (e) {
    console.error("Ошибка отображения вопроса:", e);
  }
}
function showResult() {
  try {
    const quiz = document.getElementById("quiz"), res = document.getElementById("result");
    quiz.innerHTML = "";
    const [type] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    res.innerHTML = `<h3>Твой архетип: ${type}</h3>`;
    saveLog("Пройден тест архетип: " + type);
    console.log("Результат теста:", type);
  } catch (e) {
    console.error("Ошибка отображения результата теста:", e);
  }
}

// ——————————————————————————————
// 🗺️ Карта стратегии
// ——————————————————————————————
let goals = JSON.parse(localStorage.getItem("goals") || "[]");
function addGoal() {
  try {
    const text = document.getElementById("goalInput").value.trim();
    const type = document.getElementById("goalType").value;
    if (!text) {
      console.warn("Пустой ввод цели");
      return;
    }
    goals.push({ text, type, status: "plan" });
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
    saveLog("Добавлена цель: " + text);
    document.getElementById("goalInput").value = "";
    console.log("Цель добавлена:", { text, type });
  } catch (e) {
    console.error("Ошибка добавления цели:", e);
  }
}
function renderGoals() {
  try {
    const ul = document.getElementById("strategyList");
    ul.innerHTML = "";
    goals.forEach((g, i) => {
      const li = document.createElement("li");
      li.textContent = `[${g.type}] ${g.text}`;
      li.onclick = () => {
        const order = ["plan", "process", "done", "fail"];
        g.status = order[(order.indexOf(g.status) + 1) % order.length];
        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals();
        saveLog("Обновлен статус цели: " + g.text);
      };
      if (g.status === "done") li.style.textDecoration = "line-through";
      if (g.status === "fail") li.style.opacity = 0.5;
      const btn = document.createElement("button");
      btn.textContent = đòi "❌";
      btn.onclick = () => {
        goals.splice(i, 1);
        localStorage.setI