// main.js — подключение всех модулей

import { getRule } from "./js/rules.js";
import { addTask, loadTasks } from "./js/tasks.js";
import { addReminder, loadReminders } from "./js/reminders.js";
import { addPerson, loadPeople } from "./js/people.js";
import { addWorkout, loadWorkouts, renderFitChart } from "./js/fitness.js";
import { startTest } from "./js/archetype.js";
import { addGoal, loadStrategy } from "./js/strategy.js";
import { toggleLog, loadLogData } from "./js/log.js";
import { loadState, setState } from "./js/state.js";

// Глобальные функции
window.addTask = addTask;
window.addReminder = addReminder;
window.addPerson = addPerson;
window.addWorkout = addWorkout;
window.startTest = startTest;
window.addGoal = addGoal;
window.toggleLog = toggleLog;
window.setState = setState;

window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadReminders();
  loadPeople();
  loadWorkouts();
  renderFitChart();
  loadStrategy();
  loadLogData();
  loadState();
});