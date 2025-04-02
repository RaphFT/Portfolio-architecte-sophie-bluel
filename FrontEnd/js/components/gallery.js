/**
 * Affichage des works dans la galerie
 */
export const displayWorks = (works) => {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    gallery.textContent = "";
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
};

/**
 * Création des boutons de filtres
 */
export const createFilters = (worksData) => {
    const menuContainer = document.querySelector(".category-menu");
    if (!menuContainer) return;

    menuContainer.textContent = "";
    const categories = [...new Set(worksData.map(work => work.category.name))];
    console.log("Catégories trouvées:", categories);

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("active");
    allButton.addEventListener("click", (event) => {
        updateActiveButton(event.target);
        displayWorks(worksData);
    });
    menuContainer.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category;
        button.addEventListener("click", (event) => {
            updateActiveButton(event.target);
            filterWorksByCategory(category, worksData);
        });
        menuContainer.appendChild(button);
    });
};

/**
 * Mise à jour du bouton actif
 */
const updateActiveButton = (clickedButton) => {
    document.querySelectorAll(".category-menu button").forEach(button => {
        button.classList.remove("active");
    });
    clickedButton.classList.add("active");
};

/**
 * Filtrage des works par catégorie
 */
const filterWorksByCategory = (category, worksData) => {
    const filteredWorks = worksData.filter(work => work.category.name === category);
    console.log(`Works filtrés pour ${category}:`, filteredWorks);
    displayWorks(filteredWorks);
};

/**
 * Gestion de l'affichage de la galerie en mode édition
 */
export const setupGalleryEdition = (isConnected) => {
    const menuContainer = document.querySelector(".category-menu");
    if (menuContainer) {
        menuContainer.style.display = isConnected ? "none" : "flex";
    }
};
