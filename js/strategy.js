// strategy.js — Модуль карты стратегии

let strategyData = [];

function addGoal() {
  const goalText = document.getElementById("goalInput").value.trim();
  const goalType = document.getElementById("goalType").value;

  if (!goalText) return;

  const goal = {
    id: Date.now(),
    text: goalText,
    type: goalType,
    resources: [],
    levers: [],
    obstacles: [],
    people: [],
    done: false
  };

  strategyData.push(goal);
  saveStrategy();
  renderStrategy();
  document.getElementById("goalInput").value = "";
}

function renderStrategy() {
  const container = document.getElementById("strategyList");
  container.innerHTML = "";

  strategyData.forEach(goal => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div><strong>${goal.text}</strong> (${goal.type})</div>
      <button onclick="toggleGoalDone(${goal.id})">${goal.done ? "✅ Выполнено" : "📌 В процессе"}</button>
      <button onclick="removeGoal(${goal.id})">❌ Удалить</button>

      <details>
        <summary>⚙️ Подробности</summary>
        <div>
          <label>Ресурсы: <input type="text" onkeydown="addToGoal(event, ${goal.id}, 'resources')"/></label>
          <ul>${goal.resources.map(r => `<li>${r}</li>`).join("")}</ul>

          <label>Рычаги: <input type="text" onkeydown="addToGoal(event, ${goal.id}, 'levers')"/></label>
          <ul>${goal.levers.map(r => `<li>${r}</li>`).join("")}</ul>

          <label>Препятствия: <input type="text" onkeydown="addToGoal(event, ${goal.id}, 'obstacles')"/></label>
          <ul>${goal.obstacles.map(r => `<li>${r}</li>`).join("")}</ul>

          <label>Участники (из окружения): <input type="text" onkeydown="addToGoal(event, ${goal.id}, 'people')"/></label>
          <ul>${goal.people.map(r => `<li>${r}</li>`).join("")}</ul>
        </div>
      </details>
    `;
    container.appendChild(li);
  });
}

function toggleGoalDone(id) {
  const goal = strategyData.find(g => g.id === id);
  if (goal) {
    goal.done = !goal.done;
    saveStrategy();
    renderStrategy();
  }
}

function removeGoal(id) {
  strategyData = strategyData.filter(g => g.id !== id);
  saveStrategy();
  renderStrategy();
}

function addToGoal(e, goalId, field) {
  if (e.key === "Enter") {
    const value = e.target.value.trim();
    if (!value) return;
    const goal = strategyData.find(g => g.id === goalId);
    if (goal) {
      goal[field].push(value);
      saveStrategy();
      renderStrategy();
    }
  }
}

function saveStrategy() {
  localStorage.setItem("strategy", JSON.stringify(strategyData));
}

function loadStrategy() {
  const data = localStorage.getItem("strategy");
  if (data) {
    strategyData = JSON.parse(data);
    renderStrategy();
  }
}

window.addGoal = addGoal;
window.loadStrategy = loadStrategy;
window.toggleGoalDone = toggleGoalDone;
window.removeGoal = removeGoal;
window.addToGoal = addToGoal;