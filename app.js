let currentTab = 'home';
let currentWorkout = null;
let workoutSessions = JSON.parse(localStorage.getItem('workoutSessions')) || [];
let personalRecords = JSON.parse(localStorage.getItem('personalRecords')) || {};

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderHome();
  checkTodayWorkout();
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
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

function renderHome() {
  const content = document.getElementById('app-content');
  const today = new Date().toLocaleDateString('da-DK', { weekday: 'long' });
  const todayWorkout = WEEKLY_SCHEDULE.find(s => s.day === today)?.workout || 'Rest';

  content.innerHTML = `
    <section class="section active">
      <div class="card">
        <h3>📅 Today's Workout</h3>
        <p style="font-size: 1.2rem; font-weight: 600; color: var(--brand-primary);">${todayWorkout}</p>
        ${todayWorkout !== 'Rest' ? `<button class="btn" onclick="startWorkout('${todayWorkout}')">Start ${todayWorkout}</button>` : '<p style="color: #666; margin-top: 0.5rem;">Enjoy your rest day! 🧘</p>'}
      </div>
      <div class="card">
        <h3>🏆 Recent PRs</h3>
        ${Object.keys(personalRecords).length > 0 ? `<div style="max-height: 200px; overflow-y: auto;">${Object.entries(personalRecords).slice(0, 5).map(([key, value]) => `<div class="exercise-item"><span>${formatPRKey(key)}</span><span class="pr-badge">${value.weight} kg × ${value.reps}</span></div>`).join('')}</div>` : '<p style="color: #666;">No PRs yet. Start training! 💪</p>'}
      </div>
      <div class="card">
        <h3>📊 Weekly Summary</h3>
        <p>Workouts completed: <strong>${workoutSessions.length}</strong></p>
        <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(workoutSessions.length * 14, 100)}%"></div></div>
        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">Goal: 5-6 workouts/week</p>
      </div>
    </section>
  `;
}

function checkTodayWorkout() {
  const today = new Date().toLocaleDateString('da-DK', { weekday: 'long' });
  const todayWorkout = WEEKLY_SCHEDULE.find(s => s.day === today)?.workout;
  if (todayWorkout && todayWorkout !== 'Rest') {
    showToast(`Today: ${todayWorkout} Day! 💪`);
  }
}

