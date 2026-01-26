import { appData } from "./state.js";

export const elements = {
  views: document.querySelectorAll(".view"),
  navItems: document.querySelectorAll(".nav-item"),
  goalsContainer: document.getElementById("goals-container"),
  greeting: document.getElementById("greeting"),
  userLevel: document.getElementById("user-level"),
  xpBar: document.getElementById("xp-bar"),
};

export function updateUserUI() {
  elements.greeting.textContent = `Hola, ${appData.user.name}`;
  elements.userLevel.textContent = `Nvl ${appData.user.level}`;
  elements.xpBar.style.width = `${Math.min(appData.user.xp, 100)}%`;
}
