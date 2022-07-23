// récupération id
const str = window.location;
const url = new URL(str);
const productId = url.searchParams.get("id");
const objectURL = "http://localhost:3000/api/products/" + productId;

// L'Ajout d'un produit au panier
function addToCart(productItem) {
  let cartItems = localStorage.getItem("cartItems");
  // Si panier vide
  if (cartItems === null) {
    let items = [productItem];
    console.log(items);
    let itemsStr = JSON.stringify(items);
    localStorage.setItem("cartItems", itemsStr);
    alert("Produit ajouté au panier !");
  } else {
    // Si le panier contient des produits de même id et même couleur
    let items = JSON.parse(cartItems);
    const resultat = items.find((product) => {
      if (product.id === productItem.id && product.color === productItem.color)
        return true;

      return false;
    });

    if (resultat != undefined) {
      items = items.map((item, index) => {
        if (item.id === productItem.id && item.color === productItem.color) {
          item.quantity += productItem.quantity;
        }

        return item;
      });
    } else {
      // Si le panier contient des produits différents
      items.push(productItem);
    }
    let itemsStr = JSON.stringify(items);
    localStorage.setItem("cartItems", itemsStr);
    alert("Produit ajouté au panier !");
  }
  location.href = "cart.html";
}

// Récupération des produits de l'API
function displayProduct() {
  fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      // Une erreur est survenue
      console.log("erreur");
    })

    // Insertion des données de l'API dans le DOM (titre, img, nom, prix, description et option couleurs)
    .then(function (getProduct) {
      const product = getProduct;

      let productImg = document.createElement("img");
      document.querySelector(".item__img").appendChild(productImg);
      productImg.setAttribute("src", `${product.imageUrl}`);
      productImg.setAttribute("alt", `${product.altTxt}`);

      let productName = document.getElementById("title");
      productName.textContent = `${product.name}`;

      let productPrice = document.getElementById("price");
      productPrice.textContent = `${product.price}`;

      let productDescription = document.getElementById("description");
      productDescription.textContent = `${product.description}`;

      document.querySelector("#colors").insertAdjacentHTML(
        "beforeend",
        product.colors.map(
          (color) => {
            return `<option id= "valueColor" value="${color}">${color}</option>`;
          }
        )
      );
    });

  // Ecoute événèment sur le bouton ajouter au panier
  const cartButton = document.getElementById("addToCart");
  cartButton.addEventListener("click", (event) => {
    event.preventDefault();
    let productColor = document.getElementById("colors").value;
    let productQuantity = parseInt(document.getElementById("quantity").value);
    // Si aucune couleur sélectionnée
    if (productColor == "") {
      alert("Veuillez sélectionner une couleur");
      return;
    }
    // Si quantité = 0
    if (productQuantity == 0) {
      alert("Veuillez renseigner une quantité");
      return;
    } else if (productQuantity > 100) {
      alert("La quantité maximale autorisée est de 100");
      return;
    }
    // Création d'un tableau contenant l'id, la couleur et la quantité du produit ajoutée
    const productOptions = {
      id: productId,
      color: productColor,
      quantity: productQuantity,
    };
    addToCart(productOptions);
  });
}
displayProduct();