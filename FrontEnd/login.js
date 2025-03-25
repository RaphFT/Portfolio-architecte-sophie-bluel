    document.addEventListener("DOMContentLoaded", function () {
        const form = document.querySelector("form");
        const errorMessage = document.createElement("p");
        errorMessage.style.color = "red";
        form.appendChild(errorMessage);

        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Empêche le rechargement de la page

            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    sessionStorage.setItem("token", data.token); // Stockage du token
                    console.log("Connexion réussie ! Token stocké :", data.token);
                    window.location.href = "index.html"; // Redirection vers la page d’accueil
                } else {
                    errorMessage.textContent = "Identifiants incorrects, veuillez réessayer.";
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                errorMessage.textContent = "Une erreur est survenue, veuillez réessayer plus tard.";
            }
        });
    });

 