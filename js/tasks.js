function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();

  if (value) {
    const li = createTaskElement(value);
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveTasks();
    saveLog("Добавлена задача: " + value);
  }
}

function createTaskElement(text) {
  const li = document.createElement("li");
  li.textContent = "🔹 " + text;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.style.marginLeft = "10px";
  btn.onclick = () => {
    li.remove();
    saveTasks();
    saveLog("Удалена задача: " + text);
  };

  li.appendChild(btn);
  return li;
}

function saveTasks() {
  const items = Array.from(document.querySelectorAll("#taskList li")).map(
    li => li.firstChild.textContent.trim()
  );
  localStorage.setItem("tasks", JSON.stringify(items));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks") || "[]");
  data.forEach(text => {
    const li = createTaskElement(text);
    document.getElementById("taskList").appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadTasks);