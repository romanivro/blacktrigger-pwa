// Файл: main.js — Базовая логика и структура

// 📜 Правила дня const rules = [ "Не оправдывайся — объяснение без запроса — слабость.", "Если не приносит ресурс — отсекай.", "Хищник молчит чаще, чем говорит.", "Контроль над собой — контроль над всем.", "Каждое взаимодействие — война за интересы.", "Грубость — фильтр. Кто слаб — отпадёт сам.", "Сначала доминируй, потом дружи.", "Если не давят на тебя — дави ты.", "Ложь — инструмент, не слабость.", "Правильное ≠ выгодное. Выбирай выгоду." ];

function getRule() { const index = Math.floor(Math.random() * rules.length); document.getElementById("rule").textContent = rules[index]; }

// 🧠 Лог function saveLog(entry) { const now = new Date().toLocaleString(); console.log([LOG] ${now} — ${entry}); }

// 📋 План на день function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (value) { const li = document.createElement("li"); li.textContent = "🔹 " + value; document.getElementById("taskList").appendChild(li); input.value = ""; saveLog("Задача добавлена: " + value); updateTaskStorage(); } }

function updateTaskStorage() { const tasks = Array.from(document.querySelectorAll("#taskList li")) .map(li => li.textContent); localStorage.setItem("tasks", JSON.stringify(tasks)); }

// 👥 Окружение function createPersonElement(name, status) { const li = document.createElement("li"); li.innerHTML = ${name} — <span class="${status}">${status.toUpperCase()}</span>;

const btn = document.createElement("button"); btn.textContent = "❌"; btn.style.marginLeft = "10px"; btn.onclick = () => { li.remove(); saveLog("Удалён человек: " + name); updatePeopleStorage(); };

li.appendChild(btn); return li; }

function addPerson() { const name = document.getElementById("personName").value.trim(); const status = document.getElementById("personStatus").value; if (name) { const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); document.getElementById("personName").value = ""; saveLog("Добавлен человек: " + name + " (" + status + ")"); updatePeopleStorage(); } }

function updatePeopleStorage() { const items = Array.from(document.querySelectorAll("#peopleList li")) .map(li => li.innerHTML); localStorage.setItem("people", JSON.stringify(items)); }

// ✅ Загрузка function loadTasks() { const data = localStorage.getItem("tasks"); if (data) { const tasks = JSON.parse(data); tasks.forEach(t => { const li = document.createElement("li"); li.textContent = t; document.getElementById("taskList").appendChild(li); }); } }

function loadPeople() { const people = JSON.parse(localStorage.getItem("people") || "[]"); people.forEach(p => { const temp = document.createElement("div"); temp.innerHTML = p; const name = temp.textContent.split("—")[0].trim(); const statusMatch = p.match(/class="(.*?)"/); const status = statusMatch ? statusMatch[1] : "yellow"; const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); }); }

window.addEventListener("DOMContentLoaded", () => { getRule(); loadTasks(); loadPeople(); });
import { saveLog, renderLog, updateActivityChart, toggleLogDisplay } from "./core/log.js";



import { addReminder, loadReminders } from './core/reminder.js';
window.addReminder = addReminder;
window.addEventListener("DOMContentLoaded", () => {
  loadReminders();
});

import { addGoal, loadStrategy } from "./core/strategy.js";
window.addGoal = addGoal;

window.addEventListener("DOMContentLoaded", () => {
  loadStrategy();
});

import { startTest } from "./core/archetype.js";
window.startTest = startTest;