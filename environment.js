// 👥 Блок окружения: добавление, удаление, метки, сохранение

function createPersonElement(name, status) {
  const li = document.createElement("li");
  li.innerHTML = `${name} — <span class="${status}">${status.toUpperCase()}</span>`;

  // ❌ Кнопка удаления
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = () => {
    li.remove();
    saveLog("Удалён человек: " + name);
    updatePeopleStorage();
  };
  li.appendChild(delBtn);

  // 🏷 Метки
  const tags = ["+ресурс", "-балласт", "религиозен", "слаб"];
  tags.forEach(tag => {
    const tagBtn = document.createElement("button");
    tagBtn.textContent = tag;
    tagBtn.style.marginLeft = "5px";
    tagBtn.onclick = () => {
      li.innerHTML = li.innerHTML.replace("</span>", ` — ${tag}</span>`);
      saveLog(`Метка [${tag}] добавлена к: ${name}`);
      updatePeopleStorage();
    };
    li.appendChild(tagBtn);
  });

  return li;
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;

  if (!name) return;

  const li = createPersonElement(name, status);
  document.getElementById("peopleList").appendChild(li);
  document.getElementById("personName").value = "";
  saveLog(`Добавлен человек: ${name} (${status})`);
  updatePeopleStorage();
}

function updatePeopleStorage() {
  const list = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(list));
}

function loadPeople() {
  const saved = JSON.parse(localStorage.getItem("people") || "[]");
  saved.forEach(html => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent;
    const name = text.split("—")[0].trim();
    const match = html.match(/class="(.*?)"/);
    const status = match ? match[1] : "yellow";
    const li = createPersonElement(name, status);
    li.innerHTML = html; // Вставляем сохранённый HTML с метками
    document.getElementById("peopleList").appendChild(li);
  });
}