// js/archetype.js

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

const roleQuestions = [
  {
    q: "Как ты достигаешь цели?",
    a: { Герой: 2, Кукловод: 1 }
  },
  {
    q: "Ты доверяешь людям?",
    a: { Медиатор: 2, Наблюдатель: 1 }
  },
  {
    q: "Тебе проще отдавать приказы или влиять скрытно?",
    a: { Кукловод: 2, Герой: 1 }
  }
];

let currentQuestion = 0;
let stage = "archetype";

let archetypeScores = {
  Хищник: 0,
  Стратег: 0,
  Провокатор: 0,
  Оракул: 0,
  Исполнитель: 0
};

let roleScores = {
  Герой: 0,
  Кукловод: 0,
  Медиатор: 0,
  Наблюдатель: 0
};

export function startTest() {
  currentQuestion = 0;
  stage = "archetype";

  for (let key in archetypeScores) archetypeScores[key] = 0;
  for (let key in roleScores) roleScores[key] = 0;

  showQuestion();
}

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("result");
  result.innerHTML = "";

  const questions = stage === "archetype" ? testQuestions : roleQuestions;

  if (currentQuestion >= questions.length) {
    if (stage === "archetype") {
      stage = "role";
      currentQuestion = 0;
      return showQuestion();
    } else {
      return showResult();
    }
  }

  const q = questions[currentQuestion];
  quiz.innerHTML = `<p>${q.q}</p>`;

  Object.entries(q.a).forEach(([type, score]) => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      if (stage === "archetype") archetypeScores[type] += score;
      else roleScores[type] += score;

      currentQuestion++;
      showQuestion();
    };
    quiz.appendChild(btn);
  });
}

function showResult() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  const maxArchetype = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1])[0][0];
  const maxRole = Object.entries(roleScores).sort((a, b) => b[1] - a[1])[0][0];

  const result = document.getElementById("result");
  result.innerHTML = `
    <h3>Ты — ${maxArchetype}</h3>
    <p>${describeArchetype(maxArchetype)}</p>
    <h3>Роль — ${maxRole}</h3>
    <p>${describeRole(maxRole)}</p>
  `;
}

function describeArchetype(type) {
  switch (type) {
    case "Хищник": return "Атакующий. Действует быстро. Не объясняет. Подавляет.";
    case "Стратег": return "Просчитывает ходы. Управляет дистанционно. Не тратит себя.";
    case "Провокатор": return "Запускает хаос. Давит на эмоции. Меняет правила.";
    case "Оракул": return "Видит глубже. Управляет знанием. Выдержан.";
    case "Исполнитель": return "Держит структуру. Стабильность. Надёжность.";
    default: return "Нейтральный.";
  }
}

function describeRole(type) {
  switch (type) {
    case "Герой":
      return "Сильный и прямолинейный. Вдохновляет. Используй харизму, бери ответственность.";
    case "Кукловод":
      return "Влияет скрыто. Играет людьми. Используй связи, действуй через других.";
    case "Медиатор":
      return "Строит мосты. Объединяет. Привлекай союзников и контролируй отношения.";
    case "Наблюдатель":
      return "Смотрит со стороны. Видит слабые места. Используй аналитические преимущества.";
    default: return "Нейтральный.";
  }
}