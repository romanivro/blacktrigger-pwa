// 👥 Окружение

function createPersonElement(name, status, tags = []) {
  const li = document.createElement("li");
  li.className = "person-entry";

  // Статус
  const statusLabel = `<span class="${status}">${status.toUpperCase()}</span>`;

  // Метки
  const tagSpans = tags.map(t => `<span class="tag">${t}</span>`).join(" ");
  li.innerHTML = `${name} — ${statusLabel} ${tagSpans}`;

  // Удаление
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => {
    li.remove();
    saveLog("Удалён человек: " + name);
    updatePeopleStorage();
  };

  li.appendChild(delBtn);
  return li;
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;

  if (!name) return;

  // Метки
  const tags = [];
  if (document.getElementById("tagResource").checked) tags.push("💰 Ресурс");
  if (document.getElementById("tagBallast").checked) tags.push("🪨 Балласт");
  if (document.getElementById("tagWeak").checked) tags.push("🧠 Слабый");
  if (document.getElementById("tagReligious").checked) tags.push("✝️ Религиозный");

  const li = createPersonElement(name, status, tags);
  document.getElementById("peopleList").appendChild(li);

  saveLog(`Добавлен человек: ${name} (${status}), метки: ${tags.join(", ") || "—"}`);
  document.getElementById("personName").value = "";
  document.querySelectorAll(".tag-checkbox").forEach(c => (c.checked = false));

  updatePeopleStorage();
}

function updatePeopleStorage() {
  const entries = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(entries));
}

function loadPeople() {
  const data = JSON.parse(localStorage.getItem("people") || "[]");
  data.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = p;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      li.remove();
      saveLog("Удалён человек: " + li.textContent);
      updatePeopleStorage();
    };

    li.appendChild(delBtn);
    document.getElementById("peopleList").appendChild(li);
  });
}