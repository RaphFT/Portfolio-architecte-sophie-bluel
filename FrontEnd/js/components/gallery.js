// components/gallery.js
import { apiService } from '../services/api.js';

export class Gallery {
    constructor(container) {
        this.container = container;
        this.works = [];
        this.filters = document.querySelector('.filters');
    }

    async init() {
        try {
            // Chargement des works
            await this.loadWorks();
            // Mise en place des filtres
            await this.setupFilters();
            // Affichage initial de tous les works
            this.displayWorks(this.works);
        } catch (error) {
            console.error('Erreur d\'initialisation de la galerie:', error);
        }
    }

    async loadWorks() {
        try {
            this.works = await apiService.getWorks();
        } catch (error) {
            console.error('Erreur chargement works:', error);
            this.works = [];
        }
    }

    async setupFilters() {
        try {
            const categories = await apiService.getCategories();
            
            // Création du conteneur de filtres s'il n'existe pas
            if (!this.filters) {
                this.filters = document.createElement('div');
                this.filters.className = 'filters';
                this.container.parentNode.insertBefore(this.filters, this.container);
            }

            // Bouton "Tous"
            this.createFilterButton('Tous', null);

            // Boutons pour chaque catégorie
            categories.forEach(category => {
                this.createFilterButton(category.name, category.id);
            });
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }

    createFilterButton(name, categoryId) {
        const button = document.createElement('button');
        button.textContent = name;
        button.className = 'filter-btn';
        if (categoryId === null) button.classList.add('active');

        button.addEventListener('click', () => {
            // Mise à jour du filtre actif
            this.filters.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // Filtrage des works
            this.filterWorks(categoryId);
        });

        this.filters.appendChild(button);
    }

    filterWorks(categoryId) {
        const filteredWorks = categoryId === null 
            ? this.works 
            : this.works.filter(work => work.categoryId === categoryId);
        
        this.displayWorks(filteredWorks);
    }

    displayWorks(worksToDisplay) {
        // Vider la galerie
        this.container.textContent = '';

        // Créer et ajouter chaque work
        worksToDisplay.forEach(work => {
            const figure = this.createWorkElement(work);
            this.container.appendChild(figure);
        });
    }

    createWorkElement(work) {
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        return figure;
    }

    // Méthode pour rafraîchir la galerie (utile pour la modale plus tard)
    async refreshWorks() {
        await this.loadWorks();
        this.displayWorks(this.works);
    }
}