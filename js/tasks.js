// === План на день ===

import { saveLog } from "./core/log.js";

export function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;

    // Вычёркивание выполненного
    li.onclick = () => {
      li.classList.toggle("done");
      updateTaskStorage();
    };

    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveLog("Задача добавлена: " + value);
    updateTaskStorage();
  }
}

export function updateTaskStorage() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({
    text: li.textContent,
    done: li.classList.contains("done")
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    const tasks = JSON.parse(data);
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.text;
      if (task.done) li.classList.add("done");
      li.onclick = () => {
        li.classList.toggle("done");
        updateTaskStorage();
      };
      document.getElementById("taskList").appendChild(li);
    });
  }
}