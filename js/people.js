// Файл: js/people.js

export function createPersonElement(name, status, tags = [], karma = 0) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="person-name">${name}</span> — 
    <span class="person-status ${status}">${status.toUpperCase()}</span>
    <span class="person-karma">К: ${karma}</span>
    <span class="person-tags">${tags.map(tag => `#${tag}`).join(" ")}</span>
  `;

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = () => {
    li.remove();
    saveLog(`Удалён человек: ${name}`);
    updatePeopleStorage();
  };

  li.appendChild(delBtn);
  return li;
}

export function addPerson() {
  const name = document.getElementById("personName").value.trim();
  const status = document.getElementById("personStatus").value;
  const tags = [];

  if (document.getElementById("tagResource").checked) tags.push("ресурс");
  if (document.getElementById("tagBallast").checked) tags.push("балласт");
  if (document.getElementById("tagWeak").checked) tags.push("слабый");
  if (document.getElementById("tagReligious").checked) tags.push("религиозный");
  if (document.getElementById("tagManipulative")?.checked) tags.push("манипулятор");
  if (document.getElementById("tagJealous")?.checked) tags.push("завистливый");
  if (document.getElementById("tagSmart")?.checked) tags.push("умный");
  if (document.getElementById("tagTricky")?.checked) tags.push("хитрый");

  if (!name) return;

  const li = createPersonElement(name, status, tags);
  document.getElementById("peopleList").appendChild(li);
  saveLog(`Добавлен человек: ${name} (${status}, метки: ${tags.join(", ")})`);

  document.getElementById("personName").value = "";
  updatePeopleStorage();
}

export function updatePeopleStorage() {
  const list = Array.from(document.querySelectorAll("#peopleList li")).map(li => li.innerHTML);
  localStorage.setItem("people", JSON.stringify(list));
}

export function loadPeople() {
  const data = JSON.parse(localStorage.getItem("people") || "[]");
  data.forEach(html => {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const name = temp.querySelector(".person-name")?.textContent || "???";
    const status = temp.querySelector(".person-status")?.classList[1] || "yellow";
    const tagsText = temp.querySelector(".person-tags")?.textContent || "";
    const tags = tagsText.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];

    const li = createPersonElement(name, status, tags);
    document.getElementById("peopleList").appendChild(li);
  });
}