// Initialisation du localstorage
let itemsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));

// Affichage du contenu du panier
async function displayCart() {
    const parser = new DOMParser();
    const positionEmptyCart = document.getElementById("cart__items");
    let cartArray = [];

    // Si le localstorage est vide
    if (itemsInLocalStorage === null || itemsInLocalStorage == 0) {
        positionEmptyCart.textContent = "Votre panier est vide";
    } else {
        // Si le localstorage contient des produits
        for (i = 0; i < itemsInLocalStorage.length; i++) {
            const product = await getProductById(itemsInLocalStorage[i].id);
            const totalPriceItem = (product.price *= itemsInLocalStorage[i].quantity);
            cartArray += `
       <article class="cart__item" data-id=${itemsInLocalStorage[i].id}>
       <div class="cart__item__img">
         <img src="${product.imageUrl}" alt="Photographie d'un canapé">
       </div>
       <div class="cart__item__content">
         <div class="cart__item__content__titlePrice">
           <h2>${product.name}</h2>
           <p>${itemsInLocalStorage[i].color}</p>
           <p id="prix_${i}">${totalPriceItem} 
           €</p>
         </div>
         <div class="cart__item__content__settings">
           <div class="cart__item__content__settings__quantity">
             <p>Qté : </p>
             <input data-id= ${itemsInLocalStorage[i].id} data-color= ${itemsInLocalStorage[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${itemsInLocalStorage[i].quantity}>
           </div>
           <div class="cart__item__content__settings__delete">
             <p data-id= ${itemsInLocalStorage[i].id} data-color= ${itemsInLocalStorage[i].color} class="deleteItem">Supprimer</p>
           </div>
         </div>
       </div>
     </article>
     `;
        }
        // Affichage du nombre total d'articles et du prix total du panier
        let totalQuantity = 0;
        let totalPrice = 0;
        for (i = 0; i < itemsInLocalStorage.length; i++) {
            const article = await getProductById(itemsInLocalStorage[i].id);
            totalQuantity += parseInt(itemsInLocalStorage[i].quantity);
            totalPrice += parseInt(article.price * itemsInLocalStorage[i].quantity);
        }
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;
        if (i == itemsInLocalStorage.length) {
            const displayBasket = parser.parseFromString(cartArray, "text/html");
            positionEmptyCart.appendChild(displayBasket.body);
        }
        changeQuantity();
        deleteItem();
    }
}


// Récupération des produits de l'API
async function getProductById(productId) {
    return fetch("http://localhost:3000/api/products/" + productId)
        .then(function (res) {
            return res.json();
        })
        .catch((err) => {
            // Une erreur est survenue
            console.log("erreur");
        })
        .then((response) => {
            return response;
        });
}
displayCart();

async function reloadCart() {
    let itemsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
    let totalQuantity = 0;
    let totalPrice = 0;
    for (i = 0; i < itemsInLocalStorage.length; i++) {
        const article = await getProductById(itemsInLocalStorage[i].id);
        totalQuantity += parseInt(itemsInLocalStorage[i].quantity);
        totalPrice += parseInt(article.price * itemsInLocalStorage[i].quantity);
        console.log(parseInt(article.price * itemsInLocalStorage[i].quantity));
        document.getElementById("prix_" + i).innerHTML = (article.price * itemsInLocalStorage[i].quantity + " €");
    }
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

// Modification de la quantité
function changeQuantity() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    quantityInputs.forEach((quantityInput) => {
        quantityInput.addEventListener("change", (event) => {
            event.preventDefault();
            const inputValue = event.target.value;
            const dataId = event.target.getAttribute("data-id");
            const dataColor = event.target.getAttribute("data-color");
            let cartItems = localStorage.getItem("cartItems");
            let items = JSON.parse(cartItems);

            items = items.map((item, index) => {
                if (item.id === dataId && item.color === dataColor) {
                    item.quantity = inputValue;
                }
                return item;
            });

            if (inputValue > 100 || inputValue < 1) {
                alert("La quantité doit etre comprise entre 1 et 100");
                return;
            }
            let itemsStr = JSON.stringify(items);
            localStorage.setItem("cartItems", itemsStr);
            reloadCart();
        });
    });
}

