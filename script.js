let skills = {};

function toggleSkillDetails(skillId) {
    const skillDetails = document.getElementById(`details-${skillId}`);
    skillDetails.classList.toggle('hidden');
}

function addExperience(skillId, hours) {
    if (skills[skillId]) {
        skills[skillId].experience += hours;
        saveSkills();
        updateSkill(skillId);
    }
}

function removeExperience(skillId, hours) {
    if (skills[skillId]) {
        skills[skillId].experience -= hours;
        if (skills[skillId].experience < 0) skills[skillId].experience = 0;
        saveSkills();
        updateSkill(skillId);
    }
}

function startAddingPoints(skillId, hours) {
    addExperience(skillId, hours);
    interval = setInterval(() => addExperience(skillId, hours), 100);
}

function startRemovingPoints(skillId, hours) {
    removeExperience(skillId, hours);
    interval = setInterval(() => removeExperience(skillId, hours), 100);
}

function stopAddingPoints() {
    clearInterval(interval);
}

function stopRemovingPoints() {
    clearInterval(interval);
}

function updateSkill(skillId) {
    const skill = skills[skillId];
    const level = calculateLevel(skill.experience);
    skill.level = level;
    document.getElementById(`level-${skillId}`).innerText = level;
    updateProgressBar(`experience-bar-${skillId}`, skill.experience - getLevelExperience(level - 1), getLevelExperience(level) - getLevelExperience(level - 1));
    document.getElementById(`experience-${skillId}`).innerText = skill.experience;
    updateEffectProgress(`retention-bar-${skillId}`, level, skill.effects.retention);
    updateEffectProgress(`speed-bar-${skillId}`, level, skill.effects.speed);
}

function calculateLevel(experience) {
    let newLevel = 1;
    while (experience >= getLevelExperience(newLevel) && newLevel < 100) {
        newLevel++;
    }
    return newLevel;
}

function getLevelExperience(level) {
    return Math.pow(level / 100, 2) * 10000;
}

function updateProgressBar(id, value, maxValue) {
    const progressBar = document.getElementById(id);
    const percentage = (value / maxValue) * 100;
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

function saveSkills() {
    localStorage.setItem('skills', JSON.stringify(skills));
}

function loadSkills() {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
        Object.keys(skills).forEach(skillId => updateSkill(skillId));
    }
}

function addNewSkill() {
    const skillName = document.getElementById('new-skill-name').value.trim();
    if (skillName) {
        const skillId = `skill-${Date.now()}`;
        skills[skillId] = {
            name: skillName,
            experience: 0,
            level: 1,
            effects: { retention: 0, speed: 0 }
        };
        saveSkills();
        renderSkills();
        document.getElementById('new-skill-name').value = '';
    }
}

function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    Object.keys(skills).forEach(skillId => {
        const skill = skills[skillId];
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <h2><i class="fas fa-brain"></i> ${skill.name}</h2>
            <div id="details-${skillId}" class="hidden" onclick="event.stopPropagation()">
                <p>Experience: <span id="experience-${skillId}">${skill.experience}</span> points</p>
                <p>Level: <span id="level-${skillId}">${skill.level}</span></p>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="experience-bar-${skillId}"></div>
                </div>
                <p>Effects:</p>
                <div class="effect">
                    <p>Better Retention</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="retention-bar-${skillId}"></div>
                    </div>
                </div>
                <div class="effect">
                    <p>Speed Learning</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="speed-bar-${skillId}"></div>
                    </div>
                </div>
                <button onmousedown="startAddingPoints('${skillId}', 1)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 1 Hour</button>
                <button onmousedown="startAddingPoints('${skillId}', 0.5)" onmouseup="stopAddingPoints()" onmouseleave="stopAddingPoints()">Add 30 Minutes</button>
                <button onmousedown="startRemovingPoints('${skillId}', 1)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 1 Hour</button>
                <button onmousedown="startRemovingPoints('${skillId}', 0.5)" onmouseup="stopRemovingPoints()" onmouseleave="stopRemovingPoints()">Remove 30 Minutes</button>
            </div>
        `;
        skillCard.onclick = () => toggleSkillDetails(skillId);
        skillsContainer.append
