let skills = {
    mental: ['Super Learning', 'Meditation', 'KOLBS'],
    physical: ['Push ups', 'KOT Split Squats']
};

let currentSkill = '';
let experience = 0;
let level = 1;
const maxLevel = 100;
const maxExperience = 10000;
let interval;

function showSkillList(type) {
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
    document.getElementById('skill-details').classList.add('hidden');
    document.getElementById('skill-management').classList.add('hidden');
    document.getElementById(`${type}-skills`).classList.remove('hidden');
}

function showSkillDetails(skill) {
    currentSkill = skill;
    experience = loadProgress(skill).experience || 0;
    level = loadProgress(skill).level || 1;
    document.getElementById('skill-details').classList.remove('hidden');
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
    document.getElementById('skill-name').innerText = skill;
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}

function goBack() {
    document.getElementById('skill-details').classList.add('hidden');
    document.getElementById('skill-management').classList.add('hidden');
    showSkillList(currentSkill.includes(' ') ? 'physical' : 'mental');
}

function startAddingPoints(hours) {
    addExperience(hours);
    interval = setInterval(() => addExperience(hours), 100);
}

function startRemovingPoints(hours) {
    removeExperience(hours);
    interval = setInterval(() => removeExperience(hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

function addExperience(hours) {
    experience += hours;
    saveProgress(currentSkill);
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}

function removeExperience(hours) {
    experience -= hours;
    if (experience < 0) experience = 0;
    saveProgress(currentSkill);
    updateLevel();
    updateProgressBar('experience-bar', experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById('experience').innerText = experience;
}

function updateLevel() {
    let newLevel = 1;
    while (experience >= getLevelExperience(newLevel) && newLevel < maxLevel) {
        newLevel++;
    }
    level = newLevel;
    document.getElementById('level').innerText = level;
}

function getLevelExperience(level) {
    return Math.pow(level / maxLevel, 2) * maxExperience;
}

function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function saveProgress(skill) {
    localStorage.setItem(`${skill}-experience`, experience);
    localStorage.setItem(`${skill}-level`, level);
}

function loadProgress(skill) {
    const savedExperience = localStorage.getItem(`${skill}-experience`);
    const savedLevel = localStorage.getItem(`${skill}-level`);
    
    return {
        experience: savedExperience !== null ? parseFloat(savedExperience) : 0,
        level: savedLevel !== null ? parseInt(savedLevel) : 1
    };
}

function showSkillManagement(type) {
    const skillList = document.getElementById('skill-list');
    skillList.innerHTML = '';
    skills[type].forEach(skill => {
        const li = document.createElement('li');
        li.innerText = skill;
        li.onclick = () => {
            const newName = prompt('Enter new skill name:', skill);
            if (newName) {
                renameSkill(type, skill, newName);
                showSkillManagement(type);
            }
        };
        skillList.appendChild(li);
    });
    document.getElementById('management-title').innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} Skills Management`;
    document.getElementById('skill-management').classList.remove('hidden');
    document.getElementById('mental-skills').classList.add('hidden');
    document.getElementById('physical-skills').classList.add('hidden');
}

function renameSkill(type, oldName, newName) {
    const index = skills[type].indexOf(oldName);
    if (index > -1) {
        skills[type][index] = newName;
        localStorage.setItem(`${newName}-experience`, localStorage.getItem(`${oldName}-experience`));
        localStorage.setItem(`${newName}-level`, localStorage.getItem(`${oldName}-level`));
        localStorage.removeItem(`${oldName}-experience`);
        localStorage.removeItem(`${oldName}-level`);
    }
}

function addSkill() {
    const newSkillName = document.getElementById('new-skill-name').value;
    if (newSkillName) {
        const type = document.getElementById('management-title').innerText.toLowerCase().includes('mental') ? 'mental' : 'physical';
        skills[type].push(newSkillName);
        showSkillManagement(type);
        document.getElementById('new-skill-name').value = '';
    }
}

