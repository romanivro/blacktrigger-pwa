// js/tasks.js — Блок "План на день"

// Добавить задачу
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = "🔹 " + value;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.style.marginLeft = "10px";
  btn.onclick = () => {
    li.remove();
    updateTaskStorage();
    saveLog("Удалена задача: " + value);
  };

  li.appendChild(btn);
  document.getElementById("taskList").appendChild(li);
  input.value = "";
  updateTaskStorage();
  saveLog("Добавлена задача: " + value);
}

// Сохранить задачи в localStorage
function updateTaskStorage() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(li => li.innerHTML);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Загрузить задачи из localStorage
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks") || "[]");
  data.forEach(taskHTML => {
    const temp = document.createElement("div");
    temp.innerHTML = taskHTML;
    const text = temp.textContent.replace("❌", "").trim();

    const li = document.createElement("li");
    li.textContent = text;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.onclick = () => {
      li.remove();
      updateTaskStorage();
      saveLog("Удалена задача: " + text);
    };

    li.appendChild(btn);
    document.getElementById("taskList").appendChild(li);
  });
}