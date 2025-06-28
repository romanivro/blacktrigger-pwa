// main.js — точка входа, связывает модули

import { getRule } from "./core/rules.js"; import { saveLog, toggleLog, renderLog, updateActivityChart } from "./core/log.js"; import { addTask, loadTasks } from "./core/tasks.js"; import { addReminder, loadReminders } from "./core/reminder.js"; import { addPerson, loadPeople } from "./core/people.js"; import { addWorkout, loadWorkouts, updateFitChart } from "./core/fitness.js"; import { startTest } from "./core/archetype.js"; import { addGoal, loadStrategy } from "./core/strategy.js";

// Привязка к window для кнопок window.getRule = getRule; window.addTask = addTask; window.addReminder = addReminder; window.addPerson = addPerson; window.addWorkout = addWorkout; window.startTest = startTest; window.addGoal = addGoal; window.toggleLog = toggleLog;

// Глобальные действия при загрузке window.addEventListener("DOMContentLoaded", () => { getRule(); loadTasks(); loadReminders(); loadPeople(); loadWorkouts(); loadStrategy(); renderLog(); updateActivityChart(); });

