// ✅ Правила дня
const rules = [
  "Не оправдывайся — объяснение без запроса — слабость.",
  "Если не приносит ресурс — отсекай.",
  "Хищник молчит чаще, чем говорит.",
  "Контроль над собой — контроль над всем.",
  "Каждое взаимодействие — война за интересы.",
  "Грубость — фильтр. Кто слаб — отпадёт сам.",
  "Сначала доминируй, потом дружи.",
  "Если не давят на тебя — дави ты.",
  "Ложь — инструмент, не слабость.",
  "Правильное ≠ выгодное. Выбирай выгоду."
];

function getRule() {
  const index = Math.floor(Math.random() * rules.length);
  document.getElementById("rule").textContent = rules[index];
}

document.addEventListener("DOMContentLoaded", getRule);

// ✅ План на день
function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveLog("Задача добавлена: " + value);
  }
}

// ✅ Окружение
function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (name) {
    const li = document.createElement("li");
    li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;
    document.getElementById("peopleList").appendChild(li);
    saveLog("Добавлен человек: " + name + " (" + status + ")");
    document.getElementById("personName").value = "";
  }
}

// ✅ Лог (пока просто в консоль)
function saveLog(entry) {
  const now = new Date().toLocaleString();
  console.log(`[LOG] ${now} — ${entry}`);
}