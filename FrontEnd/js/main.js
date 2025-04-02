import { apiService } from './services/api.js';
import { initializeModal } from './components/modal.js';
import { displayWorks, createFilters, setupGalleryEdition } from './components/gallery.js';

/**
 * Initialisation de l'application
 */
async function init() {
    try {
        // Vérification de la connexion
        const isConnected = window.sessionStorage.getItem('token') !== null;
        
        // Mise à jour du bouton login/logout
        updateAuthButton(isConnected);

        // 1. Récupération des works
        const worksData = await apiService.getWorks();
        console.log("Works récupérés:", worksData);
        
        // Configuration de la galerie selon le mode (connecté ou non)
        setupGalleryEdition(isConnected);
        
        // Affichage des éléments d'édition si connecté
        if (isConnected) {
            const editBanner = document.querySelector('.edit-banner');
            const editButton = document.querySelector('.edit-button');
            if (editBanner) editBanner.style.display = 'flex';
            if (editButton) editButton.style.display = 'flex';
            
            // Initialiser la modale avec les works
            await initializeModal(worksData);
        
            // Écouter les mises à jour des works
            document.addEventListener('workUpdated', () => {
                apiService.getWorks().then(updatedWorks => {
                    displayWorks(updatedWorks);
                });
            });
        } else {
            // Création des filtres seulement si non connecté
            createFilters(worksData);
        }
        
        // Affichage initial de tous les works
        displayWorks(worksData);
        
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
    }
}

/**
 * Mise à jour du bouton login/logout
 */
function updateAuthButton(isConnected) {
    const authLink = document.querySelector('#auth-link');
    if (authLink) {
        if (isConnected) {
            authLink.textContent = 'logout';
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.sessionStorage.removeItem('token');
                window.location.reload();
            });
        } else {
            authLink.textContent = 'login';
            authLink.href = 'login.html';
        }
    }
}

// Lancement de l'application au chargement de la page
document.addEventListener("DOMContentLoaded", init);
