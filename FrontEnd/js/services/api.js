const API_URL = 'http://localhost:5678/api';

export const apiService = {
    async getWorks() {
        try {
            const response = await fetch(`${API_URL}/works`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des works');
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    },

    async getCategories() {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }
};