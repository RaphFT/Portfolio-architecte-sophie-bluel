export function initModal(worksData) {
    const editButton = document.querySelector('.edit-button');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-modal');

    // Ouvrir la modale
    editButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        displayModalGallery(worksData);
    });

    // Fermer la modale
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer la modale en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function deleteWork(workId) {
    try {
        const token = window.sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        return true;
    } catch (error) {
        console.error('Erreur:', error);
        return false;
    }
}

function displayModalGallery(works) {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-icon';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
        // Ajout de l'événement de suppression
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
                const success = await deleteWork(work.id);
                if (success) {
                    // Supprimer l'élément du DOM
                    figure.remove();
                    // Mettre à jour worksData
                    const index = works.findIndex(w => w.id === work.id);
                    if (index > -1) {
                        works.splice(index, 1);
                    }
                    // Mettre à jour la galerie principale
                    const mainGallery = document.querySelector('.gallery');
                    if (mainGallery) {
                        const mainFigure = mainGallery.querySelector(`figure img[src="${work.imageUrl}"]`).parentNode;
                        mainFigure.remove();
                    }
                } else {
                    alert('Erreur lors de la suppression');
                }
            }
        });
        
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}