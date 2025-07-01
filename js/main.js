import { getRule } from './rules.js';
import { addTask, loadTasks } from './tasks.js';
import { addReminder, loadReminders } from './reminder.js';
import { addPerson, loadPeople } from './people.js';
import { addWorkout, loadWorkouts, renderFitChart } from './fit.js';
import { startTest } from './archetype.js';
import { addGoal, loadStrategy } from './strategy.js';
import { saveLog, toggleLog, loadLog, renderActivityChart } from './log.js';
import { setState, loadState } from './state.js';

// 📜 Делаем кнопки доступными
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