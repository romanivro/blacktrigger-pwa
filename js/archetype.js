// js/archetype.js

let currentQuestion = 0;
let archetypeScores = {
  Хищник: 0,
  Стратег: 0,
  Провокатор: 0,
  Оракул: 0,
  Исполнитель: 0,
  Саппорт: 0,
  Альфа: 0
};

const testQuestions = [
  { q: "Как ты решаешь конфликты?", a: { Хищник: 2, Стратег: 1 } },
  { q: "Что важнее: результат или порядок?", a: { Стратег: 2, Исполнитель: 1 } },
  { q: "Ты молчишь или провоцируешь?", a: { Хищник: 1, Провокатор: 2 } },
  { q: "Ты больше слушаешь или говоришь?", a: { Оракул: 2, Провокатор: 1 } },
  { q: "Ты предпочитаешь действовать один?", a: { Хищник: 1, Стратег: 1, Исполнитель: 1 } },
  { q: "Ты решаешь или поддерживаешь?", a: { Альфа: 2, Саппорт: 2 } },
  { q: "Считаешь себя умным?", a: { Оракул: 2, Стратег: 1 } },
  { q: "Часто ли манипулируешь?", a: { Провокатор: 2, Хищник: 1 } }
];

export function startTest() {
  currentQuestion = 0;
  resetScores();
  showQuestion();
}

function resetScores() {
  Object.keys(archetypeScores).forEach(key => archetypeScores[key] = 0);
}

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (currentQuestion >= testQuestions.length) {
    return showResult();
  }

  const q = testQuestions[currentQuestion];
  quiz.innerHTML = `<p>${q.q}</p>`;
  Object.entries(q.a).forEach(([type, score]) => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      archetypeScores[type] += score;
      currentQuestion++;
      showQuestion();
    };
    quiz.appendChild(btn);
  });
}

function showResult() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  const sorted = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1]);
  const max = sorted[0];
  const result = document.getElementById("result");

  result.innerHTML = `<h3>Ты — ${max[0]}</h3><p>${describeArchetype(max[0])}</p>`;
  saveLog(`Тест архетипа: ${max[0]}`);
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник": return "⚔️ Атакующий, быстрый. Не объясняет — действует. Используй агрессию стратегически.";
    case "Стратег": return "🧠 Планировщик. Видит наперёд. Держи дистанцию и управляй через расчёт.";
    case "Провокатор": return "🔥 Вбрасывает хаос. Управляет чужими эмоциями. Провоцируй для выгодных условий.";
    case "Оракул": return "🔮 Глубинное восприятие. Управляет знанием. Не раскрывает карты. Анализируй.";
    case "Исполнитель": return "🛡️ Дисциплина и стабильность. Не сбивается. Удерживает позиции. Тебя нельзя сломать.";
    case "Саппорт": return "🤝 Поддерживает. Незаметно усиливает лидера. Используй альфу как вектор.";
    case "Альфа": return "👑 Прямое доминирование. Ведёт за собой. Учись делегировать и видеть игру.";
    default: return "Наблюдатель вне архетипов.";
  }
}