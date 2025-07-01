import { getRule } from './core/rules.js';
import { addTask, loadTasks } from './core/tasks.js';
import { addReminder, loadReminders } from './core/reminder.js';
import { addPerson, loadPeople } from './core/people.js';
import { addWorkout, loadWorkouts, renderFitChart } from './core/fit.js';
import { startTest } from './core/archetype.js';
import { addGoal, loadStrategy } from './core/strategy.js';
import { saveLog, toggleLog, loadLog, renderActivityChart } from './core/log.js';
import { setState, loadState } from './core/state.js';

// 📜 Глобальный доступ для кнопок
window.getRule = getRule;
window.addTask = addTask;
window.addReminder = addReminder;
window.addPerson = addPerson;
window.addWorkout = addWorkout;
window.startTest = startTest;
window.addGoal = addGoal;
window.toggleLog = toggleLog;
window.setState = setState;

// ⏳ Загрузка при старте
window.addEventListener("DOMContentLoaded", () => {
  getRule();
  loadTasks();
  loadReminders();
  loadPeople();
  loadWorkouts();
  renderFitChart();
  loadStrategy();
  loadLog();
  renderActivityChart();
  loadState();
});