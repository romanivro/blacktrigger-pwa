// Файл: js/tasks.js — Задачи дня

export function addTask() { const input = document.getElementById("taskInput"); const value = input.value.trim(); if (!value) return;

const li = document.createElement("li"); li.textContent = "🔹 " + value;

const btn = document.createElement("button"); btn.textContent = "❌"; btn.style.marginLeft = "10px"; btn.onclick = () => { li.remove(); saveTaskLog("Удалена задача: " + value); updateTaskStorage(); };

li.appendChild(btn); document.getElementById("taskList").appendChild(li); input.value = ""; saveTaskLog("Добавлена задача: " + value); updateTaskStorage(); }

export function loadTasks() { const data = localStorage.getItem("tasks"); if (!data) return;

const tasks = JSON.parse(data); tasks.forEach(text => { const li = document.createElement("li"); li.textContent = text;

const btn = document.createElement("button");
btn.textContent = "❌";
btn.style.marginLeft = "10px";
btn.onclick = () => {
  li.remove();
  saveTaskLog("Удалена задача: " + text);
  updateTaskStorage();
};

li.appendChild(btn);
document.getElementById("taskList").appendChild(li);

}); }

function updateTaskStorage() { const tasks = Array.from(document.querySelectorAll("#taskList li")) .map(li => li.childNodes[0].textContent); localStorage.setItem("tasks", JSON.stringify(tasks)); }

function saveTaskLog(entry) { const now = new Date().toLocaleString(); console.log([TASK LOG] ${now} — ${entry}); }

