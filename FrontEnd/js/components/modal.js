export class ModalManager {
    // Constructeur de la classe, qui initialise les éléments DOM nécessaires
    constructor(worksData) {
        this.worksData = worksData; // Données des œuvres à afficher dans la galerie
        this.modal = document.getElementById('modal'); // Le modal qui contient la galerie et le formulaire
        this.galleryView = this.modal.querySelector('.modal-gallery-view'); // Vue de la galerie dans le modal
        this.addView = this.modal.querySelector('.modal-add-view'); // Vue pour ajouter une photo
        this.closeButtons = this.modal.querySelectorAll('.close-modal'); // Boutons pour fermer le modal
        this.backButton = this.modal.querySelector('.back-button'); // Bouton pour revenir à la galerie
        this.addPhotoBtn = this.modal.querySelector('.add-photo-btn'); // Bouton pour ajouter une photo
        this.photoForm = document.getElementById('add-photo-form'); // Formulaire pour ajouter une photo
        
        // Initialisation des écouteurs d'événements et autres fonctionnalités
        this.initializeEventListeners();
        this.loadCategories(); // Charge les catégories de photos
        this.initializePhotoUpload(); // Gère le téléchargement d'images
    }

    // Initialisation des écouteurs d'événements pour gérer l'ouverture, la fermeture, et la navigation dans le modal
    initializeEventListeners() {
        document.querySelector('.edit-button').addEventListener('click', () => this.openModal());
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal());
        });
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal(); // Ferme le modal si on clique en dehors de celui-ci
        });

        // Gestion de la navigation entre les vues
        this.addPhotoBtn.addEventListener('click', () => this.showAddView());
        this.backButton.addEventListener('click', () => this.showGalleryView());

        // Gestion du formulaire pour ajouter une photo
        this.initializeFormHandlers();
    }

    // Initialisation du téléchargement de photo et de la prévisualisation
    initializePhotoUpload() {
        const photoInput = document.getElementById('photo');
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        const validateButton = document.querySelector('.validate-button');

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            // Vérification du type de fichier et de sa taille
            if (!file.type.match('image/(jpeg|png)')) {
                alert('Le fichier doit être une image (JPG ou PNG)');
                return;
            }

            if (file.size > 4 * 1024 * 1024) {
                alert('L\'image ne doit pas dépasser 4Mo');
                return;
            }

            // Lecture et affichage de l'image en prévisualisation
            const reader = new FileReader();
            
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                this.validateForm(); // Valide le formulaire si l'image est correctement chargée
            };

            reader.onerror = () => {
                alert('Erreur lors de la lecture du fichier');
                previewImage.style.display = 'none';
                uploadPlaceholder.style.display = 'flex';
            };

            reader.readAsDataURL(file);
        });
    }

    // Ouvre le modal et affiche la galerie
    openModal() {
        this.modal.style.display = 'flex';
        this.showGalleryView();
        this.updateGallery();
    }

    // Ferme le modal
    closeModal() {
        this.modal.style.display = 'none';
        this.resetPhotoForm();
    }

    // Affiche la vue galerie et met à jour les éléments de la galerie
    showGalleryView() {
        this.galleryView.style.display = 'block';
        this.addView.style.display = 'none';
        this.updateGallery();
    }

    // Affiche la vue d'ajout de photo
    showAddView() {
        this.galleryView.style.display = 'none';
        this.addView.style.display = 'block';
    }

    // Met à jour la galerie en fonction des données disponibles
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
                        // Met à jour la galerie principale
                        const mainGallery = document.querySelector('.gallery');
                        if (mainGallery) {
                            const mainFigure = mainGallery.querySelector(`figure img[src="${work.imageUrl}"]`).parentNode;
                            mainFigure.remove();
                        }
                        // Déclenche un événement pour notifier la mise à jour
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

    // Fonction pour supprimer une œuvre via une requête API
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

    // Charge les catégories d'images depuis une API et met à jour le sélecteur de catégorie
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

    // Initialisation des gestionnaires d'événements pour le formulaire d'ajout d'image
    initializeFormHandlers() {
        const photoInput = document.getElementById('photo');
        const titleInput = document.getElementById('title');
        const categoryInput = document.getElementById('category');
        const submitButton = this.photoForm.querySelector('.validate-button');
        const previewImage = document.getElementById('preview-image');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');

        // Gestion de la prévisualisation de l'image
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

        // Validation du formulaire lorsque les champs sont modifiés
        [titleInput, categoryInput].forEach(input => {
            input.addEventListener('input', () => this.validateForm());
        });

        // Soumission du formulaire d'ajout de photo
        this.photoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitForm();
        });
    }

    // Valide le formulaire en s'assurant que tous les champs sont remplis avant l'envoi
    validateForm() {
        const form = this.photoForm;
        const title = form.querySelector('#title').value;
        const category = form.querySelector('#category').value;
        const photo = form.querySelector('#photo').files[0];
        const submitButton = form.querySelector('.validate-button');

        const isValid = title && category && photo; // Vérification de la validité des champs
        submitButton.disabled = !isValid; // Active ou désactive le bouton de validation
        submitButton.style.backgroundColor = isValid ? '#1D6154' : '#A7A7A7'; // Changement de couleur
    }

    // Envoie les données du formulaire pour ajouter une nouvelle photo via une requête API
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
            this.resetPhotoForm(); // Réinitialisation du formulaire
            // Met à jour la galerie principale
            document.dispatchEvent(new CustomEvent('workUpdated'));
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'ajout de la photo');
        }
    }

    // Réinitialisation du formulaire d'ajout de photo
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
