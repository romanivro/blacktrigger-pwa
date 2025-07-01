// js/state.js — управление состоянием (фокус, усталость, подъём)

import { saveLog } from "./log.js";
import { checkAlerts } from "./alerts.js";

const stateKey = "userState";

// Устанавливаем состояние и сохраняем
export function setState() {
  const select = document.getElementById("userState");
  const value = select.value;
  localStorage.setItem(stateKey, value);
  saveLog(`Состояние обновлено: ${select.options[select.selectedIndex].text}`);
  // при смене состояния сразу прогоняем сигналы
  checkAlerts();
}

// Загружаем состояние при старте
export function loadState() {
  const saved = localStorage.getItem(stateKey);
  if (!saved) return;
  const select = document.getElementById("userState");
  select.value = saved;
}