// js/strategy.js

const goalFields = [
  { key: "goal", label: "🎯 Цель" },
  { key: "resources", label: "💰 Ресурсы" },
  { key: "levers", label: "🧠 Рычаги" },
  { key: "barriers", label: "🚧 Препятствия" },
  { key: "action", label: "⚙️ Действия" }
];

export function addGoal() {
  const goalInput = document.getElementById("goalInput");
  const typeSelect = document.getElementById("goalType");
  const text = goalInput.value.trim();
  const type = typeSelect.value;

  if (!text) return;

  const goalData = {
    goal: text,
    resources: prompt("💰 Какие ресурсы задействованы?") || "-",
    levers: prompt("🧠 Какие рычаги влияния?") || "-",
    barriers: prompt("🚧 Препятствия?") || "-",
    action: prompt("⚙️ Что нужно сделать?") || "-",
    type,
    status: "plan"
  };

  const li = renderGoal(goalData);
  document.getElementById("strategyList").appendChild(li);
  goalInput.value = "";

  saveGoal(goalData);
  saveLog("Добавлена цель: " + text);
}

function renderGoal(data) {
  const li = document.createElement("li");
  li.className = data.type;
  li.setAttribute("data-status", data.status);
  li.style.cursor = "pointer";
  li.style.border = "1px solid #444";
  li.style.padding = "5px";
  li.style.marginBottom = "5px";

  const inner = goalFields.map(f => `<strong>${f.label}</strong>: ${data[f.key]}`).join("<br>");
  li.innerHTML = inner;

  const del = document.createElement("button");
  del.textContent = "❌";
  del.style.marginLeft = "10px";
  del.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    removeGoal(data.goal);
    saveLog("Удалена цель: " + data.goal);
  };

  li.appendChild(del);

  li.onclick = () => {
    cycleGoalStatus(li, data);
  };

  return li;
}

function cycleGoalStatus(li, data) {
  const statuses = ["plan", "process", "done", "fail"];
  const current = li.getAttribute("data-status") || "plan";
  const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];

  li.setAttribute("data-status", next);
  li.style.opacity = next === "fail" ? 0.5 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";
  data.status = next;

  updateGoal(data);
  saveLog(`Цель обновлена: ${data.goal} → ${next}`);
}

// 💾 Хранилище
function saveGoal(goalData) {
  const all = JSON.parse(localStorage.getItem("goals") || "[]");
  all.push(goalData);
  localStorage.setItem("goals", JSON.stringify(all));
}

function updateGoal(goalData) {
  const all = JSON.parse(localStorage.getItem("goals") || "[]");
  const updated = all.map(g => g.goal === goalData.goal ? goalData : g);
  localStorage.setItem("goals", JSON.stringify(updated));
}

function removeGoal(goalText) {
  const all = JSON.parse(localStorage.getItem("goals") || "[]");
  const updated = all.filter(g => g.goal !== goalText);
  localStorage.setItem("goals", JSON.stringify(updated));
}

export function loadStrategy() {
  const data = JSON.parse(localStorage.getItem("goals") || "[]");
  data.forEach(g => {
    const li = renderGoal(g);
    document.getElementById("strategyList").appendChild(li);
  });
}