function renderWorkoutSelector() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <h2 style="margin-bottom: 1rem;">Select Workout</h2>
      <div class="card" onclick="startWorkout('Push')" style="cursor: pointer;"><h3>🔥 Push Day</h3><p>Chest, Shoulders, Triceps</p><p style="color: #666; font-size: 0.9rem;">5 exercises</p></div>
      <div class="card" onclick="startWorkout('Pull')" style="cursor: pointer;"><h3>🎯 Pull Day</h3><p>Back, Biceps</p><p style="color: #666; font-size: 0.9rem;">4 exercises</p></div>
      <div class="card" onclick="startWorkout('Legs')" style="cursor: pointer;"><h3>🦵 Legs Day</h3><p>Quads, Hamstrings, Glutes, Calves</p><p style="color: #666; font-size: 0.9rem;">6 exercises</p></div>
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2>${type} Workout</h2>
        <button class="btn btn-secondary" style="width: auto;" onclick="renderTab('workout')">✕ Cancel</button>
      </div>
      ${exercises.map((ex, index) => `
        <div class="card" id="exercise-${ex.id}">
          <h3>${index + 1}. ${ex.name}</h3>
          <p style="color: #666; font-size: 0.9rem;">${ex.muscle} • ${ex.sets} sets × ${ex.reps} reps</p>
          <p style="color: #666; font-size: 0.85rem;">Rest: ${ex.rest}s</p>
          ${Array.from({ length: ex.sets }).map((_, setIndex) => `
            <div class="input-group" style="margin-top: 0.75rem;">
              <label>Set ${setIndex + 1}</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" placeholder="kg" id="${ex.id}-set${setIndex}-weight" style="flex: 1;">
                <input type="number" placeholder="reps" id="${ex.id}-set${setIndex}-reps" style="flex: 1;">
              </div>
            </div>
          `).join('')}
          <button class="btn" onclick="completeExercise('${ex.id}', '${ex.prKey}')">Complete Exercise</button>
        </div>
      `).join('')}
      <button class="btn" onclick="finishWorkout()">Finish Workout</button>
    </section>
  `;
}

function completeExercise(exerciseId, prKey) {
  const exercise = Object.values(EXERCISE_TEMPLATES).flat().find(e => e.id === exerciseId);
  const sets = [];
  for (let i = 0; i < exercise.sets; i++) {
    const weight = document.getElementById(`${exerciseId}-set${i}-weight`).value;
    const reps = document.getElementById(`${exerciseId}-set${i}-reps`).value;
    if (weight && reps) {
      sets.push({ weight: parseFloat(weight), reps: parseInt(reps) });
    }
  }
  if (sets.length === 0) { showToast('Please log at least one set! ⚠️'); return; }
  const maxWeight = Math.max(...sets.map(s => s.weight));
  const maxReps = sets.find(s => s.weight === maxWeight)?.reps;
  if (!personalRecords[prKey] || maxWeight > personalRecords[prKey].weight) {
    personalRecords[prKey] = { weight: maxWeight, reps: maxReps, date: new Date().toISOString() };
    localStorage.setItem('personalRecords', JSON.stringify(personalRecords));
    showToast(`🎉 New PR! ${maxWeight} kg × ${maxReps}`);
  }
  currentWorkout.exercises.push({ exerciseId, sets, completedAt: new Date() });
  document.getElementById(`exercise-${exerciseId}`).style.opacity = '0.5';
  showToast('Exercise completed! ✅');
}

function finishWorkout() {
  if (currentWorkout.exercises.length === 0) { showToast('Complete at least one exercise! ⚠️'); return; }
  currentWorkout.endTime = new Date();
  currentWorkout.completed = true;
  workoutSessions.push(currentWorkout);
  localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  showToast('Workout saved! 🎉');
  renderTab('home');
}

function renderProgress() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <h2 style="margin-bottom: 1rem;">📈 Your Progress</h2>
      <div class="card">
        <h3>Personal Records</h3>
        ${Object.keys(personalRecords).length > 0 ? Object.entries(personalRecords).map(([key, value]) => `<div class="exercise-item"><span>${formatPRKey(key)}</span><span class="pr-badge">${value.weight} kg × ${value.reps}</span></div>`).join('') : '<p style="color: #666;">No PRs yet. Start training! 💪</p>'}
      </div>
      <div class="card">
        <h3>Workout History</h3>
        <p>Total workouts: <strong>${workoutSessions.length}</strong></p>
        ${workoutSessions.length > 0 ? `<p style="color: #666; font-size: 0.9rem;">Last workout: ${new Date(workoutSessions[workoutSessions.length - 1].startTime).toLocaleDateString('da-DK')}</p>` : ''}
      </div>
      <div class="card">
        <h3>🏆 Achievements</h3>
        <div class="exercise-item"><span>First Workout</span><span class="pr-badge" style="background: ${workoutSessions.length > 0 ? 'var(--brand-success)' : '#ccc'}">${workoutSessions.length > 0 ? '✓' : '🔒'}</span></div>
        <div class="exercise-item"><span>First PR</span><span class="pr-badge" style="background: ${Object.keys(personalRecords).length > 0 ? 'var(--brand-success)' : '#ccc'}">${Object.keys(personalRecords).length > 0 ? '✓' : '🔒'}</span></div>
        <div class="exercise-item"><span>10 Workouts</span><span class="pr-badge" style="background: ${workoutSessions.length >= 10 ? 'var(--brand-success)' : '#ccc'}">${workoutSessions.length >= 10 ? '✓' : '🔒'}</span></div>
      </div>
    </section>
  `;
}

function renderEquipment() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <section class="section active">
      <h2 style="margin-bottom: 1rem;">🛠️ Gym Equipment</h2>
      <div class="equipment-grid">
        ${EQUIPMENT.map(eq => `
          <div class="equipment-card">
            ${eq.imageURL ? `<img src="${eq.imageURL}" alt="${eq.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">` : `<div style="height: 120px; background: #ddd; display: flex; align-items: center; justify-content: center; color: #999;">${eq.type === 'free-weight' ? '🏋️' : '🏢'}</div>`}
            <div class="info">
              <h4>${eq.name}</h4>
              <p style="font-size: 0.8rem; color: #666;">${eq.category}</p>
              <p style="font-size: 0.75rem; color: var(--brand-primary); margin-top: 0.25rem;">${eq.exercises.slice(0, 2).join(', ')}${eq.exercises.length > 2 ? '...' : ''}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function formatPRKey(key) {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
