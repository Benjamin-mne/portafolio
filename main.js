import { projects } from './data.js'

document.addEventListener('DOMContentLoaded', () => { 
    const $projectsList = document.querySelector('.projects-list');
    const $ellipse = document.querySelector('.ellipse');

    const createProjectArticle = (project) => {
        const { id, title, description, src, link, type } = project;
        let content = '';
        
        if (type === 'image') {
            content = `
            <a target="_blank" href="${link}">
                <article id="${id}" class="project">
                    <img src="${src}" alt="${title}-${id}">
                    <h3><b>${title}</b></h3>
                    <div class="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/></svg>
                    </div>
                    <p>${description}</p>
                </article>
            </a>
            `;
        } else if (type === 'video') {
            content = `
            <a target="_blank" href="${link}">
                <article id="${id}" class="project">
                    <video src="${src}" autoplay loop muted alt="${title}-${id}"></video>
                    <h3><b>${title}</b></h3>
                    <div class="arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/></svg>
                    </div>
                    <p>${description}</p>
                </article>
            </a>
            `;
        }

        return content;
    }

    const createGroupedArticles = (projects) => {
        const projectsGrouped = [];
        for (let i = 0; i < projects.length; i += 2) {
            const group = [];
            if (projects[i]) group.push(createProjectArticle(projects[i]));
            if (projects[i + 1]) group.push(createProjectArticle(projects[i + 1]));
            projectsGrouped.push(group);
        }
        return projectsGrouped;
    }

    const createEllipsis = (index) => {
        return `<div class="ellipses-point" id="ellipsis-${index}" width="24" height="24"></div>`;
    }

    let intervalId;

    function insertArticle(projectsGrouped, currentIndex) {
        const group = projectsGrouped[currentIndex];
        $projectsList.innerHTML = `
            <li class="project-group">
                ${group[0]}
                ${group[1] || ''}
            </li>
        `;
        document.getElementById(`ellipsis-${currentIndex}`).style.background = 'var(--color-secondary)';
        const prevIndex = currentIndex === 0 ? projectsGrouped.length - 1 : currentIndex - 1;
        document.getElementById(`ellipsis-${prevIndex}`).style.background = 'var(--color-primary)';
    }

    function startCarousel(projectsGrouped, startIndex = 1) {
        let currentIndex = startIndex;
        if (intervalId) {
            clearInterval(intervalId); 
        }
        intervalId = setInterval(() => {
            insertArticle(projectsGrouped, currentIndex);
            currentIndex = (currentIndex + 1) % projectsGrouped.length;
        }, 14000); 
    }

    const renderGroupedArticles = (projects) => {
        const projectsGrouped = createGroupedArticles(projects);
        
        const ellipsesFragment = document.createDocumentFragment();
        projectsGrouped.forEach((_, index) => {
            ellipsesFragment.appendChild(document.createRange().createContextualFragment(createEllipsis(index)));
        });
        $ellipse.innerHTML = ''; 
        $ellipse.appendChild(ellipsesFragment);

        insertArticle(projectsGrouped, 1); 
        startCarousel(projectsGrouped, 2);
    };

    renderGroupedArticles(projects);

    // Eventos

    $ellipse.addEventListener('click', (e) => {
        if (e.target.classList.contains('ellipses-point')) {
            const index = +e.target.id.split('-')[1];
            insertArticle(createGroupedArticles(projects), index);
            clearInterval(intervalId);  
            startCarousel(createGroupedArticles(projects), index); 
        }
    });
});
