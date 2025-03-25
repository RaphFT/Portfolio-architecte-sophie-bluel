document.addEventListener("DOMContentLoaded", function () {
    console.log("Le DOM est complètement chargé.");
    
    // Vérifier si l'utilisateur est connecté
    checkLoginStatus();

    // Appel de la fonction pour récupérer les projets
    fetchWorks();
});

/**
 * Fonction qui vérifie si l'utilisateur est connecté et met à jour le bouton de la navbar
 */
function checkLoginStatus() {
    const token = sessionStorage.getItem("token"); // Récupère le token
    const loginElement = document.querySelector("#login"); // Sélectionne l'élément de la navbar

    if (token) {
        console.log("Utilisateur connecté ! Token trouvé :", token);
        loginElement.textContent = "logout"; // Change le texte
        loginElement.href = "#"; // Désactive le lien vers login.html

        // Ajoute l'événement pour déconnecter l'utilisateur
        loginElement.addEventListener("click", function () {
            sessionStorage.removeItem("token"); // Supprime le token
            window.location.reload(); // Recharge la page pour appliquer les changements
        });

        // Si l'utilisateur est connecté, on ajoute la bannière et le bouton "Modifier"
        addEditBanner();
        addEditButton();
    } else {
        console.log("Utilisateur non connecté.");
        loginElement.textContent = "login"; // Rétablit le texte
        loginElement.href = "login.html"; // Redirige vers la page de connexion
    }
}

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

/**
 * Fonction pour ajouter le bandeau "Mode édition"
 */
function addEditBanner() {
    const banner = document.createElement("div");
    banner.id = "edit-banner";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "black";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "10px";
    banner.style.fontSize = "16px";
    banner.style.zIndex = "1000";

    // Crée l'élément <i> pour l'icône Font Awesome
    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    // Crée un élément texte pour le message
    const text = document.createElement("span");
    text.textContent = " Mode édition";

    // Ajoute l'icône et le texte à la bannière
    banner.appendChild(icon);
    banner.appendChild(text);

    document.body.prepend(banner);
}

/**
 * Fonction pour ajouter le bouton "Modifier" à droite du H2 "Mes Projets"
 */
function addEditButton() {
    const h2 = document.querySelector("#portfolio h2"); // Sélectionne le H2 "Mes Projets"
    if (!h2) return; // Vérifie que l'élément existe

    // Crée le bouton "Modifier"
    const editButton = document.createElement("span");
    editButton.id = "edit-button";

    // Crée l'élément <i> pour l'icône Font Awesome
    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    // Crée un élément texte pour "Modifier"
    const text = document.createElement("span");
    text.textContent = " Modifier";

    // Ajoute l'icône et le texte au bouton
    editButton.appendChild(icon);
    editButton.appendChild(text);

    // Ajoute le style directement en JS
    editButton.style.marginLeft = "30px";
    editButton.style.cursor = "pointer";
    editButton.style.color = "black";
    editButton.style.fontSize = "14px";
    editButton.style.fontWeight = "bold";
    editButton.style.fontFamily = "Work Sans"

    // Ajouter un événement de clic (plus tard, il ouvrira la modale)
    editButton.addEventListener("click", function () {
        console.log("Ouverture de la modale d'édition...");
    });

    // Ajoute le bouton à l'intérieur du H2, à la fin du texte
    h2.appendChild(editButton);
}

// Ajout de la modale dans le DOM
function createModal() {
    let modal = document.querySelector("#modal");
    
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal";
        modal.style.position = "fixed";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.style.width = "630px";
        modalContent.style.height = "688px";
        modalContent.style.backgroundColor = "white";
        modalContent.style.borderRadius = "10px";
        modalContent.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
        modalContent.style.padding = "20px";
        modalContent.style.display = "flex";
        modalContent.style.flexDirection = "column";
        modalContent.style.alignItems = "center";
        modalContent.style.position = "relative";

        const closeButton = document.createElement("span");
        closeButton.className = "close";
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "20px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "24px";
        closeButton.addEventListener("click", closeModal);
        
        const title = document.createElement("h2");
        title.id = "modal-title";
        title.textContent = "Galerie photo";

        const gallery = document.createElement("div");
        gallery.id = "modal-gallery";
        gallery.className = "modal-gallery";

        const addPhotoView = document.createElement("div");
        addPhotoView.id = "modal-add-photo";
        addPhotoView.className = "modal-add-photo";
        addPhotoView.style.display = "none";

        const addPhotoTitle = document.createElement("h2");
        addPhotoTitle.textContent = "Ajout photo";

        const form = document.createElement("form");
        form.id = "photo-form";
        
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "photo-input";
        fileInput.accept = "image/*";
        
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = "photo-title";
        textInput.placeholder = "Titre de la photo";
        
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Valider";
        
        form.appendChild(fileInput);
        form.appendChild(textInput);
        form.appendChild(submitButton);
        addPhotoView.appendChild(addPhotoTitle);
        addPhotoView.appendChild(form);

        const toggleButton = document.createElement("button");
        toggleButton.id = "toggle-modal-view";
        toggleButton.textContent = "Ajouter une photo";
        toggleButton.addEventListener("click", toggleModalView);
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(gallery);
        modalContent.appendChild(addPhotoView);
        modalContent.appendChild(toggleButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Fermer la modale au clic sur l'overlay
        modal.addEventListener("click", function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    return modal;
}

// Fonction pour ouvrir la modale
function openModal() {
    console.log("Ouverture de la modale d'édition...");
    const modal = createModal();
    modal.style.display = "flex";
}

// Fonction pour fermer la modale
function closeModal() {
    const modal = document.querySelector("#modal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Fonction pour basculer entre les vues de la modale
function toggleModalView() {
    const galleryView = document.querySelector("#modal-gallery");
    const addPhotoView = document.querySelector("#modal-add-photo");
    const title = document.querySelector("#modal-title");
    const toggleButton = document.querySelector("#toggle-modal-view");
    
    if (galleryView.style.display === "none") {
        galleryView.style.display = "block";
        addPhotoView.style.display = "none";
        title.textContent = "Galerie photo";
        toggleButton.textContent = "Ajouter une photo";
    } else {
        galleryView.style.display = "none";
        addPhotoView.style.display = "block";
        title.textContent = "Ajout photo";
        toggleButton.textContent = "Retour à la galerie";
    }
}

// Ajout de l'événement au bouton Modifier
function setupEditButton() {
    const editButton = document.querySelector("#edit-button");
    if (editButton) {
        editButton.addEventListener("click", openModal);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setupEditButton();
});