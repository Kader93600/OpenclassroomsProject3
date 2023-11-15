document.addEventListener("DOMContentLoaded", () => {

  /*Selectionner la div gallery */

  const gallery = document.querySelector(".gallery");

  /*function displayItems(category) sert à afficher les elements par catégorie */

  function displayItems(category) {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json()) /*Recupère les infos de API et converti en .JSON*/
      .then(data => {
        gallery.innerHTML = ''; /*La div gallery est nettoyer avant de filtrer sur les items*/

        /* La boucle forEach si la category dans data et ALL ou une autre category alors
          ca va lancer la ()=>  displayItem(item) */

        data.forEach(item => {
          if (category === "all" || item.category.name === category) {
            displayItem(item);
          }
        });
      });
    }  
    
    /* Crée et affiche un elmnt de galerie avec une img et figcaption. */

    function displayItem(item) {
      
      const figure = document.createElement("figure"); /*Création de la div Figure*/
      
      const img = document.createElement("img"); /*Création de la div img*/
      img.src = item.imageUrl;
      img.alt = item.title;
      
      const figcaption = document.createElement("figcaption"); /*Création de la div figcaption*/
      figcaption.textContent = item.title;
      
      /*Ajouter img et figcaption dans figure*/
      
      figure.appendChild(img);
      figure.appendChild(figcaption);
      
      /*Ajouter comme enfant figure dans gallery*/
      
      gallery.appendChild(figure);
      
    }
    
      /* La boucle forEach au clic on récupère la category selectioné grace à 
      "data-category" et on fera apparaitre les figures concernés */
      
      const menuItems = document.querySelectorAll(".filtre li");
    
      menuItems.forEach(item => {
        item.addEventListener("click", () => {
          const category = item.getAttribute("data-category");
          displayItems(category);
        });
      });
    
  displayItems("all"); /*Pour que toutes les projets s'affichent dès le chargement de la page*/
});
