const skills = {
    'super-learning': {
        experience: 0,
        level: 1,
        retention: 0,
        speed: 0
    },
    'kolbs': {
        experience: 0,
        level: 1,
        improvement: 0,
        reflection: 0
    }
};

const maxLevel = 100;
const maxExperience = 10000;
let interval;

function toggleSkillDetails(skill) {
    const skillDetails = document.getElementById(`${skill}-details`);
    skillDetails.classList.toggle('hidden');
}

function addExperience(skill, hours) {
    skills[skill].experience += hours;
    if (skills[skill].experience < 0) skills[skill].experience = 0;
    saveProgress();
    updateLevel(skill);
    updateProgressBar(`${skill}-bar`, skills[skill].experience - getLevelExperience(skills[skill].level - 1), getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1));
    document.getElementById(`${skill}-experience`).innerText = skills[skill].experience.toFixed(1);
}

function removeExperience(skill, hours) {
    skills[skill].experience -= hours;
    if (skills[skill].experience < 0) skills[skill].experience = 0;
    saveProgress();
    updateLevel(skill);
    updateProgressBar(`${skill}-bar`, skills[skill].experience - getLevelExperience(skills[skill].level - 1), getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1));
    document.getElementById(`${skill}-experience`).innerText = skills[skill].experience.toFixed(1);
}

function startAddingPoints(skill, hours) {
    addExperience(skill, hours);
    interval = setInterval(() => addExperience(skill, hours), 100);
}

function startRemovingPoints(skill, hours) {
    removeExperience(skill, hours);
    interval = setInterval(() => removeExperience(skill, hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

function updateLevel(skill) {
    let newLevel = 1;
    while (skills[skill].experience >= getLevelExperience(newLevel) && newLevel < maxLevel) {
        newLevel++;
    }
    skills[skill].level = newLevel;
    document.getElementById(`${skill}-level`).innerText = skills[skill].level;

    if (skill === 'super-learning') {
        updateEffectProgress('super-learning-retention-bar', skills[skill].level, skills[skill].retention);
        updateEffectProgress('super-learning-speed-bar', skills[skill].level, skills[skill].speed);
    } else if (skill === 'kolbs') {
        updateEffectProgress('kolbs-improvement-bar', skills[skill].level, skills[skill].improvement);
        updateEffectProgress('kolbs-reflection-bar', skills[skill].level, skills[skill].reflection);
    }
}

function getLevelExperience(level) {
    return Math.pow(level / maxLevel, 2) * maxExperience;
}

function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = Math.min((value / maxValue) * 100, 100);
    progressBar.style.width = `${percentage}%`;
}

function updateEffectProgress(id, level, effectLevel) {
    const effectStage = getEffectStage(level);
    const progressBar = document.getElementById(id);
    const stages = { beginner: 33, intermediate: 66, advanced: 100 };
    progressBar.style.width = `${stages[effectStage]}%`;
}

function getEffectStage(level) {
    if (level < 34) return 'beginner';
    if (level < 67) return 'intermediate';
    return 'advanced';
}

function saveProgress() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

function loadProgress() {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) {
        Object.assign(skills, JSON.parse(savedSkills));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    Object.keys(skills).forEach(skill => {
        updateLevel(skill);
        updateProgressBar(`${skill}-bar`, skills[skill].experience - getLevelExperience(skills[skill].level - 1), getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1));
        document.getElementById(`${skill}-experience`).innerText = skills[skill].experience.toFixed(1);
    });
});
