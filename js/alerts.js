// js/alerts.js — Сигналы угроз, разведка и анализ

import { saveLog } from "./log.js";

export function checkAlerts() {
  const alerts = [];

  // Физо отсутствует
  const fit = JSON.parse(localStorage.getItem("fitLog") || "[]");
  if (fit.length === 0) alerts.push("❌ Нет зафиксированных тренировок.");

  // Нет целей
  const goals = document.querySelectorAll("#strategyList li");
  if (goals.length === 0) alerts.push("🪓 Карта стратегии пуста.");

  // В окружении враги
  const people = JSON.parse(localStorage.getItem("people") || "[]");
  const enemies = people.filter(p => p.status === "red");
  if (enemies.length > 0) alerts.push("🔴 В окружении есть враги.");

  // Состояние "усталость"
  const state = localStorage.getItem("userState");
  if (state === "tired") alerts.push("⚡️ Усталость: снизить нагрузку и избегать конфликтов.");

  // Вывод
  const alertList = document.getElementById("alertList");
  if (alertList) {
    alertList.innerHTML = "";
    alerts.forEach(msg => {
      const li = document.createElement("li");
      li.textContent = msg;
      li.style.color = "#f00";
      alertList.appendChild(li);
    });
  }

  // Сохраняем в лог
  alerts.forEach(msg => saveLog("⚠️ " + msg));
}

export function criticalReminderCheck() {
  const lastAction = localStorage.getItem("lastActionDate");
  const now = new Date().toLocaleDateString();

  if (lastAction !== now) {
    const diff = daysSince(lastAction);
    if (diff >= 3) {
      alert("⚠️ Штаб замечает слабость. Назови цель или прими последствия.");
      saveLog("Критическое уведомление: неактивность " + diff + " дня.");
    }
  }

  localStorage.setItem("lastActionDate", now);
}

function daysSince(dateStr) {
  if (!dateStr) return 99;
  const prev = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - prev) / (1000 * 60 * 60 * 24));
}