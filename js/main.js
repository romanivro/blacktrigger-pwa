// === BlackTrigger: main.js ===

// 🧠 Логика логирования
import { saveLog } from "../core/log.js";

// 📜 Правила дня
import { getRule } from "./rules.js";

// 📋 План на день
import { addTask, loadTasks } from "./tasks.js";

// ⏰ Напоминания
import { addReminder, loadReminders } from "../core/reminder.js";

// 👥 Окружение
import { addPerson, loadPeople } from "./people.js";

// 🧠 Архетип
import { startTest } from "../core/archetype.js";

// 🗺️ Стратегия
import { addGoal, loadStrategy } from "../core/strategy.js";

// 🧭 Статус пользователя (фокус, усталость и т.д.)
import { setState, loadState } from "../core/state.js";

// 🏋️ Физо + график
import { addWorkout, loadWorkouts, updateFitChart } from "./fitness.js";

// 📚 Активность
import { toggleLog, renderLog, updateActivityChart } from "../core/log.js";

// === Доступ к функциям из HTML ===
window.addTask = addTask;
window.addReminder = addReminder;
window.addPerson = addPerson;
window.startTest = startTest;
window.addGoal = addGoal;
window.addWorkout = addWorkout;
window.toggleLog = toggleLog;
window.setState = setState;

// === Инициализация после загрузки ===
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadReminders();
  loadPeople();
  loadStrategy();
  loadState();
  loadWorkouts();
  updateFitChart();
  renderLog();
  updateActivityChart();
});