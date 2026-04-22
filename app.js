// ===== STATE =====
let currentTab = 'home';
let currentWorkout = null;
let workoutSessions = JSON.parse(localStorage.getItem('workoutSessions')) || [];
let personalRecords = JSON.parse(localStorage.getItem('personalRecords')) || {};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderHome();
});

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderTab(currentTab);
    });
  });
}

function renderTab(tab) {
  const content = document.getElementById('app-content');
  content.innerHTML = '';
  switch(tab) {
    case 'home': renderHome(); break;
    case 'workout': renderWorkoutSelector(); break;
    case 'progress': renderProgress(); break;
    case 'equipment': renderEquipment(); break;
  }
}

// ===== HOME =====
function renderHome() {
  const content = document.getElementById('app-content');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayWorkout = WEEKLY_SCHEDULE.find(s => s.day === today)?.workout || 'Rest';
  const totalWorkouts = workoutSessions.length;
  const thisWeekWorkouts = workoutSessions.filter(s => {
    const d = new Date(s.startTime);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  content.innerHTML = `
    <section class="section active">
      <div class="card">
        <h3>Today</h3>
        <p style="font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0;">${todayWorkout}</p>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">${today}</p>
        ${todayWorkout !== 'Rest' ? `
          <button class="btn" style="margin-top: 1rem;" onclick="startWorkout('${todayWorkout}')">
            Start Workout
          </button>
        ` : ''}
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">${thisWeekWorkouts}</div>
          <div class="label">This Week</div>
        </div>
        <div class="stat-card">
          <div class="value">${totalWorkouts}</div>
          <div class="label">Total</div>
        </div>
        <div class="stat-card">
          <div class="value">${Object.keys(personalRecords).length}</div>
          <div class="label">PRs</div>
        </div>
        <div class="stat-card">
          <div class="value">${workoutSessions.length > 0 ? Math.round(workoutSessions.length / 4) : 0}</div>
          <div class="label">Weeks Active</div>
        </div>
      </div>

      <div class="card">
        <h3>Recent PRs</h3>
        ${Object.keys(personalRecords).length > 0 ? `
          ${Object.entries(personalRecords).slice(0, 5).map(([key, value]) => `
            <div class="exercise-item">
              <span>${formatPRKey(key)}</span>
              <span class="pr-badge">${value.weight} kg × ${value.reps}</span>
            </div>
          `).join('')}
        ` : '<p style="color: var(--text-secondary); padding: 1rem; text-align: center;">No PRs yet</p>'}
      </div>

      <div class="card">
        <h3>Weekly Progress</h3>
        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
          <span style="font-size: 0.85rem;">${thisWeekWorkouts} / 5 workouts</span>
          <span style="font-size: 0.85rem; color: var(--accent);">${Math.round((thisWeekWorkouts / 5) * 100)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min((thisWeekWorkouts / 5) * 100, 100)}%"></div>
        </div>
      </div>
    </section>
  `;
}

// ===== WORKOUT =====
function renderWorkoutSelector() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <div class="workout-card" onclick="startWorkout('Push')">
        <h3>Push</h3>
        <p>Chest, Shoulders, Triceps</p>
        <div class="meta">
          <span>5 exercises</span>
          <span>~45 min</span>
        </div>
      </div>
      <div class="workout-card" onclick="startWorkout('Pull')">
        <h3>Pull</h3>
        <p>Back, Biceps</p>
        <div class="meta">
          <span>4 exercises</span>
          <span>~40 min</span>
        </div>
      </div>
      <div class="workout-card" onclick="startWorkout('Legs')">
        <h3>Legs</h3>
        <p>Quads, Hamstrings, Glutes, Calves</p>
        <div class="meta">
          <span>6 exercises</span>
          <span>~55 min</span>
        </div>
      </div>
    </section>
  `;
}

function startWorkout(type) {
  currentWorkout = { type, startTime: new Date(), exercises: [], completed: false };
  renderWorkoutSession(type);
}

function renderWorkoutSession(type) {
  const content = document.getElementById('app-content');
  const exercises = EXERCISE_TEMPLATES[type.toLowerCase()] || [];

  content.innerHTML = `
    <section class="section active">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 600;">${type}</h2>
        <button class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem;" onclick="renderTab('workout')">Cancel</button>
      </div>

      ${exercises.map((ex, i) => `
        <div class="exercise-card" id="exercise-${ex.id}">
          <div class="exercise-header">
            <h3>${i + 1}. ${ex.name}</h3>
            <span class="muscle-tag">${ex.muscle}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">
            ${ex.sets} sets × ${ex.reps} reps
          </p>
          ${Array.from({ length: ex.sets }).map((_, si) => `
            <div class="input-group">
              <label>Set ${si + 1}</label>
              <div class="input-row">
                <input type="number" placeholder="kg" id="${ex.id}-set${si}-weight" inputmode="decimal">
                <input type="number" placeholder="reps" id="${ex.id}-set${si}-reps" inputmode="numeric">
              </div>
            </div>
          `).join('')}
          <button class="btn" style="margin-top: 1rem;" onclick="completeExercise('${ex.id}', '${ex.prKey}')">Complete</button>
        </div>
      `).join('')}

      <button class="btn" style="margin-top: 1.5rem;" onclick="finishWorkout()">Finish Workout</button>
    </section>
  `;
}

function completeExercise(exerciseId, prKey) {
  const exercise = Object.values(EXERCISE_TEMPLATES).flat().find(e => e.id === exerciseId);
  const sets = [];
  for (let i = 0; i < exercise.sets; i++) {
    const weight = document.getElementById(`${exerciseId}-set${i}-weight`).value;
    const reps = document.getElementById(`${exerciseId}-set${i}-reps`).value;
    if (weight && reps) sets.push({ weight: parseFloat(weight), reps: parseInt(reps) });
  }
  if (sets.length === 0) { showToast('Log at least one set', 'warning'); return; }
  
  const maxWeight = Math.max(...sets.map(s => s.weight));
  const maxReps = sets.find(s => s.weight === maxWeight)?.reps;
  
  if (!personalRecords[prKey] || maxWeight > personalRecords[prKey].weight) {
    personalRecords[prKey] = { weight: maxWeight, reps: maxReps, date: new Date().toISOString() };
    localStorage.setItem('personalRecords', JSON.stringify(personalRecords));
    showToast(`New PR: ${maxWeight} kg × ${maxReps}`, 'success');
  }
  
  currentWorkout.exercises.push({ exerciseId, sets, completedAt: new Date() });
  document.getElementById(`exercise-${exerciseId}`).classList.add('completed');
  showToast('Exercise completed');
}

function finishWorkout() {
  if (currentWorkout.exercises.length === 0) { showToast('Complete at least one exercise', 'warning'); return; }
  currentWorkout.endTime = new Date();
  currentWorkout.completed = true;
  workoutSessions.push(currentWorkout);
  localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  showToast('Workout saved');
  setTimeout(() => renderTab('home'), 1000);
}

// ===== PROGRESS =====
function renderProgress() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <div class="card">
        <h3>Personal Records</h3>
        ${Object.keys(personalRecords).length > 0 ? Object.entries(personalRecords).map(([key, value]) => `
          <div class="exercise-item">
            <span>${formatPRKey(key)}</span>
            <span class="pr-badge">${value.weight} kg × ${value.reps}</span>
          </div>
        `).join('') : '<p style="color: var(--text-secondary); padding: 1rem; text-align: center;">No PRs yet</p>'}
      </div>
      <div class="card">
        <h3>History</h3>
        <p style="color: var(--text-secondary);">Total workouts: ${workoutSessions.length}</p>
        ${workoutSessions.length > 0 ? `<p style="color: var(--text-secondary); font-size: 0.85rem;">Last: ${new Date(workoutSessions[workoutSessions.length - 1].startTime).toLocaleDateString()}</p>` : ''}
      </div>
    </section>
  `;
}

// ===== EQUIPMENT =====
function renderEquipment() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <div class="equipment-grid">
        ${EQUIPMENT.map(eq => `
          <div class="equipment-card">
            ${eq.imageURL ? `<img src="${eq.imageURL}" alt="${eq.name}" onerror="this.style.display='none'">` : ''}
            <div class="info">
              <div class="category">${eq.category}</div>
              <h4>${eq.name}</h4>
              <p class="exercises">${eq.exercises.slice(0, 2).join(', ')}${eq.exercises.length > 2 ? '...' : ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ===== UTILS =====
function formatPRKey(key) {
  return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function showToast(msg, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
