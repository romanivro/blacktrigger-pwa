// 📜 Правило дня const rules = [ "Не оправдывайся — объяснение без запроса — слабость.", "Если не приносит ресурс — отсекай.", "Хищник молчит чаще, чем говорит.", "Контроль над собой — контроль над всем.", "Каждое взаимодействие — война за интересы.", "Грубость — фильтр. Кто слаб — отпадёт сам.", "Сначала доминируй, потом дружи.", "Если не давят на тебя — дави ты.", "Ложь — инструмент, не слабость.", "Правильное \u2260 выгодное. Выбирай выгоду." ];

function getRule() { const index = Math.floor(Math.random() * rules.length); document.getElementById("rule").textContent = rules[index]; localStorage.setItem("dailyRule", index); }

function loadRule() { const saved = localStorage.getItem("dailyRule"); if (saved) { document.getElementById("rule").textContent = rules[saved]; } else { getRule(); } }

// 📋 Задачи function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (value) { const li = document.createElement("li"); li.textContent = value; li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); input.value = ""; saveTasks(); } }

function saveTasks() { const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({ text: li.textContent, done: li.classList.contains("done") })); localStorage.setItem("tasks", JSON.stringify(tasks)); }

function loadTasks() { const data = localStorage.getItem("tasks"); if (data) { const tasks = JSON.parse(data); tasks.forEach(({ text, done }) => { const li = document.createElement("li"); li.textContent = text; if (done) li.classList.add("done"); li.onclick = () => { li.classList.toggle("done"); saveTasks(); }; document.getElementById("taskList").appendChild(li); }); } }

// ⏰ Напоминания function addReminder() { const time = document.getElementById("reminderTime").value; const text = document.getElementById("reminderText").value.trim(); if (!time || !text) return;

const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.push({ time, text }); localStorage.setItem("reminders", JSON.stringify(reminders)); renderReminders(); }

function renderReminders() { const list = document.getElementById("reminderList"); list.innerHTML = ""; const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.forEach((r, i) => { const li = document.createElement("li"); li.textContent = ${r.time} — ${r.text}; const btn = document.createElement("button"); btn.textContent = "❌"; btn.onclick = () => { reminders.splice(i, 1); localStorage.setItem("reminders", JSON.stringify(reminders)); renderReminders(); }; li.appendChild(btn); list.appendChild(li); }); }

function scheduleReminders() { const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.forEach(r => { const [h, m] = r.time.split(":").map(Number); const now = new Date(); const target = new Date(); target.setHours(h, m, 0, 0); if (target <= now) target.setDate(now.getDate() + 1); const delay = target - now;

setTimeout(() => {
  alert("🔔 Напоминание: " + r.text);
}, delay);

}); }

// 🧠 Архетип (упрощённая версия, дальше доработаю) const archetypes = [ "Хищник", "Стратег", "Манипулятор", "Оракул", "Исполнитель" ];

function startTest() { const q = "Кто ты, когда никто не смотрит?"; const quiz = document.getElementById("quiz"); quiz.innerHTML = <p>${q}</p>; archetypes.forEach(type => { const btn = document.createElement("button"); btn.textContent = type; btn.onclick = () => { document.getElementById("result").innerHTML = Ты — <b>${type}</b>; localStorage.setItem("archetype", type); }; quiz.appendChild(btn); }); }

// 👥 Окружение и др. логика — будет ниже

// 🔁 Загрузка window.addEventListener("DOMContentLoaded", () => { loadRule(); loadTasks(); renderReminders(); scheduleReminders(); });

