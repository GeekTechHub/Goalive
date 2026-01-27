// goals.js
import { appState, saveState } from "./state.js";

export function addGoal(text, category) {
  const newGoal = {
    id: Date.now(),
    text,
    category,
    completed: false,
    createdAt: new Date().toISOString()
  };

  appState.goals.push(newGoal);
  saveState();
}

export function toggleGoal(id) {
  const goal = appState.goals.find(g => g.id === id);
  if (!goal) return;

  goal.completed = !goal.completed;

  // XP simple por completar meta
  if (goal.completed) {
    appState.user.xp += 10;

    // subir nivel cada 100 XP
    if (appState.user.xp >= appState.user.level * 100) {
      appState.user.level++;
    }
  }

  saveState();
}

export function renderDashboard() {
  const list = document.getElementById("goals-list");

  if (!list) return;

  list.innerHTML = "";

  if (appState.goals.length === 0) {
    list.innerHTML = "<p>No tienes metas activas. ¡Toca el + para empezar!</p>";
    return;
  }

  appState.goals.forEach(goal => {
    const item = document.createElement("div");
    item.className = "goal-item";
    item.innerHTML = `
      <label>
        <input type="checkbox" ${goal.completed ? "checked" : ""}>
        ${goal.text} <small>(${goal.category})</small>
      </label>
    `;

    const checkbox = item.querySelector("input");
    checkbox.addEventListener("change", () => {
      toggleGoal(goal.id);
      renderDashboard();
    });

    list.appendChild(item);
  });
}
