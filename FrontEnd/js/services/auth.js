const API_URL = 'http://localhost:5678/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) throw new Error('Identifiants incorrects');

            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            return true;
        } catch (error) {
            console.error('Erreur login:', error);
            throw error;
        }
    },

    isAuthenticated() {
        return sessionStorage.getItem('token') !== null;
    },

    logout() {
        sessionStorage.removeItem('token');
    }
};