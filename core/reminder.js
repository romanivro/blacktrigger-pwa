// core/reminder.js

export function addReminder() { const time = document.getElementById("reminderTime").value; const text = document.getElementById("reminderText").value.trim(); if (!time || !text) return;

const reminder = { time, text }; const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.push(reminder); localStorage.setItem("reminders", JSON.stringify(reminders));

renderReminders(); scheduleReminder(reminder); saveLog("Добавлено напоминание: " + time + " — " + text);

document.getElementById("reminderTime").value = ""; document.getElementById("reminderText").value = ""; }

export function renderReminders() { const list = document.getElementById("reminderList"); if (!list) return; list.innerHTML = ""; const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.forEach((r, i) => { const li = document.createElement("li"); li.textContent = ${r.time} — ${r.text}; const btn = document.createElement("button"); btn.textContent = "❌"; btn.onclick = () => { reminders.splice(i, 1); localStorage.setItem("reminders", JSON.stringify(reminders)); renderReminders(); }; li.appendChild(btn); list.appendChild(li); }); }

export function scheduleReminder(reminder) { const now = new Date(); const [hour, minute] = reminder.time.split(":").map(Number); const target = new Date(); target.setHours(hour, minute, 0, 0); if (target <= now) target.setDate(now.getDate() + 1); const delay = target - now;

setTimeout(() => { alert("🔔 Напоминание: " + reminder.text); scheduleReminder(reminder); // Повтор на завтра }, delay); }

export function loadReminders() { const reminders = JSON.parse(localStorage.getItem("reminders") || "[]"); reminders.forEach(scheduleReminder); renderReminders(); }