// Suppression d'un article
function deleteItem() {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            const deleteId = event.target.getAttribute("data-id");
            const deleteColor = event.target.getAttribute("data-color");
            itemsInLocalStorage = itemsInLocalStorage.filter(
                (element) => !(element.id == deleteId && element.color == deleteColor)
            );
            console.log(itemsInLocalStorage);
            deleteConfirm = window.confirm(
                "Etes vous sûr de vouloir supprimer cet article ?"
            );
            if (deleteConfirm === true) {
                localStorage.setItem("cartItems", JSON.stringify(itemsInLocalStorage));
                alert("Article supprimé avec succès");

            } else {
                return;
            }

            const card = deleteButton.closest(".cart__item");
            card.remove();
            reloadCart();

            const deleteKanap = JSON.parse(localStorage.getItem("cartItems"));
            if (deleteKanap.length === 0) {
                localStorage.removeItem("cartItems");
                alert('Panier vide, retour à l\'accueil.');
                window.location.href = "index.html";
            }

        });

    });
}


//-------------------------------- Formulaire --------------------------------------------//

// Variables Regex
let nameRegex = /^[a-zA-Z\-çñàéèêëïîôüù ]{2,}$/;
let adressRegex = /^[0-9a-zA-Z\s,.'-çñàéèêëïîôüù]{3,}$/;
let emailRegex = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,}$/;
// Variables pour récupérer les Id des champs de formulaire
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

// Validation prénom
firstName.addEventListener("input", (event) => {
    event.preventDefault();
    if (nameRegex.test(firstName.value) == false || firstName.value == "") {
        document.getElementById("firstNameErrorMsg").innerHTML =
            "Prénom non valide";
        return false;
    } else {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
        return true;
    }
});

// Validation nom
lastName.addEventListener("input", (event) => {
    event.preventDefault();
    if (nameRegex.test(lastName.value) == false || lastName.value == "") {
        document.getElementById("lastNameErrorMsg").innerHTML = "Nom non valide";
        return false;
    } else {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
        return true;
    }
});

// Validation adresse
address.addEventListener("input", (event) => {
    event.preventDefault();
    if (adressRegex.test(address.value) == false || address.value == "") {
        document.getElementById("addressErrorMsg").innerHTML = "Adresse non valide";
        return false;
    } else {
        document.getElementById("addressErrorMsg").innerHTML = "";
        return true;
    }
});

// Validation ville
city.addEventListener("input", (event) => {
    event.preventDefault();
    if (nameRegex.test(city.value) == false || city.value == "") {
        document.getElementById("cityErrorMsg").innerHTML = "Ville non valide";
        return false;
    } else {
        document.getElementById("cityErrorMsg").innerHTML = "";
        return true;
    }
});

// Validation email
email.addEventListener("input", (event) => {
    event.preventDefault();
    if (emailRegex.test(email.value) == false || email.value == "") {
        document.getElementById("emailErrorMsg").innerHTML = "Email non valide";
        return false;
    } else {
        document.getElementById("emailErrorMsg").innerHTML = "";
        return true;
    }
});


//-------------------------------- commander --------------------------------------------//

let order = document.getElementById("order");
order.addEventListener("click", (e) => {
    e.preventDefault();
    // création d'un tableau afin de récuperer les données de l'utilisateur
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };

    if (
        firstName.value === "" ||
        lastName.value === "" ||
        address.value === "" ||
        city.value === "" ||
        email.value === ""
    ) {
        alert("Vous devez renseigner vos coordonnées pour passer la commande !");
    } else if (
        nameRegex.test(firstName.value) == false ||
        nameRegex.test(lastName.value) == false ||
        adressRegex.test(address.value) == false ||
        nameRegex.test(city.value) == false ||
        emailRegex.test(email.value) == false
    ) {
        alert("Merci de renseigner correctement vos coordonnées !");
    } else {
        let products = [];
        itemsInLocalStorage.forEach((order) => {
            products.push(order.id);
        });

        let pageOrder = {
            contact,
            products
        };

        // Appel à l'api order pour envoyer les tableaux
        fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify(pageOrder),
            })
            .then((res) => {
                return res.json();
            })
            .then((confirm) => {
                window.location.href = "./confirmation.html?orderId=" + confirm.orderId;
                localStorage.clear();
            })
            .catch((error) => {
                console.log("une erreur est survenue");
            });
    }
});