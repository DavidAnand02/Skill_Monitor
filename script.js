const maxLevel = 100;
const maxExperience = 10000;
const skillData = {};

function addSkill() {
    const skillName = document.getElementById('new-skill-name').value.trim();
    if (skillName === '' || skillData[skillName]) return; // Avoid adding empty or duplicate skills

    const skillList = document.getElementById('skill-list');
    const skillTemplate = document.getElementById('skill-template').content.cloneNode(true);

    const skillCard = skillTemplate.querySelector('.skill-card');
    const skillDetails = skillTemplate.querySelector('.skill-details');
    const experienceSpan = skillTemplate.querySelector('.experience');
    const levelSpan = skillTemplate.querySelector('.level');
    const experienceBar = skillTemplate.querySelector('.experience-bar');
    const retentionBar = skillTemplate.querySelector('.retention-bar');
    const speedBar = skillTemplate.querySelector('.speed-bar');
    
    skillCard.querySelector('.skill-name').innerText = skillName;
    skillCard.dataset.skillName = skillName; // Store skill name in the data attribute

    skillCard.onclick = () => toggleSkillDetails(skillDetails);
    
    skillDetails.querySelector('.hour-button').onclick = (e) => handleButtonClick(e, 1, skillName, 'add');
    skillDetails.querySelector('.minute-button').onclick = (e) => handleButtonClick(e, 0.5, skillName, 'add');
    skillDetails.querySelector('.remove-hour-button').onclick = (e) => handleButtonClick(e, 1, skillName, 'remove');
    skillDetails.querySelector('.remove-minute-button').onclick = (e) => handleButtonClick(e, 0.5, skillName, 'remove');
    
    skillList.appendChild(skillTemplate);

    // Initialize skill data
    initializeSkillData(skillName);
}

function initializeSkillData(skillName) {
    let experience = getSkillData(skillName, 'experience') || 0;
    let level = getSkillData(skillName, 'level') || 1;

    const skillDetails = document.querySelector(`.skill-card[data-skill-name="${skillName}"] .skill-details`);
    skillDetails.querySelector('.experience').innerText = experience;
    skillDetails.querySelector('.level').innerText = level;
    updateProgressBar(skillDetails.querySelector('.experience-bar'), experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    updateEffectProgress(skillDetails.querySelector('.retention-bar'), level, getSkillData(skillName, 'retention'));
    updateEffectProgress(skillDetails.querySelector('.speed-bar'), level, getSkillData(skillName, 'speed'));
}

function toggleSkillDetails(skillDetails) {
    skillDetails.classList.toggle('hidden');
}

function handleButtonClick(event, hours, skillName, action) {
    event.stopPropagation();
    const skillDetails = event.target.closest('.skill-details');
    
    if (action === 'add') {
        addExperience(skillName, hours);
    } else {
        removeExperience(skillName, hours);
    }
    updateSkillDetails(skillDetails, skillName);
}

function addExperience(skillName, hours) {
    let experience = getSkillData(skillName, 'experience') || 0;
    experience += hours;
    setSkillData(skillName, 'experience', experience);
    updateLevel(skillName);
}

function removeExperience(skillName, hours) {
    let experience = getSkillData(skillName, 'experience') || 0;
    experience -= hours;
    if (experience < 0) experience = 0;
    setSkillData(skillName, 'experience', experience);
    updateLevel(skillName);
}

function updateLevel(skillName) {
    let experience = getSkillData(skillName, 'experience') || 0;
    let level = 1;
    while (experience >= getLevelExperience(level) && level < maxLevel) {
        level++;
    }
    setSkillData(skillName, 'level', level);

    const skillDetails = document.querySelector(`.skill-card[data-skill-name="${skillName}"] .skill-details`);
    skillDetails.querySelector('.level').innerText = level;
    updateProgressBar(skillDetails.querySelector('.experience-bar'), experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    updateEffectProgress(skillDetails.querySelector('.retention-bar'), level, getSkillData(skillName, 'retention'));
    updateEffectProgress(skillDetails.querySelector('.speed-bar'), level, getSkillData(skillName, 'speed'));
}

function getLevelExperience(level) {
    return Math.pow(level / maxLevel, 2) * maxExperience;
}

function updateProgressBar(progressBar, value, maxValue) {
    const percentage = (value / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
}

function updateEffectProgress(progressBar, level, effectLevel) {
    const effectStage = getEffectStage(level);
    const stages = { beginner: 33, intermediate: 66, advanced: 100 };
    progressBar.style.width = `${stages[effectStage]}%`;
}

function getEffectStage(level) {
    if (level < 34) return 'beginner';
    if (level < 67) return 'intermediate';
    return 'advanced';
}

function setSkillData(skillName, key, value) {
    if (!skillData[skillName]) {
        skillData[skillName] = {};
    }
    skillData[skillName][key] = value;
    saveProgress();
}

function getSkillData(skillName, key) {
    return (skillData[skillName] || {})[key];
}

function saveProgress() {
    localStorage.setItem('skillData', JSON.stringify(skillData));
}

function loadProgress() {
    const savedSkillData = localStorage.getItem('skillData');
    if (savedSkillData) {
        Object.assign(skillData, JSON.parse(savedSkillData));
        // Reinitialize skills on page load
        for (const skillName in skillData) {
            initializeSkillData(skillName);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
});
