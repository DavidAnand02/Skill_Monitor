const maxLevel = 100;
const maxExperience = 10000;

function addSkill() {
    const skillName = document.getElementById('new-skill-name').value.trim();
    if (skillName === '') return;

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

    const skillDetails = document.querySelector(`[data-skill-name="${skillName}"] .skill-details`);
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
   
