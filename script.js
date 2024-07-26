// Global skill data
const skills = {
    'super-learning': { experience: 0, level: 1, effects: { retention: 0, speed: 0 } },
    'meditation': { experience: 0, level: 1, effects: { mindfulness: 0, stress: 0 } },
    'kolbs': { experience: 0, level: 1, effects: { thinking: 0, analytical: 0 } },
    'push-ups': { reps: 0, level: 1 },
    'kot-split-squat': { reps: 0, level: 1 }
};

let interval;

// Toggle visibility of skill details
function toggleSkillDetails(skill) {
    const skillDetails = document.getElementById(skill);
    skillDetails.classList.toggle('hidden');
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
    if (skill === 'push-ups' || skill === 'kot-split-squat') {
        // Levels for physical skills can be based on reps
        let newLevel = Math.floor(skills[skill].reps / 100) + 1;
        skills[skill].level = Math.min(newLevel, 100);
    } else {
        // Exponential level up for mental skills
        let newLevel = 1;
        while (skills[skill].experience >= getLevelExperience(newLevel) && newLevel < 100) {
            newLevel++;
        }
        skills[skill].level = newLevel;
    }
    document.getElementById(`${skill}-level`).innerText = skills[skill].level;
}

// Get experience needed for the current level
function getLevelExperience(level) {
    return Math.pow(level / 100, 2) * 10000;
}

// Update progress bars based on current level
function updateProgressBar(skill) {
    let value, maxValue;
    if (skill === 'push-ups' || skill === 'kot-split-squat') {
        value = skills[skill].reps % 100;
        maxValue = 100;
        document.getElementById(`${skill}-reps`).innerText = skills[skill].reps;
    } else {
        value = skills[skill].experience - getLevelExperience(skills[skill].level - 1);
        maxValue = getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1);
        document.getElementById(`${skill}-experience`).innerText = skills[skill].experience;
    }
    const progressBar = document.getElementById(`${skill}-${skill === 'push-ups' || skill === 'kot-split-squat' ? 'reps-bar' : 'experience-bar'}`);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Update effect progress bars
function updateEffectProgress(skill) {
    if (skill !== 'push-ups' && skill !== 'kot-split-squat') {
        const effects = skills[skill].effects;
        for (const effect in effects) {
            const effectStage = getEffectStage(skills[skill].level);
            const progressBar = document.getElementById(`${skill}-${effect}-bar`);
            const stages = { beginner: 33, intermediate: 66, advanced: 100 };
            progressBar.style.width = `${stages[effectStage]}%`;
        }
    }
}

// Get effect stage based on level
function getEffectStage(level) {
    if (level < 34) return 'beginner';
    if (level < 67) return 'intermediate';
    return 'advanced';
}

// Save progress to local storage
function saveProgress() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

// Load progress from local storage
function loadProgress() {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills !== null) {
        Object.assign(skills, JSON.parse(savedSkills));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    for (const skill in skills) {
        updateLevel(skill);
        updateProgressBar(skill);
        updateEffectProgress(skill);
    }
});
