import { projects } from './data.js'

const $projectsList = document.querySelector('.projects-list');
const $ellipse = document.querySelector('.ellipse');


const createProjectArticle = (project) => {
    const { id, title, description, src, link, type } = project;
    if (type === 'image'){
        return `
        <a target="_blanck" href="${link}">
            <article id="${id}" class="project">
                <img src="${src}" alt="${title}-${id}">
                <h3><b>${title}</b></h3>
                <div class="arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/></svg>
                </div>
                <p>${description}</p>
            </article>
        </a>
        `
    }
    if (type === 'video'){
        return `
        <a target="_blanck" href="${link}">
            <article id="${id}" class="project">
                <video src="${src}" autoplay loop muted alt="${title}-${id}"></video>
                <h3><b>${title}</b></h3>
                <div class="arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/></svg>
                </div>
                <p>${description}</p>
            </article>
        </a>
        `
    }

}

const createGroupedArticles = (projects) => {
    const projectsGrouped = [];

    for (let i = 0; i < projects.length; i++) {
        if(i % 2 !== 0){
            projectsGrouped.push([createProjectArticle(projects[i - 1]), createProjectArticle(projects[i])])
        }
    }

    return projectsGrouped;
}

const createEllipsis = (index) => {
    return `<div
        class="ellipses-point"
        id="ellipsis-${index}"
        width="24"
        height="24"
        >

    </div>`
}

let intervalId;

function insertArticle(projectsGrouped, index = 1) {
    let currentIndex = index;

    $projectsList.innerHTML = 
    `
        <li class="project-group">
            ${projectsGrouped[currentIndex][0]}
            ${projectsGrouped[currentIndex][1]}
        </li>
    `;

    document.getElementById(`ellipsis-${currentIndex}`).style.background = 'var(--color-secondary)';

    if (currentIndex < (projectsGrouped.length - 1)) {
        if (currentIndex === 0) {
            document.getElementById(`ellipsis-${projectsGrouped.length - 1}`).style.background = 'var(--color-primary)';
        } else {
            document.getElementById(`ellipsis-${currentIndex - 1}`).style.background = 'var(--color-primary)';
        }
        currentIndex++;
    } else {
        document.getElementById(`ellipsis-${currentIndex - 1}`).style.background = 'var(--color-primary)';
        currentIndex = 0;
    }

    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
        insertArticle(projectsGrouped, currentIndex);
    }, 15000);
}

const renderGroupedArticles = (projects, index = 1) => {
    const projectsGrouped = createGroupedArticles(projects);

    $ellipse.innerHTML = '';

    projectsGrouped.map( (_, index ) => {
        $ellipse.innerHTML += createEllipsis(index);
    })

    insertArticle(projectsGrouped, index);
} 

renderGroupedArticles(projects);

// EVENTS 

$ellipse.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('ellipses-point')) {
        renderGroupedArticles(projects, +e.target.id.split('-')[1]);
    }
});