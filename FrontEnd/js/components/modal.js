// Initialisation des éléments DOM et des gestionnaires d'événements
export const initializeModal = async (worksData) => {
    const modal = document.getElementById('modal');
    const galleryView = modal.querySelector('.modal-gallery-view');
    const addView = modal.querySelector('.modal-add-view');
    const closeButtons = modal.querySelectorAll('.close-modal');
    const backButton = modal.querySelector('.back-button');
    const addPhotoBtn = modal.querySelector('.add-photo-btn');
    const photoForm = document.getElementById('add-photo-form');

    // Initialisation des écouteurs d'événements
    document.querySelector('.edit-button').addEventListener('click', () => {
        openModal({ modal, galleryView, addView, worksData });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal({ modal, photoForm });
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal({ modal, photoForm });
        }
    });

    addPhotoBtn.addEventListener('click', () => {
        showAddView({ galleryView, addView });
    });

    backButton.addEventListener('click', () => {
        showGalleryView({ modal, galleryView, addView, worksData });
    });

    // Initialisation des autres fonctionnalités
    await loadCategoriesIntoForm();
    initializePhotoUpload({ photoForm, worksData });
    initializeFormHandlers({ photoForm, modal, galleryView, addView, worksData });
};

// Nouvelle fonction pour charger les catégories dans le formulaire
export const loadCategoriesIntoForm = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        const select = document.getElementById('category');
        
        if (!select) return;
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
    }
};

// Gestion du modal
export const openModal = ({ modal, galleryView, addView, worksData }) => {
    modal.style.display = 'flex';
    showGalleryView({ modal, galleryView, addView, worksData });
};

export const closeModal = ({ modal, photoForm }) => {
    modal.style.display = 'none';
    resetPhotoForm({ photoForm });
};

export const showGalleryView = ({ modal, galleryView, addView, worksData }) => {
    galleryView.style.display = 'block';
    addView.style.display = 'none';
    updateGallery({ modal, worksData });
};

export const showAddView = ({ galleryView, addView }) => {
    galleryView.style.display = 'none';
    addView.style.display = 'block';
};

// Gestion de la galerie
export const updateGallery = ({ modal, worksData }) => {
    const modalGallery = modal.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';

    worksData.forEach(work => {
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-icon';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
                const success = await deleteWork(work.id);
                if (success) {
                    figure.remove();
                    const index = worksData.findIndex(w => w.id === work.id);
                    if (index > -1) {
                        worksData.splice(index, 1);
                    }
                    const mainGallery = document.querySelector('.gallery');
                    if (mainGallery) {
                        const mainFigure = mainGallery.querySelector(`figure img[src="${work.imageUrl}"]`)?.parentNode;
                        if (mainFigure) {
                            mainFigure.remove();
                        }
                    }
                    document.dispatchEvent(new CustomEvent('workUpdated'));
                } else {
                    alert('Erreur lors de la suppression');
                }
            }
        });
        
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
};

// Gestion du formulaire
export const initializePhotoUpload = ({ photoForm, worksData }) => {
    const photoInput = document.getElementById('photo');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');

    photoInput.addEventListener('change', (e) => {
        handlePhotoUpload({ e, previewImage, uploadPlaceholder, photoForm });
    });
};

export const handlePhotoUpload = ({ e, previewImage, uploadPlaceholder, photoForm }) => {
    const file = e.target.files[0];
    
    if (!validatePhotoFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        validateForm({ photoForm });
    };

    reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    };

    reader.readAsDataURL(file);
};

// Autres fonctions utilitaires
export const validatePhotoFile = (file) => {
    if (!file.type.match('image/(jpeg|png)')) {
        alert('Le fichier doit être une image (JPG ou PNG)');
        return false;
    }

    if (file.size > 4 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 4Mo');
        return false;
    }

    return true;
};

export const validateForm = ({ photoForm }) => {
    const title = photoForm.querySelector('#title').value;
    const category = photoForm.querySelector('#category').value;
    const photo = photoForm.querySelector('#photo').files[0];
    const submitButton = photoForm.querySelector('.validate-button');

    const isValid = title && category && photo;
    submitButton.disabled = !isValid;
    submitButton.style.backgroundColor = isValid ? '#1D6154' : '#A7A7A7';
};

export const submitForm = async ({ photoForm, worksData, modal, galleryView, addView }) => {
    const formData = new FormData(photoForm);
    
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Erreur lors de l\'ajout de la photo');

        const newWork = await response.json();
        worksData.push(newWork);
        showGalleryView({ modal, galleryView, addView, worksData });
        resetPhotoForm({ photoForm });
        document.dispatchEvent(new CustomEvent('workUpdated'));
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'ajout de la photo');
    }
};

export const resetPhotoForm = ({ photoForm }) => {
    photoForm.reset();
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const validateButton = photoForm.querySelector('.validate-button');

    previewImage.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    validateButton.disabled = true;
    validateButton.style.backgroundColor = '#A7A7A7';
};

export const initializeFormHandlers = ({ photoForm, modal, galleryView, addView, worksData }) => {
    const photoInput = document.getElementById('photo');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');

    // Gestion de la prévisualisation de l'image
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handlePhotoUpload({ 
                e, 
                previewImage: document.getElementById('preview-image'),
                uploadPlaceholder: document.querySelector('.upload-placeholder'),
                photoForm 
            });
        }
    });

    // Validation du formulaire lorsque les champs sont modifiés
    [titleInput, categoryInput].forEach(input => {
        input.addEventListener('input', () => validateForm({ photoForm }));
    });

    // Soumission du formulaire d'ajout de photo
    photoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitForm({ photoForm, worksData, modal, galleryView, addView });
    });
};

// Ajouter cette fonction d'export pour la suppression des works
export const deleteWork = async (workId) => {
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
};