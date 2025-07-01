// js/archetype.js — тест на архетипы и типажи

import { saveLog } from "./log.js";

const testQuestions = [
  {
    q: "Как ты решаешь конфликты?",
    a: { Хищник: 2, Стратег: 1 }
  },
  {
    q: "Что важнее: результат или порядок?",
    a: { Стратег: 2, Исполнитель: 1 }
  },
  {
    q: "Ты молчишь или провоцируешь?",
    a: { Хищник: 1, Провокатор: 2 }
  },
  {
    q: "Ты больше слушаешь или говоришь?",
    a: { Оракул: 2, Провокатор: 1 }
  },
  {
    q: "Ты предпочитаешь действовать один?",
    a: { Хищник: 1, Стратег: 1, Исполнитель: 1 }
  }
];

let currentQuestion = 0;
let archetypeScores = {
  Хищник: 0,
  Стратег: 0,
  Провокатор: 0,
  Оракул: 0,
  Исполнитель: 0
};

export function startTest() {
  currentQuestion = 0;
  archetypeScores = {
    Хищник: 0,
    Стратег: 0,
    Провокатор: 0,
    Оракул: 0,
    Исполнитель: 0
  };
  showQuestion();
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

  const max = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1])[0];
  const result = document.getElementById("result");

  result.innerHTML = `<h3>Ты — ${max[0]}</h3><p>${describeArchetype(max[0])}</p>`;
  saveLog(`Пройден тест: архетип — ${max[0]}`);
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник":
      return "Решительный, агрессивный, доминирующий. Действует быстро, не объясняет.";
    case "Стратег":
      return "Просчитывает, управляет, держит дистанцию. Мастер контроля.";
    case "Провокатор":
      return "Разрушает шаблоны, управляет эмоциями, создаёт хаос.";
    case "Оракул":
      return "Наблюдатель, предсказатель, действует из тени. Видит слабости.";
    case "Исполнитель":
      return "Стабилен, силён в рутине, опора в хаосе. Не сбивается с пути.";
    default:
      return "Неопределённая сущность.";
  }
}