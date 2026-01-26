import { appData, saveData } from "./state.js";
import { elements } from "./ui.js";

export function renderDashboard() {
  const container = elements.goalsContainer;
  container.innerHTML = "";

  if (appData.goals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="text-align:center;color:#999;margin-top:50px;">
          Todo tranquilo por aquí.<br>¡Agrega una meta!
        </p>
      </div>`;
    return;
  }

  appData.goals.forEach(goal => {
    const card = document.createElement("div");
    card.className = `goal-card ${goal.completed ? "completed" : ""}`;

    card.innerHTML = `
      <div class="goal-info">
        <h3>${goal.title}</h3>
        <span class="goal-cat">${goal.category}</span>
      </div>
      <div class="check-circle">✔</div>
    `;

    card.querySelector(".check-circle")
      .addEventListener("click", () => toggleGoal(goal.id));

    container.appendChild(card);
  });
}

export function addGoal(title, category) {
  appData.goals.unshift({
    id: Date.now(),
    title,
    category,
    completed: false
  });

  saveData();
  renderDashboard();
}

function toggleGoal(id) {
  const goal = appData.goals.find(g => g.id === id);
  if (!goal) return;

  goal.completed = !goal.completed;
  saveData();
  renderDashboard();
}
