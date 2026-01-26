// modules/state.js

export const defaultData = {
  user: {
    name: "Viajero",
    xp: 0,
    level: 1,
    streak: 0,
    lastLogin: new Date().toDateString()
  },
  goals: []
};

export let appData = JSON.parse(localStorage.getItem("metaflow_data")) 
  || structuredClone(defaultData);

export function saveData() {
  localStorage.setItem("metaflow_data", JSON.stringify(appData));
}
