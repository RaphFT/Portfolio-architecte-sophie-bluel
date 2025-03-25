document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#login-form');
    const errorMessage = document.querySelector('#error-message');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    window.sessionStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                } else {
                    errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
                }

            } catch (error) {
                console.error('Erreur:', error);
                errorMessage.textContent = "Une erreur est survenue";
            }
        });
    }
});