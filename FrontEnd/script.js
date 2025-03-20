document.addEventListener("DOMContentLoaded", function () {
    console.log("Le DOM est complètement chargé.");
    
    // Appel de la fonction pour récupérer les projets
    fetchWorks();
});

let worksData = []; // Nous stockons les données des projets ici

/**
 * Fonction qui récupère les projets depuis l'API
 */
async function fetchWorks() {
    try {
        console.log("Tentative de récupération des projets...");

        // Effectuer une requête HTTP GET vers l'API
        const response = await fetch("http://localhost:5678/api/works");

        // Vérifier si la requête a réussi (statut HTTP entre 200 et 299)
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        // Convertir la réponse en un objet JavaScript (format JSON)
        worksData = await response.json();

        // Afficher les projets récupérés dans la console
        console.log("Projets récupérés avec succès :", worksData);

        // Extraire les catégories uniques
        const categories = getCategories(worksData);

        // Générer le menu de catégories
        generateCategoryMenu(categories);

        // Mettre à jour la galerie avec les projets récupérés
        updateGallery(worksData);
        
    } catch (error) {
        // En cas d'erreur, afficher un message dans la console
        console.error("Erreur lors de la récupération des projets :", error);
    }
}

/**
 * Fonction pour extraire les catégories distinctes des projets
 */
function getCategories(works) {
    // Créer un Set pour extraire les catégories uniques
    const categories = works.map(work => work.category.name);
    return [...new Set(categories)]; // Set pour éviter les doublons
}

/**
 * Fonction qui génère dynamiquement le menu de catégories
 */
function generateCategoryMenu(categories) {
    const menuContainer = document.querySelector(".category-menu"); // Conteneur du menu de catégories

    // Créer un bouton "Tous" pour afficher tous les projets
    const allOption = document.createElement('button');
    allOption.textContent = "Tous";
    allOption.addEventListener('click', () => {
        updateGallery(worksData); // Affiche tous les projets
    });
    menuContainer.appendChild(allOption);

    // Créer un bouton pour chaque catégorie
    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category;
        categoryButton.addEventListener('click', () => filterByCategory(category)); // Filtre par catégorie
        menuContainer.appendChild(categoryButton);
    });
}

/**
 * Fonction pour filtrer les projets par catégorie
 */
function filterByCategory(category) {
    // Filtrer les projets en fonction de la catégorie sélectionnée
    const filteredWorks = worksData.filter(work => work.category.name === category);
    updateGallery(filteredWorks); // Mettre à jour la galerie avec les projets filtrés
}

/**
 * Fonction pour mettre à jour la galerie avec les projets (filtrés ou non)
 */
function updateGallery(works) {
    const gallery = document.querySelector(".gallery");

    // Supprimer les anciens éléments de la galerie
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

    // Ajouter les nouveaux projets à la galerie
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });

    console.log("Galerie mise à jour avec succès !");
}