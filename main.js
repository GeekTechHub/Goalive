import { updateUserUI } from "./ui.js";
import { renderDashboard, addGoal } from "./goals.js";

document.addEventListener("DOMContentLoaded", () => {

  const fab = document.getElementById("fab-add");
  const modal = document.getElementById("add-modal");
  const saveBtn = document.getElementById("save-goal-btn");
  const input = document.getElementById("new-goal-input");
  const category = document.getElementById("goal-category");

  fab.onclick = () => modal.style.display = "flex";

  saveBtn.onclick = () => {
    if (!input.value.trim()) return;
    addGoal(input.value, category.value);
    input.value = "";
    modal.style.display = "none";
  };

  updateUserUI();
  renderDashboard();

});
