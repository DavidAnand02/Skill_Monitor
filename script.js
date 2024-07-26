// Global skill data
const skills = {
    'super-learning': { experience: 0, level: 1, effects: { retention: 0, speed: 0 } },
    'meditation': { experience: 0, level: 1, effects: { mindfulness: 0, stress: 0 } },
    'kolbs': { experience: 0, level: 1, effects: { thinking: 0, analytical: 0 } },
    'push-ups': { reps: 0, level: 1 },
    'kot-split-squat': { reps: 0, level: 1 }
};

let interval;

// Toggle visibility of skill categories
function toggleCategory(category) {
    const categoryDiv = document.getElementById(`${category}-skills`);
    categoryDiv.classList.toggle('hidden');
}

// Toggle visibility of skill details
function toggleSkillDetails(skill) {
    const skillDetails = document.getElementById('skill-details-template');
    const skillCard = document.getElementById(skill);
    if (skillCard) {
        skillCard.classList.toggle('hidden');
        if (!skillCard.classList.contains('hidden')) {
            skillDetails.querySelector('#skill-level').innerText = skills[skill].level;
            updateProgressBar(skill);
            updateEffectProgress(skill);
            skillDetails.classList.remove('hidden');
        } else {
            skillDetails.classList.add('hidden');
        }
    }
}

// Add experience or reps
function addPoints(skill, amount) {
    if (skill === 'push-ups' || skill === 'kot-split-squat') {
        skills[skill].reps += amount;
    } else {
        skills[skill].experience += amount;
    }
    saveProgress();
    updateLevel(skill);
    updateProgressBar(skill);
    updateEffectProgress(skill);
}

// Remove experience or reps
function removePoints(skill, amount) {
    if (skill === 'push-ups' || skill === 'kot-split-squat') {
        skills[skill].reps -= amount;
        if (skills[skill].reps < 0) skills[skill].reps = 0;
    } else {
        skills[skill].experience -= amount;
        if (skills[skill].experience < 0) skills[skill].experience = 0;
    }
    saveProgress();
    updateLevel(skill);
    updateProgressBar(skill);
    updateEffectProgress(skill);
}

// Start adding or removing points continuously
function startAddingPoints(skill, amount) {
    addPoints(skill, amount);
    interval = setInterval(() => addPoints(skill, amount), 100);
}

function startRemovingPoints(skill, amount) {
    removePoints(skill, amount);
    interval = setInterval(() => removePoints(skill, amount), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

// Update skill level based on experience or reps
function updateLevel(skill) {
    if (skill === 'push-ups' || skill === 'kot-s
