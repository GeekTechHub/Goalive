/* ESTADO INICIAL Y ESTRUCTURA DE DATOS */
const defaultData = {
    user: {
        name: "Viajero",
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: new Date().toDateString()
    },
    goals: [] // Array de objetos Meta
};

// Cargar datos o iniciar
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
const goalCategory = document.getElementById('goal-category');
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
}

/* LÓGICA DE NAVEGACIÓN */
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // UI Update
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // View Update
            const targetId = item.getAttribute('data-target');
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            if(targetId === 'insights-view') renderStats(); // Recalcular al ver
        });
    });

    // Modal Logic
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
    const today = new Date().toDateString();

    // Filtramos metas (en una app real filtraríamos por fecha, aquí mostramos todas las activas)
    if (appData.goals.length === 0) {
        goalsContainer.innerHTML = `<div class="empty-state"><p style="text-align:center; color:#999; margin-top:50px;">Todo tranquilo por aquí.<br>¡Agrega una meta!</p></div>`;
        return;
    }

    appData.goals.forEach(goal => {
        const card = document.createElement('div');
        card.className = `goal-card ${goal.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="goal-info">
                <h3>${goal.title}</h3>
<span class="goal-cat">${goal.category} • ${goal.progress}/${goal.target}</span>
${goal.frequency === "once" && goal.date ? `<small> ${goal.date}</small>` : `<small> Diario</small>`}
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
    const category = customCategoryInput.value.trim() || "General";
    const frequency = goalFrequency.value;
    const date = frequency === "once" ? goalDate.value : null;
    const target = parseInt(goalTarget.value) || 1;

    if (!title) return alert("Debes escribir una meta");

    const newGoal = {
        id: Date.now(),
        title,
        category,
        frequency,     // daily | once
        date,          // yyyy-mm-dd o null
        target,        // veces a cumplir
        progress: 0,   // progreso actual
        completed: false,
        createdAt: new Date().toISOString()
    };
 // Reset y cerrar modal
    appData.goals.unshift(newGoal);
    saveData();
    renderDashboard();
    

    newGoalInput.value = '';
customCategoryInput.value = '';
    goalTarget.value = '';
    goalDate.value = '';
    modal.style.display = "none";
}

saveGoalBtn.addEventListener('click', addGoal);
newGoalInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addGoal();
});

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
        
        // Gamificación
        if (goal.completed) {
            addXP(20);
            triggerConfetti(); // Efecto visual simple
        } else {
            addXP(-20); // Penalización por desmarcar (opcional)
        }
        
        saveData();
        renderDashboard();
        renderStats(); // Actualizar anillo si está visible
    }
}

/* GAMIFICACIÓN Y USUARIO */
function addXP(amount) {
    appData.user.xp += amount;
    if (appData.user.xp >= 100) {
        appData.user.level++;
        appData.user.xp = appData.user.xp - 100;
        alert(`¡Nivel Subido! Ahora eres Nivel ${appData.user.level}`);
    }
    if(appData.user.xp < 0) appData.user.xp = 0;
    updateUserUI();
}

function updateUserUI() {
    greetingEl.textContent = `Hola, ${appData.user.name}`;
    userLevelEl.textContent = `Nvl ${appData.user.level}`;
    xpBarEl.style.width = `${appData.user.xp}%`;
}

function checkStreak() {
    const today = new Date().toDateString();
    if (appData.user.lastLogin !== today) {
        // Lógica simple de racha: si entró ayer, aumenta. Si no, reset.
        // Para MVP solo aumentamos si hay login en día distinto.
        appData.user.lastLogin = today;
        // (Aquí iría lógica compleja de días consecutivos)
    }
    // Simulación
    document.getElementById('streak-days').textContent = appData.user.streak;
}

/* ESTADÍSTICAS E "IA" */
function renderStats() {
    const total = appData.goals.length;
    const completed = appData.goals.filter(g => g.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Actualizar anillo
    const circle = document.getElementById('daily-ring');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    document.getElementById('daily-percent').textContent = `${percent}%`;

    // IA Sugerencias
    generateAISuggestion(percent);
    renderHeatmap();
}

function generateAISuggestion(percent) {
    const aiMsg = document.getElementById('ai-message');
    const day = new Date().getDay(); // 0 Dom - 6 Sab
    
    let msg = "";
    
    if (percent === 100 && appData.goals.length > 0) {
        msg = "¡Imparable! Has completado todo. ¿Quizás es hora de una meta más ambiciosa mañana?";
    } else if (percent < 30 && day === 1) { // Lunes
        msg = "Los lunes son difíciles. Intenta cumplir solo la meta más pequeña para arrancar motores.";
    } else if (percent > 50) {
        msg = "Vas por buen camino. Mantén el ritmo para subir tu racha.";
    } else {
        msg = "Detecto un bloqueo. ¿Qué tal si usas el Modo Enfoque por 25 minutos?";
    }
    
    aiMsg.textContent = msg;
}

function renderHeatmap() {
    const container = document.getElementById('weekly-heatmap');
    container.innerHTML = '';
    const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const todayIdx = new Date().getDay();

    days.forEach((d, index) => {
        const div = document.createElement('div');
        div.className = `day-box ${index <= todayIdx ? 'active' : ''}`; // Simula actividad pasada
        div.textContent = d;
        container.appendChild(div);
    });
}

/* POMODORO (Modo Enfoque) */
let timerInterval;
let timeLeft = 25 * 60; // 25 minutos

document.getElementById('start-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if(timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            alert("¡Tiempo terminado! Tómate un descanso.");
            addXP(10); // Reward por enfoque
        }
    }, 1000);
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* UTILIDADES */
function saveData() {
    localStorage.setItem('metaflow_data', JSON.stringify(appData));
}

function getCategoryColor(cat) {
    switch(cat) {
        case 'Salud': return '#00b894';
        case 'Trabajo': return '#0984e3';
        default: return '#6c5ce7';
    }
}

function triggerConfetti() {
    // Simulación visual simple (vibración si es móvil)
    if (navigator.vibrate) navigator.vibrate(200);
}

// Iniciar app
init();
window.toggleGoal = toggleGoal;
