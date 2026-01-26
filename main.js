// Estado global
let state = {
    user: { points: 0, level: 1, streak: 0 },
    goals: JSON.parse(localStorage.getItem('goals')) || [],
    history: JSON.parse(localStorage.getItem('history')) || {}
};

// Inicializar Gráfica
let performanceChart;
function initChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#4ade80',
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: { plugins: { legend: false }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

// Renderizar Mapa de Calor
function renderHeatmap() {
    const heatmap = document.getElementById('heatmap');
    heatmap.innerHTML = '';
    for (let i = 20; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = state.history[dateStr] || 0;
        const day = document.createElement('div');
        day.className = `heat-day ${count > 0 ? (count > 2 ? 'active-2' : 'active-1') : ''}`;
        heatmap.appendChild(day);
    }
}

// Renderizar Metas
function renderGoals() {
    const list = document.getElementById('goals-list');
    list.innerHTML = '';
    state.goals.forEach((goal, index) => {
        const el = document.createElement('div');
        el.className = `goal-card ${goal.completed ? 'completed' : ''}`;
        el.innerHTML = `
            <div>
                <h4>${goal.title}</h4>
                <small>${goal.deadline} | ${goal.category}</small>
            </div>
            <div class="check-btn" onclick="toggleGoal(${index})"></div>
        `;
        list.appendChild(el);
    });
    updateUI();
}

function toggleGoal(index) {
    state.goals[index].completed = !state.goals[index].completed;
    if(state.goals[index].completed) {
        state.user.points += 50;
        const today = new Date().toISOString().split('T')[0];
        state.history[today] = (state.history[today] || 0) + 1;
    }
    save();
}

function updateUI() {
    const completed = state.goals.filter(g => g.completed).length;
    const total = state.goals.length;
    const percent = total ? Math.round((completed/total)*100) : 0;
    
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('total-completed').innerText = completed;
    document.getElementById('user-points').innerText = state.user.points;
    document.getElementById('user-level').innerText = Math.floor(state.user.points/500) + 1;
    
    const ring = document.getElementById('main-progress-ring');
    ring.style.strokeDashoffset = 220 - (percent / 100 * 220);
    renderHeatmap();
}

function save() {
    localStorage.setItem('goals', JSON.stringify(state.goals));
    localStorage.setItem('history', JSON.stringify(state.history));
    renderGoals();
}

// Eventos
document.getElementById('fab-add').onclick = () => document.getElementById('modal').classList.remove('hidden');
document.getElementById('close-modal').onclick = () => document.getElementById('modal').classList.add('hidden');

document.getElementById('save-goal').onclick = () => {
    const title = document.getElementById('goal-title').value;
    const deadline = document.getElementById('goal-deadline').value;
    const category = document.getElementById('goal-category').value;
    
    if(title && deadline) {
        state.goals.push({ title, deadline, category, completed: false });
        document.getElementById('modal').classList.add('hidden');
        save();
    }
};

// Iniciar
initChart();
renderGoals();
