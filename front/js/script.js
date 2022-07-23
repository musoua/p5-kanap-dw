let DisplayProducts = document.querySelector(".items");

// Récupération des articles de l'API 
fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((products) => {
    // Répartition des données de l'API dans le DOM 
    console.log("productsList", products);
    for (i = 0; i < products.length; i++) {
      DisplayProducts.innerHTML += `
        <a href="./product.html?id=${products[i]._id}">
        <article>
        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}</p>
        </article> 
        </a>`;
    }
  })
.catch((error) => error);