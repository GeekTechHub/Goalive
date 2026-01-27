// state.js

const STORAGE_KEY = "goalife_state";

// Estado global de la app
export let appState = {
  user: {
    name: "Viajero",
    xp: 0,
    level: 1
  },
  goals: []
};

// Cargar desde localStorage
export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    appState = JSON.parse(saved);
  }
}

// Guardar en localStorage
export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}
