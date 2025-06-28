import { saveLog } from "./log.js";

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
  saveStrategy();
  saveLog("Добавлена цель: " + text + " [" + type + "]");
}

function cycleGoalStatus(li) {
  const statuses = ["plan", "process", "done", "fail"];
  const current = li.getAttribute("data-status") || "plan";
  const index = statuses.indexOf(current);
  const next = statuses[(index + 1) % statuses.length];

  li.setAttribute("data-status", next);
  li.style.opacity = next === "fail" ? 0.5 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";
  saveStrategy();
  saveLog(`Цель обновлена: ${li.textContent} → ${next}`);
}

export function loadStrategy() {
  const data = localStorage.getItem("strategy");
  if (!data) return;
  document.getElementById("strategyList").innerHTML = data;

  const items = document.querySelectorAll("#strategyList li");
  items.forEach(li => {
    li.onclick = () => cycleGoalStatus(li);
  });
}

function saveStrategy() {
  const html = document.getElementById("strategyList").innerHTML;
  localStorage.setItem("strategy", html);
}