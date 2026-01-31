/* ESTADO INICIAL Y ESTRUCTURA DE DATOS */
const defaultData = {
    user: {
        name: "Viajero",
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: new Date().toDateString()
    },
    goals: []
};

let appData = JSON.parse(localStorage.getItem('metaflow_data')) || defaultData;

/* ELEMENTOS DOM */
const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const goalsContainer = document.getElementById('goals-container');
const greetingEl = document.getElementById('greeting');
const userLevelEl = document.getElementById('user-level');
const xpBarEl = document.getElementById('xp-bar');
const fabBtn = document.getElementById('fab-add');
const modal = document.getElementById('add-modal');
const closeModal = document.querySelector('.close-modal');
const saveGoalBtn = document.getElementById('save-goal-btn');
const newGoalInput = document.getElementById('new-goal-input');
const customCategoryInput = document.getElementById('custom-category');
const goalFrequency = document.getElementById('goal-frequency');
const goalDate = document.getElementById('goal-date');
const goalTarget = document.getElementById('goal-target');

goalFrequency.addEventListener('change', () => {
    goalDate.style.display = goalFrequency.value === 'once' ? 'block' : 'none';
});

/* INICIALIZACIÓN */
function init() {
    checkStreak();
    renderDashboard();
    renderStats();
    setupNavigation();
    updateUserUI();
/* LÓGICA DE TEMA OSCURO */
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Guardar la preferencia del usuario
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-mode', isDark);
});

// Cargar preferencia al iniciar
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-theme');
}


/* NAVEGACIÓN */
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            if(targetId === 'insights-view') renderStats();
        });
    });

    fabBtn.addEventListener('click', () => {
        modal.style.display = "flex";
        newGoalInput.focus();
    });
    
    closeModal.addEventListener('click', () => modal.style.display = "none");
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
}

/* GESTIÓN DE METAS */
function renderDashboard() {
    goalsContainer.innerHTML = '';
    if (appData.goals.length === 0) {
        goalsContainer.innerHTML = `<div class="empty-state"><p style="text-align:center; color:#999; margin-top:50px;">¡Agrega una meta!</p></div>`;
        return;
    }

    appData.goals.forEach(goal => {
        const card = document.createElement('div');
        card.className = `goal-card ${goal.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="goal-info">
                <h3>${goal.title}</h3>
                <span class="goal-cat">${goal.category} • ${goal.progress}/${goal.target}</span>
            </div>
            <div class="check-circle" onclick="toggleGoal(${goal.id})">
                <i class="fas fa-check" style="display: ${goal.completed ? 'block' : 'none'}"></i>
            </div>
        `;
        goalsContainer.appendChild(card);
    });
}

function addGoal() {
    const title = newGoalInput.value.trim();
    if (!title) return alert("Escribe una meta");

    const newGoal = {
        id: Date.now(),
        title,
        category: customCategoryInput.value.trim() || "General",
        target: parseInt(goalTarget.value) || 1,
        progress: 0,
        completed: false
    };

    appData.goals.unshift(newGoal);
    saveData();
    renderDashboard();
    
    newGoalInput.value = '';
    modal.style.display = "none";
}

saveGoalBtn.addEventListener('click', addGoal);

// CORRECCIÓN AQUÍ: Función toggleGoal limpia
function toggleGoal(id) {
    const goal = appData.goals.find(g => g.id === id);
    if (!goal) return;

    goal.progress++;
    if (goal.progress >= goal.target) {
        goal.completed = true;
        addXP(20);
        triggerConfetti();
    }

    saveData();
    renderDashboard();
    renderStats();
}

/* SISTEMA DE XP */
function addXP(amount) {
    appData.user.xp += amount;
    if (appData.user.xp >= 100) {
        appData.user.level++;
        appData.user.xp -= 100;
    }
    updateUserUI();
}

function updateUserUI() {
    greetingEl.textContent = `Hola, ${appData.user.name}`;
    userLevelEl.textContent = `Nvl ${appData.user.level}`;
    xpBarEl.style.width = `${appData.user.xp}%`;
}

function checkStreak() {
    document.getElementById('streak-days').textContent = appData.user.streak;
}

function renderStats() {
    const total = appData.goals.length;
    const completed = appData.goals.filter(g => g.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    const circle = document.getElementById('daily-ring');
    if(circle) {
        const circumference = 52 * 2 * Math.PI;
        circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
    }
    document.getElementById('daily-percent').textContent = `${percent}%`;
}

/* POMODORO */
let timeLeft = 25 * 60;
function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* UTILIDADES */
function saveData() {
    localStorage.setItem('metaflow_data', JSON.stringify(appData));
}

function triggerConfetti() {
    if (navigator.vibrate) navigator.vibrate(200);
}

init();
window.toggleGoal = toggleGoal; // Esto permite que el HTML vea la función
