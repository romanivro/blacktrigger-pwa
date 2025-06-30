// js/strategy.js — управление стратегическими целями

export function addGoal() {
  const text = document.getElementById("goalInput").value.trim();
  const type = document.getElementById("goalType").value;

  if (!text) return;

  const li = document.createElement("li");
  li.textContent = `🎯 ${text}`;
  li.className = type;
  li.setAttribute("data-status", "plan");
  li.onclick = () => cycleGoalStatus(li);

  document.getElementById("strategyList").appendChild(li);
  document.getElementById("goalInput").value = "";
  saveGoalData();
  saveLog(`Добавлена цель: ${text} [${type}]`);
}

function cycleGoalStatus(li) {
  const statuses = ["plan", "process", "done", "fail"];
  const current = li.getAttribute("data-status");
  const index = statuses.indexOf(current);
  const next = statuses[(index + 1) % statuses.length];
  li.setAttribute("data-status", next);

  // Стиль в зависимости от состояния
  li.style.opacity = next === "fail" ? 0.4 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";

  saveGoalData();
  saveLog(`Цель обновлена: ${li.textContent} → ${next}`);
}

export function saveGoalData() {
  const goals = Array.from(document.querySelectorAll("#strategyList li")).map(li => ({
    text: li.textContent,
    type: li.className,
    status: li.getAttribute("data-status")
  }));
  localStorage.setItem("goals", JSON.stringify(goals));
}

export function loadStrategy() {
  const raw = localStorage.getItem("goals");
  if (!raw) return;
  const goals = JSON.parse(raw);
  goals.forEach(g => {
    const li = document.createElement("li");
    li.textContent = g.text;
    li.className = g.type;
    li.setAttribute("data-status", g.status);
    li.onclick = () => cycleGoalStatus(li);

    // Применим стиль
    li.style.opacity = g.status === "fail" ? 0.4 : 1;
    li.style.textDecoration = g.status === "done" ? "line-through" : "none";

    document.getElementById("strategyList").appendChild(li);
  });
}