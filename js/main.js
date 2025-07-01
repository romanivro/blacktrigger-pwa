// main.js — центральная сборка

import { getRule } from "./js/rules.js";
import { addTask, loadTasks } from "./js/tasks.js";
import { addReminder, loadReminders } from "./js/reminders.js";
import { addPerson, loadPeople } from "./js/people.js";
import { addWorkout, loadWorkouts } from "./js/fitness.js";
import { startTest } from "./js/archetype.js";
import { addGoal, loadStrategy } from "./js/strategy.js";
import { toggleLog, loadLog } from "./js/log.js";
import { loadUserState, setState } from "./js/state.js";

// Глобальный доступ
window.addTask = addTask;
window.addReminder = addReminder;
window.addPerson = addPerson;
window.addWorkout = addWorkout;
window.addGoal = addGoal;
window.startTest = startTest;
window.toggleLog = toggleLog;
window.setState = setState;

// Инициализация при загрузке
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadReminders();
  loadPeople();
  loadWorkouts();
  loadStrategy();
  loadUserState();
  loadLog();
});