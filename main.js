// js/main.js — Точка входа

import { getRule } from "./rules.js"; import { addTask, loadTasks } from "./tasks.js"; import { addReminder, loadReminders } from "./reminder.js"; import { addPerson, loadPeople } from "./people.js"; import { addWorkout, loadFitness, updateFitChart } from "./fitness.js"; import { startTest } from "./archetype.js"; import { addGoal, loadStrategy } from "./strategy.js"; import { toggleLog, loadActivityLog } from "./log.js"; import { setState, loadState } from "./state.js";

window.addTask = addTask; window.addReminder = addReminder; window.addPerson = addPerson; window.addWorkout = addWorkout; window.startTest = startTest; window.addGoal = addGoal; window.toggleLog = toggleLog; window.setState = setState; window.getRule = getRule;

window.addEventListener("DOMContentLoaded", () => { getRule(); loadState(); loadTasks(); loadReminders(); loadPeople(); loadFitness(); loadStrategy(); loadActivityLog(); updateFitChart(); });

