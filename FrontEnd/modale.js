/* Preparation du terrain modale gérer les focus avant l'ouverture de la modale  */

let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables =[]
let previouslyFocusedElement = null

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Pour afficher la galerie et cacher la section d'ajout de photo en modifiant leur style d'affichage*/

const resetModalDisplay = function () {

    const galleryModalContainer = document.getElementById('gallery-modal-container');
    const addPictureModal = document.getElementById('add-picture-modal');
    

    galleryModalContainer.style.display = 'block';
    addPictureModal.style.display = 'none';
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/*  Ouverture de la modale */

const openModal =  function (e) {

    modal = document.querySelector(e.target.getAttribute('href'));

    resetModalDisplay();
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = null;
    focusables[0].focus();
    
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal','true') 
    
    modal.addEventListener('click', closeModal)

    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

}


/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Fermeture de la modale */

const closeModal = function () {
    if(modal === null) return;

    resetModalDisplay();

    window.setTimeout(function(){
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal = null;
    }, 10);

    // Suppression des écouteurs d'événements
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Arreter la propagation  d'un evenement */

const stopPropagation = function (e){
    e.stopPropagation()
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Gère la nav avec le clavier a l'interieur de la modale (TAB ou SHIFT + TAB) */

const focusInModal = function (e){
    e.preventDefault()

    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    
    if (e.shiftKey === true){
        index--
    } else{
        index++
    }
    if (index>= focusables.length){
        index=0
    }
    if (index<0){
        index= focusables.length -1
    }
    
    focusables[index].focus()
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Selectionne la classe 'js-modal' pour executer la fonction d'ouverture de la modale au clique  */

document.querySelectorAll('.js-modal').forEach(a =>{
    a.addEventListener('click',openModal)
})

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Gestion des touches échape (fermer rapidement la modale) et TAB (naviguer entre les éléments) */

window.addEventListener("keydown", function (e){
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

/* Initialise et gère les modales pour la navigation et la fermeture, avec les ARIA. */

document.addEventListener('DOMContentLoaded', () => {
    // Modal parent
    const modal = document.getElementById('modal1');
    
    // Première et deuxième modale dans le modal parent
    const modal1 = document.getElementById('gallery-modal-container');
    const modal2 = document.getElementById('add-picture-modal');
    
    // Boutons
    const addButton = document.getElementById('modal-add-picture'); // bouton pour ajouter une photo
    const backButton = document.getElementById('back-to-gallery'); // bouton pour retourner à la première modale
    const closeButton = document.getElementById('close-modal'); // bouton pour fermer la modale globale

    // Événement de clic sur le bouton Ajouter une photo
    addButton.addEventListener('click', () => {
        modal1.style.display = 'none';
        modal2.style.display = 'block';
        modal2.removeAttribute('aria-hidden');
        modal2.setAttribute('aria-modal', 'true');
    });

    // Événement de clic sur le bouton Retour
    backButton.addEventListener('click', () => {
        modal2.style.display = 'none';
        modal1.style.display = 'block';
        modal1.removeAttribute('aria-hidden');
        modal1.setAttribute('aria-modal', 'true');
    });

    // Événement de clic sur le bouton Fermer
    closeButton.addEventListener('click', () => {
        modal2.style.display = 'none';
        modal.style.display = 'none'; // Cela cache le modal parent
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
    });
});


/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

document.addEventListener('DOMContentLoaded', () => {
    
    /*Sélectionner la div pour afficher le contenu du modal*/
    const galleryModal = document.querySelector(".modal-content");
    
/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 
    
    /* Affiche les éléments depuis l'API dans la galerie modale, avec gestion erreur. */
    
    function displayItemsModal() {
        fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            galleryModal.innerHTML = ''; // Vide la div gallery avant de rajouter des éléments
            data.forEach(itemModal => {
                displayItemModal(itemModal); // Affiche chaque élément récupéré de l'API
            });
        })
        .catch(error => console.error('Error:', error)); 
    }
    
/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /* Crée et affiche un élément de la galerie modale avec Img, btns (supp déplacement) et description. */
    
    function displayItemModal(itemModal) {
        
        
        const figure = document.createElement('div'); // Utilisez 'div' et ajoutez la classe 'figure-modal'
            figure.classList.add('figure-modal'); 
        
        const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
        
        const img = document.createElement("img");
            img.src = itemModal.imageUrl;
            img.alt = itemModal.title;
            img.classList.add('gallery-image');
            img.setAttribute('data-id', itemModal.id);
        
        const deleteButton = document.createElement('button');
            deleteButton.classList.add('button-delete');
            deleteButton.setAttribute('data-id', itemModal.id); 
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', pictureDelete);

        const moveButton = document.createElement('button');
            moveButton.className = 'button-move';
		
        const moveIcon = document.createElement('i');
            moveIcon.className = 'fa-solid fa-arrows-up-down-left-right';
            moveButton.appendChild(moveIcon);
        
        const figcaption = document.createElement("figcaption"); // Création de l'élément figcaption
            figcaption.innerText = "éditer"; 
        
		figure.appendChild(moveButton);
        figure.appendChild(deleteButton);
		figure.appendChild(img);
		figure.appendChild(figcaption); 

        galleryModal.appendChild(figure);
        
    }
    
    // Appeler displayItemsModal pour initialiser l'affichage des éléments
    displayItemsModal();
       
/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /* Supp Img, avec l'API et la MAJ de l'interface utilisateur. */

    function pictureDelete(event) {
        
        const figureElement = event.target.closest('.figure-modal');
        
        if (!figureElement) {
            console.error("Élément figure-modal non trouvé");
            return;
        }
    
        const id = figureElement.querySelector('.gallery-image').dataset.id;
        const token = localStorage.getItem("token");
        
        fetch(`http://localhost:5678/api/works/${id}`, { 
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                console.log("Suppression réussie", data);
            } catch (error) {
                console.log("Suppression réussie, aucune donnée retournée");
            }
            figureElement.remove(); // Supprime l'élément de l'UI
        })
        .catch(error => {
            console.error("Erreur lors de la suppression", error);
        });
    }


    const form = document.getElementById('form-modal2');
    const imgInput = document.getElementById('image');
    const titreInput = document.getElementById('titre');
    const categoryInput = document.getElementById('categorie');
    const buttonValider = document.getElementById('valider');

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /* Active/désactive btn de "valider" s'il y a une IMG, d'un titre et d'une selection de catégorie avec chgt de couleur (gris !ok vert ok) */

    function updateButtonState() {
        const conditionsRemplies = imgInput.files.length > 0 && titreInput.value.trim() !== "" && categoryInput.value !== "";
        
        buttonValider.disabled = !conditionsRemplies;
        buttonValider.style.backgroundColor = conditionsRemplies ? '#1D6154' : '#CBD6DC';
    }
    
    form.addEventListener('change', updateButtonState);
    

    updateButtonState();

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /* Gère la validation du formulaire et envoie les données du formulaire grâce une ()=> sendFormData. */

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const imgFiles = imgInput.files[0];
        const titre = titreInput.value;
        const categoryName = categoryInput.value;
        const categorieId = getCategoryID(categoryName);
        sendFormData(imgFiles, titre, categorieId, event);
    });

/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /* Retourne l'ID à la catégorie donné, ou -1 si pas de catégorie trouvée. */

    function getCategoryID(categoryName) {
        const categories = [
            {"id": 1, "name": "Objets"},
            {"id": 2, "name": "Appartements"},
            {"id": 3, "name": "Hotels & restaurants"}
        ];
        return categories.find(e => e.name === categoryName)?.id ?? -1;
    }
/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /*Affiche un aperçu d'image lorsqu'un fichier est sélectionné, en masquant les éléments d'interface utilisateur liés à l'ajout de photo.*/

    document.getElementById('image').addEventListener('change', function(event) {
        const input = event.target;
    
        if (input.files && input.files[0]) {
            let reader = new FileReader();
    
            reader.onload = function(e) {
                let previewContainer = document.getElementById('picture-preview');
                previewContainer.innerHTML = ''; // Effacer l'aperçu précédent s'il existe
    
                let img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px'; // Taille de l'aperçu, à ajuster selon vos besoins
                previewContainer.appendChild(img);
    
                /*Masquer l'icône, le label spécifique pour ajouter une photo, et le paragraphe*/
                document.querySelector('#add-pic i').style.display = 'none';
                document.querySelector('#add-pic .file-upload').style.display = 'none';
                document.querySelector('#add-pic p').style.display = 'none';
            };
    
            reader.readAsDataURL(input.files[0]);
        }
    });
    


/*-------------------------------------------------------------------------------------------------------------------------------------------*/ 

    /*Envoie les données du formulaire(IMG, titre et catégorie), à l'API et envoie une réponse ou affiche une erreur. */

    function sendFormData(imgFile, titre, categorieId, event) {

        const token = localStorage.getItem("token");
        
        const formData = new FormData();
        formData.append('image', imgFile); // Assurez-vous que imgFile est le fichier d'image correct
        formData.append('title', titre);
        formData.append('category', categorieId);
    
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
                // Ne pas définir 'Content-Type' ici, le navigateur le fera automatiquement
            }
        })
        
        .then(data => {
            alert('Projet ajouté avec succès ! 😄');
            closeModal(event);
            displayItemModal(data);
        })
    
        .catch(error => {
            alert('Erreur : ' + error.message);
        });
    }
    
});