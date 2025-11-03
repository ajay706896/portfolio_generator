document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const form = document.getElementById('portfolio-form');
    const preview = document.getElementById('portfolio-preview');
    const downloadBtn = document.getElementById('download-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    let profilePhotoBase64 = '';
    const achievementsData = [];

    // --- DYNAMIC FORM LOGIC ---
    addProjectEntry();
    addExperienceEntry();
    addEducationEntry();
    addAchievementEntry();

    document.getElementById('add-skill-btn').addEventListener('click', addSkillTag);
    document.getElementById('add-project-btn').addEventListener('click', addProjectEntry);
    document.getElementById('add-experience-btn').addEventListener('click', addExperienceEntry);
    document.getElementById('add-education-btn').addEventListener('click', addEducationEntry);
    document.getElementById('add-achievement-btn').addEventListener('click', addAchievementEntry);
    document.getElementById('profile-photo').addEventListener('change', handleProfilePhotoUpload);

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const entry = e.target.closest('.form-entry');
            if (entry.dataset.index) { // For achievements with data
                achievementsData.splice(parseInt(entry.dataset.index), 1);
            }
            entry.remove();
            generatePortfolio();
        }
        if (e.target.classList.contains('remove-tag')) {
            e.target.parentElement.remove();
            generatePortfolio();
        }
    });

    document.getElementById('skill-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkillTag(); }
    });
    
    // --- IMAGE & FILE HANDLING ---
    function handleProfilePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePhotoBase64 = e.target.result;
                generatePortfolio();
            };
            reader.readAsDataURL(file);
        }
    }

    function handleAchievementPhotoUpload(event, index) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                achievementsData[index].image = e.target.result;
                generatePortfolio();
            };
            reader.readAsDataURL(file);
        }
    }
    
    // --- FACTORY FUNCTIONS FOR FORM ENTRIES ---
    function addSkillTag() {
        const skillInput = document.getElementById('skill-input');
        if (skillInput.value.trim()) {
            document.getElementById('skills-container').innerHTML += `<div class="skill-tag"><span>${skillInput.value.trim()}</span><span class="remove-tag" title="Remove">&times;</span></div>`;
            skillInput.value = '';
            generatePortfolio();
        }
    }
    function createFormEntry(containerId, innerHTML) {
        const container = document.getElementById(containerId);
        const entry = document.createElement('div');
        entry.className = 'form-entry';
        entry.innerHTML = `<button type="button" class="remove-btn" title="Remove Entry">&times;</button>${innerHTML}`;
        container.appendChild(entry);
    }
    function addProjectEntry() { createFormEntry('projects-container', `<input type="text" class="project-title" placeholder="Project Title" required><input type="text" class="project-period" placeholder="Time Period (e.g., Jan 2023 - Mar 2023)"><textarea class="project-desc" rows="3" placeholder="Description"></textarea><input type="text" class="project-tech" placeholder="Technologies Used (comma separated)"><input type="url" class="project-link" placeholder="Project Link (optional)">`); }
    function addExperienceEntry() { createFormEntry('experience-container', `<input type="text" class="exp-company" placeholder="Company / Organization" required><input type="text" class="exp-period" placeholder="Time Period (e.g., Jun 2021 - Present)"><textarea class="exp-desc" rows="3" placeholder="Description of your role and achievements"></textarea><input type="text" class="exp-skills" placeholder="Skills Gained (e.g., Teamwork, Agile)">`); }
    function addEducationEntry() { createFormEntry('education-container', `<input type="text" class="edu-institution" placeholder="Institution" required><input type="text" class="edu-degree" placeholder="Degree / Certificate"><input type="text" class="edu-period" placeholder="Time Period (e.g., 2018 - 2022)"><textarea class="edu-desc" rows="2" placeholder="Description (optional)"></textarea>`); }
    function addAchievementEntry() {
        const index = achievementsData.length;
        achievementsData.push({ image: '', caption: '' });
        const container = document.getElementById('achievements-container');
        const entry = document.createElement('div');
        entry.className = 'form-entry';
        entry.dataset.index = index;
        entry.innerHTML = `
            <button type="button" class="remove-btn" title="Remove Entry">&times;</button>
            <input type="file" class="achievement-photo" accept="image/*">
            <input type="text" class="achievement-caption" placeholder="Caption (optional)">`;
        container.appendChild(entry);
        entry.querySelector('.achievement-photo').addEventListener('change', (e) => handleAchievementPhotoUpload(e, index));
        entry.querySelector('.achievement-caption').addEventListener('input', (e) => {
            achievementsData[index].caption = e.target.value;
            generatePortfolio();
        });
    }

    // --- PORTFOLIO GENERATION ---
    const generatePortfolio = () => {
        // 1. Get data from form fields
        const data = {
            name: document.getElementById('name').value || 'Your Name',
            bio: (document.getElementById('bio').value || 'A brief bio about yourself.').replace(/\n/g, '<br>'),
            email: document.getElementById('email').value,
            linkedin: document.getElementById('linkedin').value,
            github: document.getElementById('github').value,
            template: document.getElementById('template').value,
            profilePhoto: profilePhotoBase64 || 'https://via.placeholder.com/150',
        };
        const skills = Array.from(document.querySelectorAll('.skill-tag span:first-child')).map(tag => `<li>${tag.textContent}</li>`).join('');
        const projects = Array.from(document.querySelectorAll('#projects-container .form-entry')).map(entry => ({ title: entry.querySelector('.project-title').value, period: entry.querySelector('.project-period').value, desc: entry.querySelector('.project-desc').value.replace(/\n/g, '<br>'), tech: entry.querySelector('.project-tech').value, link: entry.querySelector('.project-link').value })).filter(p => p.title).map(p => `<div class="card"><h3>${p.title}</h3><p class="meta">${p.period}</p><p>${p.desc}</p>${p.tech ? `<p class="tech-used"><b>Technologies:</b> ${p.tech}</p>` : ''}${p.link ? `<a href="${p.link}" target="_blank">View Project &rarr;</a>` : ''}</div>`).join('');
        const experience = Array.from(document.querySelectorAll('#experience-container .form-entry')).map(entry => ({ company: entry.querySelector('.exp-company').value, period: entry.querySelector('.exp-period').value, desc: entry.querySelector('.exp-desc').value.replace(/\n/g, '<br>'), skills: entry.querySelector('.exp-skills').value })).filter(e => e.company).map(e => `<div class="card"><h3>${e.company}</h3><p class="meta">${e.period}</p><p>${e.desc}</p>${e.skills ? `<p class="skills-gained"><b>Skills Gained:</b> ${e.skills}</p>` : ''}</div>`).join('');
        const education = Array.from(document.querySelectorAll('#education-container .form-entry')).map(entry => ({ institution: entry.querySelector('.edu-institution').value, degree: entry.querySelector('.edu-degree').value, period: entry.querySelector('.edu-period').value, desc: entry.querySelector('.edu-desc').value.replace(/\n/g, '<br>') })).filter(e => e.institution).map(e => `<div class="card"><h3>${e.degree}</h3><p class="meta">${e.institution} | ${e.period}</p><p>${e.desc}</p></div>`).join('');
        const achievements = achievementsData.filter(a => a.image).map((a, index) => `<div class="achievement-item" data-index="${index}"><img src="${a.image}" alt="Achievement Image"><div class="caption">${a.caption}</div></div>`).join('');

        // 2. Construct portfolio HTML
        preview.className = `template-${data.template}`;
        preview.innerHTML = `
            <div class="portfolio-body">
                <header class="portfolio-header">
                    <img src="${data.profilePhoto}" alt="Profile Photo" class="profile-photo">
                    <h1>${data.name}</h1>
                    <p class="bio">${data.bio}</p>
                </header>
                <main>
                    ${skills ? `<section id="skills" class="portfolio-section"><div class="section-header"><h2>Skills</h2></div><ul class="skills-list">${skills}</ul></section>` : ''}
                    ${projects ? `<section id="projects" class="portfolio-section"><div class="section-header"><h2>Projects</h2></div><div class="card-grid">${projects}</div></section>` : ''}
                    ${experience ? `<section id="experience" class="portfolio-section"><div class="section-header"><h2>Experience</h2></div><div class="card-grid">${experience}</div></section>` : ''}
                    ${education ? `<section id="education" class="portfolio-section"><div class="section-header"><h2>Education</h2></div><div class="card-grid">${education}</div></section>` : ''}
                    ${achievements ? `<section id="achievements" class="portfolio-section"><div class="section-header"><h2>Achievements</h2></div><div class="achievements-gallery">${achievements}</div></section>` : ''}
                    ${(data.email || data.linkedin || data.github) ? `<section id="contact" class="portfolio-section"><div class="contact-section"><div class="section-header"><h2>Contact Me</h2></div><p>Feel free to reach out!</p><div class="contact-links">${data.email ? `<a href="mailto:${data.email}">Email</a>` : ''} ${data.linkedin ? `<a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ''} ${data.github ? `<a href="${data.github}" target="_blank">GitHub</a>` : ''}</div></div></section>` : ''}
                </main>
            </div>`;
    };
    
    // --- LIGHTBOX LOGIC ---
    preview.addEventListener('click', (e) => {
        const item = e.target.closest('.achievement-item');
        if (item) {
            const index = item.dataset.index;
            lightbox.style.display = "block";
            lightboxImg.src = achievementsData[index].image;
            lightboxCaption.innerHTML = achievementsData[index].caption;
        }
    });
    closeLightbox.onclick = () => lightbox.style.display = "none";
    lightbox.onclick = (e) => { if (e.target === lightbox) { lightbox.style.display = "none"; } };

    // --- DOWNLOAD LOGIC ---
    const downloadPortfolio = async () => {
        try {
            const cssResponse = await fetch('style.css');
            const cssText = await cssResponse.text();
            const finalHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${document.getElementById('name').value || 'My'} Portfolio</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&family=Lato:wght@300;400&family=Montserrat:wght@400;700&display=swap" rel="stylesheet"><style>${cssText}.app-container, .form-container, .preview-container { display: none; } body { background: #e9eff3; padding: 2rem; display: flex; justify-content: center; align-items: flex-start; } #portfolio-preview { display: block !important; width: 100%; max-width: 1200px; margin: 0 auto; height: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }</style></head><body><div id="portfolio-preview" class="${preview.className}">${preview.innerHTML}</div></body></html>`;
            const blob = new Blob([finalHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download portfolio:', error);
            alert('Could not download the portfolio.');
        }
    };
    
    // --- INITIALIZATION ---
    form.addEventListener('input', generatePortfolio);
    downloadBtn.addEventListener('click', downloadPortfolio);
    generatePortfolio();
});