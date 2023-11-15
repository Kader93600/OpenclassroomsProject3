/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/*Gère la connexion, envoie les données du login, et redirige vers les projets ou affiche une erreur. */

document.getElementById("form-login").addEventListener("submit", function (event) {
    event.preventDefault();

    /*Récupère les valeurs @ et de MDP des champs de formulaire et on stocke dans un objet (data) */

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
        email: email,
        password: password
    };
 
    /*Envoie les données de connexion à l'API, gère la réponse pour l'authentification ou affiche des messages d'erreur. */
    
    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Nom d'utilisateur ou mot de passe incorrects. Veuillez réessayer.");
        }
    })
    .then(login => {
        if (login.token) {
            localStorage.setItem("token", login.token); 
            
            window.location.href = "/FrontEnd/index.html";
        } else {
            document.getElementById("erreur-message").innerText = "Problème de récupération du token.";
        }
    })

    .catch(error => {
        console.error(error);
        document.getElementById("erreur-message").innerText = error.message;
    });
});

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/*Affichage de l'interface du logué après le chargement du DOM. */

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    const loginItem = document.getElementById("login");
    const logoutItem = document.getElementById("logout");
    const logoutLink = document.querySelector("a");
    const filtreItem = document.getElementById("filtre");
    const modalItem = document.querySelector('.js-modal');
    const editLink = document.querySelector('.edit0');

  

    if (token) {
        loginItem.style.display = 'none';
        logoutItem.style.display = 'flex';
        logoutLink.style.color = "#000";
        logoutLink.style.textDecoration="none";
        filtreItem.style.display = 'none';
        modalItem.style.display = 'flex';
        editLink.style.display = 'flex';
    } else {
        loginItem.style.display = 'flex';
        logoutItem.style.display = 'none';
        filtreItem.style.display = 'flex';
        filtreItem.style.justifyContent = 'center';
        modalItem.style.display = 'none';
        editLink.style.display = 'none';
    }
});

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/*Gère le clic  du btn déconnexion, supprime le jeton et redirige le logué vers la page d'accueil. */

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/index.html";
});
