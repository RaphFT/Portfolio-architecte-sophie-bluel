import { apiService } from './services/api.js';
import { ModalManager } from './components/modal.js';


// Variable globale pour stocker les works
let worksData = [];

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
        worksData = await apiService.getWorks();
        console.log("Works récupérés:", worksData);
        
        // Affichage des éléments d'édition si connecté
        if (isConnected) {
            const editBanner = document.querySelector('.edit-banner');
            const editButton = document.querySelector('.edit-button');
            if (editBanner) editBanner.style.display = 'flex';
            if (editButton) editButton.style.display = 'flex';
            
            // Initialiser la modale avec les works
            const modalManager = new ModalManager(worksData);
        
            // Écouter les mises à jour des works
            document.addEventListener('workUpdated', () => {
                displayWorks(modalManager.worksData);
            });
        }
        
        // 2. Création des filtres seulement si non connecté
        if (!isConnected) {
            createFilters();
        } else {
            const menuContainer = document.querySelector(".category-menu");
            if (menuContainer) {
                menuContainer.style.display = "none";
            }
        }
        
        // 3. Affichage initial de tous les works
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
                // Déconnexion
                window.sessionStorage.removeItem('token');
                window.location.reload();
            });
        } else {
            authLink.textContent = 'login';
            authLink.href = 'login.html';
        }
    }
}

/**
 * Création des boutons de filtres
 */
function createFilters() {
    // Utilisation de category-menu au lieu de filters
    const menuContainer = document.querySelector(".category-menu");
    if (!menuContainer) return;

    // Vider le conteneur de filtres
    menuContainer.textContent = "";

    // Extraction des catégories uniques avec Set
    const categories = [...new Set(worksData.map(work => work.category.name))];
    console.log("Catégories trouvées:", categories);

    // Création du bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("active"); // Bouton "Tous" actif par défaut
    allButton.addEventListener("click", (event) => {
        updateActiveButton(event.target);
        displayWorks(worksData);
    });
    menuContainer.appendChild(allButton);

    // Création des boutons de catégories
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.addEventListener("click", (event) => {
            updateActiveButton(event.target);
            filterWorksByCategory(category);
        });
        menuContainer.appendChild(button);
    });
}

/**
 * Mise à jour du bouton actif
 */
function updateActiveButton(clickedButton) {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll(".category-menu button").forEach(button => {
        button.classList.remove("active");
    });
    // Ajouter la classe active au bouton cliqué
    clickedButton.classList.add("active");
}

/**
 * Filtrage des works par catégorie
 */
function filterWorksByCategory(category) {
    const filteredWorks = worksData.filter(work => work.category.name === category);
    console.log(`Works filtrés pour ${category}:`, filteredWorks);
    displayWorks(filteredWorks);
}

/**
 * Affichage des works dans la galerie
 */
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    // Vider la galerie
    gallery.textContent = "";

    // Créer et ajouter chaque work
    works.forEach(work => {
        const figure = document.createElement("figure");
        
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Lancement de l'application au chargement de la page
document.addEventListener("DOMContentLoaded", init);