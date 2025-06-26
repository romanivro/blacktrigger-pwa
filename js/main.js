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

function getRule() function addTask() {
  const input = document.getElementById("taskInput");
  const value = input.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.textContent = "🔹 " + value;
    document.getElementById("taskList").appendChild(li);
    input.value = "";

    saveLog("Добавлена задача: " + value);
  }
}

function saveLog(entry) {
  const now = new Date().toLocaleString();
  console.log(`[LOG] ${now} — ${entry}`);
  // В будущем: можно сохранять в localStorage или на сервер
}{
  const index = Math.floor(Math.random() * rules.length);
  document.getElementById("rule").textContent = rules[index];
}

document.addEventListener("DOMContentLoaded", getRule);