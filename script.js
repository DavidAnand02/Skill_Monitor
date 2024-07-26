const skills = {}; // Object to store skills and their points

function addSkill() {
    const skillName = prompt("Enter skill name:");
    if (skillName && !skills[skillName]) {
        skills[skillName] = { points: 0, element: createSkillElement(skillName) };
        document.getElementById('skill-list').appendChild(skills[skillName].element);
    } else if (skills[skillName]) {
        alert("Skill already exists.");
    }
}

function createSkillElement(skillName) {
    const container = document.createElement('div');
    container.className = 'skill-item';

    const name = document.createElement('span');
    name.innerText = skillName;
    container.appendChild(name);

    const addButton = document.createElement('button');
    addButton.innerText = '+1h';
    addButton.onclick = () => addPoints(skillName, 1);
    container.appendChild(addButton);

    const addHalfButton = document.createElement('button');
    addHalfButton.innerText = '+0.5h';
    addHalfButton.onclick = () => addPoints(skillName, 0.5);
    container.appendChild(addHalfButton);

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.onclick = () => removeSkill(skillName);
    container.appendChild(removeButton);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    container.appendChild(progressBar);

    const progressFill = document.createElement('span');
    progressBar.appendChild(progressFill);

    return container;
}

function addPoints(skillName, hours) {
    if (skills[skillName]) {
        skills[skillName].points += hours;
        updateProgressBar(skillName);
    }
}

function removeSkill(skillName) {
    const skillElement = skills[skillName].element;
    if (skillElement) {
        skillElement.remove();
        delete skills[skillName];
    }
}

function updateProgressBar(skillName) {
    const skill = skills[skillName];
    if (skill) {
        const totalPointsRequired = calculateTotalPoints(skill.points);
        const percentage = Math.min((skill.points / totalPointsRequired) * 100, 100);
        skill.element.querySelector('.progress-bar span').style.width = percentage + '%';
    }
}

function calculateTotalPoints(points) {
    // Exponential leveling system
    return 10000 * Math.pow(1.1, Math.floor(points / 100));
}

function updateLevels() {
    Object.keys(skills).forEach(skillName => updateProgressBar(skillName));
}
