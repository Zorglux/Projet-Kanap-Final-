let url = "http://localhost:3000/api/products"

fetch(url)
.then((res) => res.json())
.then((response) => placement(response))




/* placement() se sert du fetch pour placer les 
   élements sur la page */ 
function placement(donnees){
  document.getElementById("items").innerHTML = 
  donnees.map(canape => 
  `<a href="./product.html?id=${canape._id}">
     <article>
       <img src="${canape.imageUrl}" alt="${canape.altTxt}">
       <h3 class="productName">${canape.name}</h3>
       <p class="productDescription">${canape.description}</p>
     </article>
   </a>`
).join("")}