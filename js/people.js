function createPersonElement(name, status, tags = []) {
  const li = document.createElement("li");
  li.className = "person-item";

  const statusSpan = `<span class="${status}">${status.toUpperCase()}</span>`;
  const tagSpans = tags.map(tag => `<span class="tag">${tag}</span>`).join(" ");

  li.innerHTML = `
    ${name} — ${statusSpan} ${tagSpans}
    <button class="delete-btn">❌</button>
    <input type="text" class="tag-input" placeholder="+ метка"/>
    <button class="add-tag-btn">➕</button>
  `;

  li.querySelector(".delete-btn").onclick = () => {
    li.remove();
    saveLog("Удалён человек: " + name);
    updatePeopleStorage();
  };

  li.querySelector(".add-tag-btn").onclick = () => {
    const input = li.querySelector(".tag-input");
    const tag = input.value.trim();
    if (tag) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      span.onclick = () => {
        span.remove();
        updatePeopleStorage();
      };
      li.insertBefore(span, li.querySelector(".delete-btn"));
      input.value = "";
      saveLog(`Метка добавлена для ${name}: ${tag}`);
      updatePeopleStorage();
    }
  };

  return li;
}