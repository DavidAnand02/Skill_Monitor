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
    saveProgress();
    updateLevel(skill);
    updateProgressBar(`${skill}-bar`, skills[skill].experience - getLevelExperience(skills[skill].level - 1), getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1));
    document.getElementById(`${skill}-experience`).innerText = skills[skill].experience;
}

function removeExperience(skill, hours) {
    skills[skill].experience -= hours;
    if (skills[skill].experience < 0) skills[skill].experience = 0;
    saveProgress();
    updateLevel(skill);
    updateProgressBar(`${skill}-bar`, skills[skill].experience - getLevelExperience(skills[skill].level - 1), getLevelExperience(skills[skill].level) - getLevelExperience(skills[skill].level - 1));
    document.getElementById(`${skill}-experience`).innerText = skills[skill].experience;
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
        updateEffectProgress('kol
