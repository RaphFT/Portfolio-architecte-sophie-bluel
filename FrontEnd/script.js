// Attendre que la page soit entièrement chargée avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    console.log("Le DOM est complètement chargé.");
    
    // Appel de la fonction pour récupérer les projets
    fetchWorks();
});

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
        const works = await response.json();

        // Afficher les projets récupérés dans la console
        console.log("Projets récupérés avec succès :", works);

        // Mettre à jour la galerie avec les projets récupérés
        updateGallery(works);
        
    } catch (error) {
        // En cas d'erreur, afficher un message dans la console
        console.error("Erreur lors de la récupération des projets :", error);
    }
}

function updateGallery(works) {
    // 1. Sélectionner l'élément HTML qui va contenir la galerie
    const gallery = document.querySelector(".gallery"); // On cherche l'élément avec la classe .gallery

     // 2. Supprimer les anciens éléments de la galerie
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild); // Supprimer les éléments un par un
    }

    // 3. Parcourir la liste des projets
    works.forEach(work => {
        // Pour chaque projet dans le tableau "projects", on crée un nouvel élément

        // 4. Créer un élément "figure" pour contenir chaque projet
        const figure = document.createElement("figure"); // On crée une balise <figure>

        // 5. Création de l'élément image
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        // 6.Création de l'élément figcaption
        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        // 7. Ajouter l'élément "figure" créé à l'élément .gallery
        gallery.appendChild(figure); // On insère la figure dans la galerie
        figure.appendChild(img);
        figure.appendChild(caption);
    });

    console.log("Galerie mise à jour avec succès !");

}
