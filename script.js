const maxLevel = 100;
const maxExperience = 10000;

function addSkill() {
    const skillName = document.getElementById('new-skill-name').value.trim();
    if (skillName === '') return;

    if (document.querySelector(`[data-skill-name="${skillName}"]`)) {
        alert('Skill already exists!');
        return;
    }

    const skillList = document.getElementById('skill-list');
    const skillTemplate = document.createElement('div');
    skillTemplate.classList.add('skill-card');
    skillTemplate.setAttribute('data-skill-name', skillName);

    skillTemplate.innerHTML = `
        <h2><i class="fas fa-brain"></i> ${skillName}</h2>
        <div class="skill-details hidden">
            <p>Experience: <span class="experience">0</span> points</p>
            <p>Level: <span class="level">1</span></p>
            <div class="progress-bar-container">
                <div class="progress-bar experience-bar"></div>
            </div>
            <p>Effects:</p>
            <div class="effect">
                <p>Better Retention</p>
                <div class="progress-bar-container">
                    <div class="progress-bar retention-bar"></div>
                </div>
            </div>
            <div class="effect">
                <p>Speed Learning</p>
                <div class="progress-bar-container">
                    <div class="progress-bar speed-bar"></div>
                </div>
            </div>
            <button class="hour-button" onmousedown="startAddingPoints('${skillName}', 1)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 1 Hour</button>
            <button class="minute-button" onmousedown="startAddingPoints('${skillName}', 0.5)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 30 Minutes</button>
            <button class="remove-hour-button" onmousedown="startRemovingPoints('${skillName}', 1)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 1 Hour</button>
            <button class="remove-minute-button" onmousedown="startRemovingPoints('${skillName}', 0.5)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 30 Minutes</button>
        </div>
    `;

    skillTemplate.querySelector('.skill-card').onclick = () => toggleSkillDetails(skillTemplate.querySelector('.skill-details'), skillName);
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

function toggleSkillDetails(skillDetails, skillName) {
    skillDetails.classList.toggle('hidden');
    // Update skill details if they are shown
    if (!skillDetails.classList.contains('hidden')) {
        initializeSkillData(skillName);
    }
}

function startAddingPoints(skillName, hours) {
    addExperience(skillName, hours);
    interval = setInterval(() => addExperience(skillName, hours), 100);
}

function startRemovingPoints(skillName, hours) {
    removeExperience(skillName, hours);
    interval = setInterval(() => removeExperience(skillName, hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
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

    const skillDetails = document.querySelector(`[data-skill-name="${skillName}"] .skill-details`);
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
    const stages = { beginner: 33, intermediate:
