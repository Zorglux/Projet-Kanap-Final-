/* récolte les informations de l'api en fonction d'un ID. 
  (informations d'un seul produit a chaque fois ) */ 
  async function apiParId(id) {
    let url = `http://localhost:3000/api/products/${id}`
  
    try {
      let res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.error(error);
    }
  }
  
  
  /* ramène les éléments de mon localStorage */ 
  function rameneLocalStorage() {
    return JSON.parse(localStorage.getItem("panier"));
  }
  
  
  /* recalcule le montant et le prix total pour l'afficher sur le 
     récapitulatif du panier */ 
  async function actualisationQuantitee() {
    let localStorage = rameneLocalStorage();
    let prix = 0;
    let quantitee = 0;
  
    // Calcul du prix du panier
    for (let i = 0; localStorage[i]; i++) {
      let donneesApi = await apiParId(localStorage[i].identifiant);
      prix += parseInt(localStorage[i].montant) * parseInt(donneesApi.price);
      quantitee += parseInt(localStorage[i].montant);
  
    }
    // On les ajoutes au dom 
    document.getElementById('totalPrice').textContent = `${prix}`
    document.getElementById('totalQuantity').textContent = `${quantitee}`
  }
  // ==========================================================
  
  /* utilises toute les informations pour placer les éléments
    du localStorage sur la page */ 
  async function creerElements(){
    let localObjet = rameneLocalStorage()
  
    // creation des élements
    
    for (let i=0; localObjet[i]; i++){
      let donneesApi = await apiParId(localObjet[i].identifiant)
      const placement = document.getElementById("cart__items")
    
      const article = document.createElement("article")
      article.classList.add("cart__item")
      article.setAttribute("data-id", `${localObjet[i].id}`)
      article.setAttribute("data-color", `${localObjet[i].couleur}`)
      article.innerHTML =
       ` <div class="cart__item__img">
       <img src="${donneesApi.imageUrl}" alt="${donneesApi.altTxt}">
     </div>
     <div class="cart__item__content">
       <div class="cart__item__content__description">
         <h2>${donneesApi.name}</h2>
         <p>${localObjet[i].couleur}</p>
         <p>${donneesApi.price}</p>
       </div>
       <div class="cart__item__content__settings">
         <div class="cart__item__content__settings__quantity">
           <p>Qté : </p>
           <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localObjet[i].montant}">
         </div>
         <div class="cart__item__content__settings__delete">
           <p class="deleteItem">Supprimer</p>
         </div>
       </div>
     </div>`
  
      placement.appendChild(article)
  
  // =================================================================
  /* Calcul du prix et du nombre d'articles total */ 
  //==================================================================
      let placementInput = article.getElementsByClassName('itemQuantity');
  
      placementInput[0].addEventListener('change', (e) => {
        actualisationLocalStorage(e, localObjet[i].id, localObjet[i].color);
      });
      
      /* recalcule les montants a chaque changement de l'input. */ 
      async function actualisationLocalStorage(q, id, color) {
        let local = rameneLocalStorage();
        let idLocal = [];
        let index;
  
        // gestion erreur
        if (q.target.value <= 0)
          return -1;
  
        // ----- On mets l'index dans notre tableau ----- //
        for (let i = 0; local[i]; i++) {
          if (local[i].id == id && local[i].color == color)
            index = i;
          idLocal.push(local[i].id);
        }
      
   /*   change les montants pour les remettre dans le localStorage */
        local[index].montant = q.target.value;
        localStorage.setItem("panier", JSON.stringify(local));
  
        // ----- On remets a jour le total ----- //
  
                actualisationQuantitee()
              }
              
           /* supprime l'élément du localStorage et du dom au clic */ 
              function suppression(){
                let boutonSupprimer =  article.getElementsByClassName("deleteItem")
                let idParBouton = boutonSupprimer[0].closest("article").getAttribute("data-id")
                let articleDuBouton = boutonSupprimer[0].closest("article")
                
                boutonSupprimer[0].addEventListener("click", function(){
                  let local = rameneLocalStorage();
                 
                  let localSupprime =  local.filter(function(local) {
                    return local.id != idParBouton ;
                  });
                  localStorage.setItem("panier", JSON.stringify(localSupprime));
                  
                 actualisationQuantitee()
                 articleDuBouton.remove()
                
                })
              }
              suppression()    
       }
  }
  
  
  // ==============================================================
  /* VALIDATION DU FORMULAIRE */ 
  
  function validationFormulaire(){
  
  const bouton = document.getElementById("order")
  
  const prenom = document.getElementById("firstName")
  const nom = document.getElementById("lastName")
  const ville = document.getElementById("city")
  const addresse = document.getElementById("address")
  const email = document.getElementById("email")
  
  
  const error = document.getElementById("firstNameErrorMsg")
  const errorNom = document.getElementById("lastNameErrorMsg")
  const errorVille = document.getElementById("cityErrorMsg")
  const errorAddresse = document.getElementById("addressErrorMsg")
  const errorEmail = document.getElementById("emailErrorMsg")
  
  const regexAlphabet = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
  const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  // =================================================
   bouton.addEventListener("click", function(e){
  
  const articlesTotaux = document.getElementById("totalQuantity")
  
     // regarde si il y a un produit dans le panier
  
     if (articlesTotaux.innerText === "" || articlesTotaux.innerText == 0){
      e.preventDefault()
      alert("Veuillez mettre un produit dans votre panier")
     }
  
  
     // validation prénom 
  
       if ((regexAlphabet.test(prenom.value) === false) || ((prenom.value) === "")){
        e.preventDefault()
        error.innerText = "Renseignez votre prénom"
       }else{
        error.innerText = ""
       }
  
  
    // validation nom
  
       if ((regexAlphabet.test(nom.value) === false) || (nom.value) === ""){
        e.preventDefault()
        errorNom.innerText = "Renseignez votre nom"
       }else{
        errorNom.innerText = ""
       }
  
  
    // validation ville
  
       if ((regexAlphabet.test(ville.value) === false) || (ville.value) === ""){
        e.preventDefault()
        errorVille.innerText = "Renseignez votre Ville"
       }else{
        errorVille.innerText = ""
       }
  
    // validation addresse 
       
      if ((addresse.value) === ""){
        e.preventDefault
        errorAddresse.innerText = "Renseignez votre addresse"
      } else {
        errorAddresse.innerText = ""
      }
  
    // validation email
  
      if (regexEmail.test(email.value) === false){
        e.preventDefault
        errorEmail.innerText = "Renseignez votre email"
      } else {
        errorEmail.innerText = ""
      }
   })
  }
  // ================================================
  
  
  
  
  /* ======================================= */ 
  
  //  Requête POST pour envoyer les données a l'API
  
  function envoiApi(){
  const prenom = document.getElementById("firstName")
  const nom = document.getElementById("lastName")
  const addresse = document.getElementById("address")
  const ville = document.getElementById("city")
  const email = document.getElementById("email")
  
  
  const produitsLocal = rameneLocalStorage()
  let idProduits = []
  
  for (let i=0; produitsLocal[i]; i++){
    idProduits.push(produitsLocal[i].identifiant)
  }
  
  
  
  
  
  
  const ecouteFormulaire = document.getElementsByClassName("cart__order__form")
  ecouteFormulaire[0].addEventListener("submit", function(e){
   
  const nombreArticles = document.getElementById("totalQuantity")

        const body = {
          contact: {
            firstName : prenom.value,
            lastName : nom.value,
            address : addresse.value,
            city : ville.value,
            email : email.value
          },
          products : idProduits
          };
        
if (nombreArticles.innerText == 0 || nombreArticles.innerText == ""){
  return
}else{ 
    fetch("http://localhost:3000/api/products/order", {
      method : "POST",
      headers : {"Content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((promise) => recupereIdCommande(promise.orderId))
       }
      
      }
   )
  }

  
  function recupereIdCommande(idCommande){
    window.location.href = "http://127.0.0.1:5500/html/confirmation.html?id="+idCommande
  }
  
  
  // j'appelle mes fonctions 
  creerElements()
  actualisationQuantitee()
  validationFormulaire()
  envoiApi()