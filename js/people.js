// js/people.js — Управление окружением

import { saveLog } from "../core/log.js";

export function createPersonElement(name, status) { const li = document.createElement("li"); li.innerHTML = ${name} — <span class="${status}">${status.toUpperCase()}</span>;

const btn = document.createElement("button"); btn.textContent = "❌"; btn.style.marginLeft = "10px"; btn.onclick = () => { li.remove(); saveLog("Удалён человек: " + name); updatePeopleStorage(); };

li.appendChild(btn); return li; }

export function addPerson() { const name = document.getElementById("personName").value.trim(); const status = document.getElementById("personStatus").value; if (name) { const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); document.getElementById("personName").value = ""; saveLog("Добавлен человек: " + name + " (" + status + ")"); updatePeopleStorage(); } }

export function updatePeopleStorage() { const items = Array.from(document.querySelectorAll("#peopleList li")) .map(li => li.innerHTML); localStorage.setItem("people", JSON.stringify(items)); }

export function loadPeople() { const people = JSON.parse(localStorage.getItem("people") || "[]"); people.forEach(p => { const temp = document.createElement("div"); temp.innerHTML = p; const name = temp.textContent.split("\u2014")[0].trim(); const statusMatch = p.match(/class="(.*?)"/); const status = statusMatch ? statusMatch[1] : "yellow"; const li = createPersonElement(name, status); document.getElementById("peopleList").appendChild(li); }); }

