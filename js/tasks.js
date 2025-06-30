// Файл: js/tasks.js

export function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = "🔹 " + value;

  // Вычёркивание по клику
  li.onclick = () => {
    li.style.textDecoration = li.style.textDecoration === "line-through" ? "" : "line-through";
    saveTaskStorage();
  };

  document.getElementById("taskList").appendChild(li);
  input.value = "";

  saveLog("Задача добавлена: " + value);
  saveTaskStorage();
}

export function saveTaskStorage() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => ({
    text: li.textContent,
    done: li.style.textDecoration === "line-through"
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (!data) return;
  const tasks = JSON.parse(data);
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.style.textDecoration = "line-through";
    li.onclick = () => {
      li.style.textDecoration = li.style.textDecoration === "line-through" ? "" : "line-through";
      saveTaskStorage();
    };
    document.getElementById("taskList").appendChild(li);
  });
}