// main.js

// ——————————————————————————————
// 📌 Состояние пользователя
// ——————————————————————————————
function setState() {
  const st = document.getElementById("userState").value;
  localStorage.setItem("userState", st);
  renderState();
}
function renderState() {
  const st = localStorage.getItem("userState") || "focus";
  document.getElementById("userState").value = st;
}
  
// ——————————————————————————————
// 📜 Правило дня
// ——————————————————————————————
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

// ——————————————————————————————
// 🧠 Лог действий
// ——————————————————————————————
function saveLog(entry) {
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]");
  log.push({ time: new Date().toLocaleString(), entry });
  localStorage.setItem("activityLog", JSON.stringify(log));
}
function toggleLog() {
  const ul = document.getElementById("logList");
  ul.style.display = ul.style.display === "none" ? "block" : "none";
  renderLog();
  updateActivityChart();
}
function renderLog() {
  const ul = document.getElementById("logList");
  ul.innerHTML = "";
  const log = JSON.parse(localStorage.getItem("activityLog") || "[]").reverse();
  log.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.time} — ${item.entry}`;
    ul.appendChild(li);
  });
}
let activityChart = null;
function updateActivityChart() {
  const raw = JSON.parse(localStorage.getItem("activityLog") || "[]");
  const map = {};
  raw.forEach(item => {
    const date = item.time.split(",")[0];
    map[date] = (map[date] || 0) + 1;
  });
  const labels = Object.keys(map), data = Object.values(map);
  const ctx = document.getElementById("activityChart").getContext("2d");
  if (activityChart) activityChart.destroy();
  activityChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ label: "Действия в день", data, fill: false, borderColor: "#0f0" }] },
    options: { scales: { y: { beginAtZero: true }, x: {} }, plugins: { legend: { display: false } } }
  });
}

// ——————————————————————————————
// 📋 План на день + напоминания
// ——————————————————————————————
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
function addTask() {
  const v = document.getElementById("taskInput").value.trim();
  if (!v) return;
  tasks.push({ text: v, done: false });
  saveTasks(); renderTasks();
  saveLog("Добавлена задача: " + v);
  document.getElementById("taskInput").value = "";
}
function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  tasks.forEach((t,i) => {
    const li = document.createElement("li");
    li.textContent = t.text;
    // отметка сделано
    const chk = document.createElement("input");
    chk.type = "checkbox"; chk.checked = t.done;
    chk.onchange = () => { t.done = chk.checked; saveTasks(); };
    li.prepend(chk);
    // кнопка удалить
    const btn = document.createElement("button");
    btn.textContent = "❌"; btn.onclick = () => { tasks.splice(i,1); saveTasks(); renderTasks(); saveLog("Удалена задача"); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
function addReminder() {
  const time = document.getElementById("reminderTime").value;
  const text = document.getElementById("reminderText").value.trim();
  if (!time||!text) return;
  reminders.push({ time, text });
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
  scheduleAllReminders();
  saveLog("Добавлено напоминание: "+text);
  document.getElementById("reminderText").value="";
}
function renderReminders() {
  const ul = document.getElementById("reminderList");
  ul.innerHTML = "";
  reminders.forEach((r,i) => {
    const li = document.createElement("li");
    li.textContent = `${r.time} — ${r.text}`;
    const btn = document.createElement("button");
    btn.textContent = "❌"; btn.onclick = () => { reminders.splice(i,1); localStorage.setItem("reminders",JSON.stringify(reminders)); renderReminders(); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function scheduleAllReminders() {
  reminders.forEach(r=> {
    const [h,m] = r.time.split(":").map(Number);
    const now= new Date(), tgt=new Date();
    tgt.setHours(h, m,0,0);
    if (tgt<now) tgt.setDate(tgt.getDate()+1);
    const delay = tgt-now;
    setTimeout(()=>{ alert("🔔 "+r.text); scheduleAllReminders(); }, delay);
  });
}

// ——————————————————————————————
// 👥 Окружение + карма + метки
// ——————————————————————————————
let people = JSON.parse(localStorage.getItem("people")||"[]");
function createPersonElem(p,i) {
  const li = document.createElement("li");
  li.innerHTML = `${p.name} — <span class="${p.status}">${p.status}</span> Karma:${p.karma}`;
  // удалить
  const btn = document.createElement("button"); btn.textContent="❌";
  btn.onclick=()=>{ people.splice(i,1); savePeople(); renderPeople(); saveLog("Удалён: "+p.name); };
  li.appendChild(btn);
  return li;
}
function addPerson() {
  const name=document.getElementById("personName").value.trim();
  const status=document.getElementById("personStatus").value;
  if(!name) return;
  people.push({ name, status, karma:0 });
  savePeople(); renderPeople();
  saveLog("Добавлен: "+name);
  document.getElementById("personName").value="";
}
function renderPeople() {
  const ul=document.getElementById("peopleList");
  ul.innerHTML="";
  people.forEach((p,i)=> ul.appendChild(createPersonElem(p,i)));
}
function savePeople() {
  localStorage.setItem("people",JSON.stringify(people));
}

// ——————————————————————————————
// 🏋️ Физо + график
// ——————————————————————————————
let fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
let fitChart = null;
function addWorkout() {
  const exercise=document.getElementById("exercise").value.trim();
  const amount=parseFloat(document.getElementById("amount").value)||0;
  if(!exercise||!amount) return;
  fitLog.push({ exercise, amount, date: new Date().toISOString() });
  localStorage.setItem("fitLog",JSON.stringify(fitLog));
  renderFitLog(); updateFitChart();
  saveLog(`Физо: ${exercise}=${amount}`);
  document.getElementById("exercise").value="";
  document.getElementById("amount").value="";
}
function renderFitLog() {
  const ul=document.getElementById("fitLog"); ul.innerHTML="";
  fitLog.forEach((e,i)=>{
    const dt=new Date(e.date).toLocaleDateString();
    const li=document.createElement("li");
    li.textContent=`${dt} ${e.exercise}: ${e.amount}`;
    const btn=document.createElement("button");
    btn.textContent="❌"; btn.onclick=()=>{
      fitLog.splice(i,1);
      localStorage.setItem("fitLog",JSON.stringify(fitLog));
      renderFitLog(); updateFitChart();
      saveLog("Удалено Физо");
    };
    li.appendChild(btn); ul.appendChild(li);
  });
}
function updateFitChart() {
  const sums=fitLog.reduce((a,e)=>(a[e.exercise]=(a[e.exercise]||0)+e.amount,a),{});
  const labels=Object.keys(sums), data=Object.values(sums);
  const ctx=document.getElementById("fitChart").getContext("2d");
  if(fitChart) fitChart.destroy();
  fitChart=new Chart(ctx,{type:"bar",data:{labels,datasets:[{data,backgroundColor:"#0f0"}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}

// ——————————————————————————————
// 🧠 Архетип (пример 5 вопросов)
// ——————————————————————————————
const testQuestions=[
  {q:"Предпочитаешь действовать?",a:{Хищник:2,Стратег:1}},
  {q:"Слушаешь или говоришь?",a:{Оракул:2,Провокатор:1}},
  {q:"Один или в команде?",a:{Исполнитель:2,Медиатор:1}},
  {q:"Эмоции или факты?",a:{Стратег:2,Провокатор:1}},
  {q:"Молчишь или провоцируешь?",a:{Хищник:2,Провокатор:1}}
];
let currentQ=0, scores={Хищник:0,Стратег:0,Провокатор:0,Оракул:0,Исполнитель:0,Медиатор:0};
function startTest(){currentQ=0;Object.keys(scores).forEach(k=>scores[k]=0);showQuestion();}
function showQuestion(){
  const quiz=document.getElementById("quiz"), res=document.getElementById("result");
  res.innerHTML=""; if(currentQ>=testQuestions.length) return showResult();
  const t=testQuestions[currentQ];
  quiz.innerHTML=`<p>${t.q}</p>`;
  Object.entries(t.a).forEach(([type,pts])=>{
    const btn=document.createElement("button");
    btn.textContent=type;
    btn.onclick=()=>{
      scores[type]+=pts; currentQ++; showQuestion();
    };
    quiz.appendChild(btn);
  });
}
function showResult(){
  const quiz=document.getElementById("quiz"), res=document.getElementById("result");
  quiz.innerHTML="";
  const [type]=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];
  res.innerHTML=`<h3>Твой архетип: ${type}</h3>`;
  saveLog("Пройден тест архетип: "+type);
}

// ——————————————————————————————
// 🗺️ Карта стратегии
// ——————————————————————————————
let goals=JSON.parse(localStorage.getItem("goals")||"[]");
function addGoal(){
  const text=document.getElementById("goalInput").value.trim();
  const type=document.getElementById("goalType").value;
  if(!text)return;
  goals.push({ text, type, status:"plan" });
  localStorage.setItem("goals",JSON.stringify(goals));
  renderGoals(); saveLog("Добавлена цель: "+text);
  document.getElementById("goalInput").value="";
}
function renderGoals(){
  const ul=document.getElementById("strategyList"); ul.innerHTML="";
  goals.forEach((g,i)=>{
    const li=document.createElement("li");
    li.textContent=`[${g.type}] ${g.text}`;
    li.onclick=()=>{ // смена статуса
      const order=["plan","process","done","fail"];
      g.status= order[(order.indexOf(g.status)+1)%order.length];
      localStorage.setItem("goals",JSON.stringify(goals));
      renderGoals(); saveLog("Обновлен статус цели");
    };
    if(g.status==="done") li.style.textDecoration="line-through";
    if(g.status==="fail") li.style.opacity=0.5;
    // удалить
    const btn=document.createElement("button"); btn.textContent="❌";
    btn.onclick=()=>{ goals.splice(i,1); localStorage.setItem("goals",JSON.stringify(goals)); renderGoals(); saveLog("Удалена цель"); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function renderReminders() {
  const ul = document.getElementById("reminderList");
  ul.innerHTML = "";
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${r.time} — ${r.text}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      reminders.splice(i, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      renderReminders();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function scheduleAllReminders() {
  reminders.forEach(r => {
    const [h, m] = r.time.split(":").map(Number);
    const now = new Date();
    const t = new Date(); t.setHours(h, m, 0, 0);
    if (t < now) t.setDate(now.getDate() + 1);
    const delay = t - now;
    setTimeout(() => {
      alert("🔔 Напоминание: " + r.text);
      scheduleAllReminders();
    }, delay);
  });
}

// ——————————————————————————————
// 👥 Окружение
// ——————————————————————————————
let people = JSON.parse(localStorage.getItem("people") || "[]");
function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  if (!name) return;
  people.push({ name, status });
  savePeople(); renderPeople();
  saveLog("Добавлен человек: "+name);
  document.getElementById("personName").value = "";
}
function renderPeople() {
  const ul = document.getElementById("peopleList");
  ul.innerHTML = "";
  people.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.name} — <span class="${p.status}">${p.status.toUpperCase()}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      people.splice(i,1); savePeople(); renderPeople();
      saveLog("Удалён человек: "+p.name);
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function savePeople() {
  localStorage.setItem("people", JSON.stringify(people));
}

// ——————————————————————————————
// 🏋️‍♂️ Физо + график
// ——————————————————————————————
let fitLog = JSON.parse(localStorage.getItem("fitLog") || "[]");
function addWorkout() {
  const exercise = document.getElementById("exercise").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());
  if (!exercise || isNaN(amount)) return;
  fitLog.push({ exercise, amount });
  saveFit(); renderFit();
  saveLog(`Физо: ${exercise} — ${amount}`);
  document.getElementById("exercise").value = "";
  document.getElementById("amount").value = "";
}
function renderFit() {
  const ul = document.getElementById("fitLog");
  ul.innerHTML = "";
  fitLog.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `🏃 ${item.exercise}: ${item.amount}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => { fitLog.splice(i, 1); saveFit(); renderFit(); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
  updateFitChart();
}
function saveFit() {
  localStorage.setItem("fitLog", JSON.stringify(fitLog));
}

let fitChart = null;
function updateFitChart() {
  const dataMap = {};
  fitLog.forEach(item => {
    dataMap[item.exercise] = (dataMap[item.exercise] || 0) + item.amount;
  });
  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);
  const ctx = document.getElementById("fitChart").getContext("2d");
  if (fitChart) fitChart.destroy();
  fitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Сумма по упражнениям",
        data: values,
        backgroundColor: "#0f0"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true },
        x: {}
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ——————————————————————————————
// ⚠️ Инициализация
// ——————————————————————————————
window.addEventListener("DOMContentLoaded",()=>{
  renderState();
  getRule();
  renderLog();
  renderTasks();
  renderReminders();
  scheduleAllReminders();
  renderPeople();
  renderFitLog();
  updateFitChart();
  renderGoals();
});