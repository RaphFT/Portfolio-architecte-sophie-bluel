export class ModalManager {
    constructor(worksData) {
        this.worksData = worksData;
        this.modal = document.getElementById('modal');
        this.galleryView = this.modal.querySelector('.modal-gallery-view');
        this.addView = this.modal.querySelector('.modal-add-view');
        this.closeButtons = this.modal.querySelectorAll('.close-modal');
        this.backButton = this.modal.querySelector('.back-button');
        this.addPhotoBtn = this.modal.querySelector('.add-photo-btn');
        this.photoForm = document.getElementById('add-photo-form');
        
        this.initializeEventListeners();
        this.loadCategories();
        this.initializePhotoUpload();
    }

    initializeEventListeners() {
        // Gestion de l'ouverture/fermeture
        document.querySelector('.edit-button').addEventListener('click', () => this.openModal());
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal());
        });
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Navigation
        this.addPhotoBtn.addEventListener('click', () => this.showAddView());
        this.backButton.addEventListener('click', () => this.showGalleryView());

        // Gestion du formulaire
        this.initializeFormHandlers();
    }

    initializePhotoUpload() {
        const photoInput = document.getElementById('photo');
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        const validateButton = document.querySelector('.validate-button');

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            // Vérification du type de fichier
            if (!file.type.match('image/(jpeg|png)')) {
                alert('Le fichier doit être une image (JPG ou PNG)');
                return;
            }

            // Vérification de la taille (4mo max)
            if (file.size > 4 * 1024 * 1024) {
                alert('L\'image ne doit pas dépasser 4Mo');
                return;
            }

            // Lecture et prévisualisation du fichier
            const reader = new FileReader();
            
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                this.validateForm();
            };

            reader.onerror = () => {
                alert('Erreur lors de la lecture du fichier');
                previewImage.style.display = 'none';
                uploadPlaceholder.style.display = 'flex';
            };

            reader.readAsDataURL(file);
        });
    }

    openModal() {
        this.modal.style.display = 'flex';
        this.showGalleryView();
        this.updateGallery();
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.resetPhotoForm();
    }

    showGalleryView() {
        this.galleryView.style.display = 'block';
        this.addView.style.display = 'none';
        this.updateGallery();
    }

    showAddView() {
        this.galleryView.style.display = 'none';
        this.addView.style.display = 'block';
    }

    updateGallery() {
        const modalGallery = this.modal.querySelector('.modal-gallery');
        modalGallery.innerHTML = '';

        this.worksData.forEach(work => {
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
                    const success = await this.deleteWork(work.id);
                    if (success) {
                        figure.remove();
                        const index = this.worksData.findIndex(w => w.id === work.id);
                        if (index > -1) {
                            this.worksData.splice(index, 1);
                        }
                        // Mettre à jour la galerie principale
                        const mainGallery = document.querySelector('.gallery');
                        if (mainGallery) {
                            const mainFigure = mainGallery.querySelector(`figure img[src="${work.imageUrl}"]`).parentNode;
                            mainFigure.remove();
                        }
                        // Déclencher l'événement de mise à jour
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
    }

    async deleteWork(workId) {
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

    async loadCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            const categories = await response.json();
            const select = document.getElementById('category');
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }

    initializeFormHandlers() {
        const photoInput = document.getElementById('photo');
        const titleInput = document.getElementById('title');
        const categoryInput = document.getElementById('category');
        const submitButton = this.photoForm.querySelector('.validate-button');
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');

        // Prévisualisation de l'image
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    uploadPlaceholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
                this.validateForm();
            }
        });

        // Validation du formulaire
        [titleInput, categoryInput].forEach(input => {
            input.addEventListener('input', () => this.validateForm());
        });

        // Soumission du formulaire
        this.photoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitForm();
        });
    }

    validateForm() {
        const form = this.photoForm;
        const title = form.querySelector('#title').value;
        const category = form.querySelector('#category').value;
        const photo = form.querySelector('#photo').files[0];
        const submitButton = form.querySelector('.validate-button');

        // Vérifier si tous les champs requis sont remplis
        const isValid = title && category && photo;
        submitButton.disabled = !isValid;
        submitButton.style.backgroundColor = isValid ? '#1D6154' : '#A7A7A7';
    }

    async submitForm() {
        const formData = new FormData(this.photoForm);
        
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la photo');
            }

            const newWork = await response.json();
            this.worksData.push(newWork);
            this.showGalleryView();
            this.resetPhotoForm();
            // Mettre à jour la galerie principale
            document.dispatchEvent(new CustomEvent('workUpdated'));
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'ajout de la photo');
        }
    }

    resetPhotoForm() {
        this.photoForm.reset();
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        const validateButton = this.photoForm.querySelector('.validate-button');

        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        validateButton.disabled = true;
        validateButton.style.backgroundColor = '#A7A7A7';
    }
}