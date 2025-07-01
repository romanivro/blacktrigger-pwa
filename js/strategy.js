// js/strategy.js — карта стратегии

import { saveLog } from "./log.js";

export function addGoal() {
  const text = document.getElementById("goalInput").value.trim();
  const type = document.getElementById("goalType").value;

  if (!text) return;

  const li = document.createElement("li");
  li.innerHTML = `
    🎯 <strong>${text}</strong> 
    <span class="${type}">[${type}]</span>
    <button class="statusBtn">⏳</button>
    <button class="delBtn">❌</button>
  `;
  li.setAttribute("data-status", "plan");
  li.classList.add("goal-item");

  document.getElementById("strategyList").appendChild(li);
  saveLog(`Добавлена цель: ${text} [${type}]`);
  document.getElementById("goalInput").value = "";

  bindGoalControls(li);
  updateStrategyStorage();
}

function bindGoalControls(li) {
  const statusBtn = li.querySelector(".statusBtn");
  const delBtn = li.querySelector(".delBtn");

  statusBtn.onclick = () => cycleGoalStatus(li);
  delBtn.onclick = () => {
    li.remove();
    saveLog(`Цель удалена: ${li.textContent}`);
    updateStrategyStorage();
  };
}

function cycleGoalStatus(li) {
  const statuses = ["plan", "process", "done", "fail"];
  let current = li.getAttribute("data-status") || "plan";
  let index = statuses.indexOf(current);
  let next = statuses[(index + 1) % statuses.length];
  li.setAttribute("data-status", next);
  li.style.opacity = next === "fail" ? 0.5 : 1;
  li.style.textDecoration = next === "done" ? "line-through" : "none";
  saveLog(`Цель обновлена: ${li.textContent} → ${next}`);
  updateStrategyStorage();
}

function updateStrategyStorage() {
  const items = Array.from(document.querySelectorAll("#strategyList li")).map(li => li.outerHTML);
  localStorage.setItem("strategyGoals", JSON.stringify(items));
}

export function loadStrategy() {
  const data = localStorage.getItem("strategyGoals");
  if (!data) return;
  const goals = JSON.parse(data);
  goals.forEach(g => {
    const temp = document.createElement("div");
    temp.innerHTML = g;
    const li = temp.firstChild;
    document.getElementById("strategyList").appendChild(li);
    bindGoalControls(li);
  });
}