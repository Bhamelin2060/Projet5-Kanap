let Total_price = 0;
let Total_Quantity = 0;
//var orderID="";
var Validation_Formulaire = {  // tableau deestiner à la validation du formulaire pour valider le bouton rcommander'
  val_first_name: false,
  val_lastName: false,
  val_address: false,
  val_city: false,
  val_Email: false,
};
document.getElementById("totalQuantity").innerText = Total_Quantity;
document.getElementById("totalPrice").innerText = Total_price;
// Récupération du panier
const cart = JSON.parse(localStorage.getItem("Panier")); // récupération du panier
console.log("le panier d'entrée vaut", cart);
// Récupération du conteneur des vignettes
const cartContainer = document.getElementById("cart__items");

// Fonction qui parcourt le panier pour créer les vignettes
const parseCart = (cart)  => {
  // On nettoie le conteneur des vignettes
  cartContainer.innerHTML = "";
   // On parcourt le panier et on récupère les infos de chaque produit
  for (const cartItem of cart) {
    fetch("http://localhost:3000/api/products/" + cartItem._id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then((product) => {
        // On modifie chaque produit pour y ajouter la couleur et la quantité choisies
        delete product.colors;
        product.color = cartItem.color;
        product.quantity = cartItem.quantity;
        Calcul_Quantité_Prix(product);
        createThumbnail(product);
      });
  }
 }; 
//Calcul_Quantité_Prix(product);

const Calcul_Quantité_Prix = (product) => {
  Total_Quantity += parseInt(product.quantity);
  Total_price += parseInt(product.quantity) * product.price;

  document.getElementById("totalQuantity").innerText = Total_Quantity;
  document.getElementById("totalPrice").innerText = Total_price;
};
const createThumbnail = (product) => {
  //console.log(product)

  // On crée un article
  const articleElt = document.createElement("article");
  articleElt.classList.add("cart__item");
  articleElt.dataset.id = product._id;
  articleElt.dataset.color = product.color;

  // On crée l'image du produit
  const divImgElt = document.createElement("div");
  divImgElt.classList.add("cart__item__img");
  const imgElt = document.createElement("img");
  imgElt.src = product.imageUrl;
  imgElt.alt = product.altTxt;
  divImgElt.appendChild(imgElt);
  articleElt.appendChild(divImgElt);

  // On crée le contenu du produit
  const divContent = document.createElement("div");
  divContent.classList.add("cart__item__content");
  const divContentDesc = document.createElement("div");
  divContentDesc.classList.add("cart__item__content__description");

  const titleElt = document.createElement("h2");
  titleElt.innerHTML = product.name;
  divContentDesc.appendChild(titleElt);

  const colorElt = document.createElement("p");
  colorElt.innerHTML = product.color;
  divContentDesc.appendChild(colorElt);

  const priceElt = document.createElement("p");
  priceElt.innerHTML = product.price;
  divContentDesc.appendChild(priceElt);
  divContent.appendChild(divContentDesc);

  // On crée les infos du produit
  const divSettings = document.createElement("div");
  divSettings.classList.add("cart__item__content__settings");
  const divSettingsQty = document.createElement("div");
  divSettingsQty.classList.add("cart__item__content__settings__quantity");
  const qtyElt = document.createElement("p");
  qtyElt.innerHTML = "Qté :";
  divSettingsQty.appendChild(qtyElt);

  // On crée l'input Quantité :
  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.classList.add("itemQuantity");
  qtyInput.name = "itemQuantity";
  qtyInput.min = 1;
  qtyInput.max = 100;
  qtyInput.value = product.quantity;

  // On écoute l'évènement change de l'input
  qtyInput.addEventListener("change", (event) => {
    product.quantity = event.target.value;
    changeQty(product);
  });

  divSettingsQty.appendChild(qtyInput);
  divSettings.appendChild(divSettingsQty);

  const divSettingsDel = document.createElement("div");
  divSettingsDel.classList.add("cart__item__content__settings__delete");

  // On crée le 'bouton' Supprimer
  const delElt = document.createElement("p");
  delElt.classList.add("deleteItem");
  delElt.innerHTML = "Supprimer";
  divSettingsDel.appendChild(delElt);
  divSettings.appendChild(divSettingsDel);

  // On écoute l'évènement supprime article
  delElt.addEventListener("click", (event) => {
    const productId =
      delElt.parentNode.parentNode.parentNode.parentNode.dataset.id;
    const productColor =
      delElt.parentNode.parentNode.parentNode.parentNode.dataset.color;
    const Elt_à_retirer = delElt.parentNode.parentNode.parentNode.parentNode;
    // demande de confirmation de destruction de l'élément diu panier
    console.log("cart avant retrait=", cart);
    var dialog = confirm("Voulez vous rélellement supprimer cet article?");
    if (dialog) {
      for (i = 0; i < cart.length; i++) {
        if (cart[i].color == productColor && cart[i]._id == productId) {
          var indice = i;
          console.log("indice=", i);
        }
      }
      console.log("L'article ", product.name, product.color, "à été retirer");
      cart.splice(indice, 1); // retire l'élément indice
      console.log("cart apres retrait=", cart);
      Elt_à_retirer.parentNode.removeChild(Elt_à_retirer); // rettrait de l'affichage de l'élément retireé

      //remettre a jour l'affichage panier
      Panier_recap = JSON.stringify(cart);
      localStorage.setItem("Panier", Panier_recap);
    } else {
      alert(" Abandon Retrait de l'article");
    }
  });
  divContent.appendChild(divSettings);
  articleElt.appendChild(divContent);

  cartContainer.appendChild(articleElt);
};

// Changer la quantité :
const changeQty = (product) => {
  //console.log("product=", product);
  //console.log( "cart=",cart);
  let Qte = parseInt(product.quantity);
  console.log("cart  avant changement=", cart);
  // Modifier la quantité dans le panier
  for (const CartList of cart) {
    product.quantity = CartList.quantity;

    if (CartList._id == product._id) {
      Total_Quantity =
        Total_Quantity - parseInt(CartList.quantity) + parseInt(Qte);
      Total_price =
        Total_price + (Qte - parseInt(CartList.quantity)) * product.price;
      document.getElementById("totalQuantity").innerText = Total_Quantity;
      document.getElementById("totalPrice").innerText = Total_price;
      CartList.quantity = Qte;
    }
  }

  console.log("quantité totale=", Total_Quantity);
  console.log("cart  apres changement=", cart);

  Panier_recap = JSON.stringify(cart);
  localStorage.setItem("Panier", Panier_recap);
};
if (cart.length > 0) {
  parseCart(cart);
}
 
 
// déclaration des références clients 
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};
 
// gestion du formulaire en introduisant des Regex

// Introduction du Nom

Elt_first_Name_Input = document.getElementById("firstName");
Elt_first_Name_Input.addEventListener("input", function (e) {
  if (/^[A-Z]{1}[a-z]{3,10}/.test(e.target.value)) {
    document.getElementById("firstNameErrorMsg").innerText = "conforme";
    contact.firstName = e.target.value;
      
     
     console.log("contact",contact);
    Validation_Formulaire.val_first_name = true;
  } else {
    Validation_Formulaire.val_first_name = false;
    document.getElementById("firstNameErrorMsg").innerText =
      "First Name n'est pas conforme";
  }
  funct_Validation_formulaire(Validation_Formulaire);
});

// Introduction du Prénom

Elt_Last_Name_input = document.getElementById("lastName");
Elt_Last_Name_input.addEventListener("input", function (e) {
  if (/^[A-Z]{1}[a-z]{3,5}/.test(e.target.value)) {
    document.getElementById("lastNameErrorMsg").innerText = "conforme";
    contact.lastName = e.target.value;
    
    console.log("contact",contact);
    Validation_Formulaire.val_lastName = true;
  } else {
    Validation_Formulaire.val_lastName = false;
    document.getElementById("lastNameErrorMsg").innerText =
      "Last Name n'est pas conforme";
  }
  funct_Validation_formulaire(Validation_Formulaire);
});

// Introduction de l'adresse Client

Elt_Adresse_input = document.getElementById("address");
Elt_Adresse_input.addEventListener("input", function (e) {
  //if (/^[A-Z]{1}[a-z]{3,20}/.test(e.target.value)){
  if (/^[0-9]{1,4}\s[a-zA-Z\s]{1,24}\s/.test(e.target.value)) {
    document.getElementById("addressErrorMsg").innerText = "conforme";
    contact.address = e.target.value;
    
    console.log("contact",contact);
    Validation_Formulaire.val_address = true;
  } else {
    Validation_Formulaire.val_address = false;
    document.getElementById("addressErrorMsg").innerText =
      "l adresse n'est pas conforme";
  }
  funct_Validation_formulaire(Validation_Formulaire);
});

// Intorduction de sa ville

Elt_city_input = document.getElementById("city");
Elt_city_input.addEventListener("input", function (e) {
  if (/^[A-Z]{1}[a-z]{1,20}/.test(e.target.value)) {
    document.getElementById("cityErrorMsg").innerText = " conforme";
    contact.city = e.target.value;
    
    console.log("contact",contact);
    Validation_Formulaire.val_city = true;
  } else {
    Validation_Formulaire.val_city = false;
    document.getElementById("cityErrorMsg").innerText =
      "La ville n'est pas conforme";
  }
  funct_Validation_formulaire(Validation_Formulaire);
});

// Intorduction de son Email

Elt_email_input = document.getElementById("email");
Elt_email_input.addEventListener("input", function (e) {
  if (
    /[a-zA-Z0-9._-]{1,10}@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}/.test(e.target.value)
  ){
   
  contact.email = e.target.value;
     
  console.log("contact",contact);
    document.getElementById("emailErrorMsg").innerText = "conforme";
    Validation_Formulaire.val_Email = true;
  } else {
    Validation_Formulaire.val_Email = false;
    document.getElementById("emailErrorMsg").innerText =
      "Email n'est pas conforme";
  }
  funct_Validation_formulaire(Validation_Formulaire);
});

// Test de validation des données du formumaire
function funct_Validation_formulaire(Validation_Formulaire) {
  console.log(
    Validation_Formulaire.val_first_name,
    Validation_Formulaire.val_lastName,
    Validation_Formulaire.val_address,
    Validation_Formulaire.val_city,
    Validation_Formulaire.val_Email
  );

  if (
    Validation_Formulaire.val_first_name &&
    Validation_Formulaire.val_lastName &&
    Validation_Formulaire.val_address &&
    Validation_Formulaire.val_city &&
    Validation_Formulaire.val_Email
  ) {
    Elt_Btncommand = document.getElementById("order");
    Elt_Btncommand.setAttribute("desable", false);
    console.log('Etat du bouton:',Elt_Btncommand.desable)
    alert("Panier valider");
    console.log("contact",contact);
  } else {
    Elt_Btncommand = document.getElementById("order");
    Elt_Btncommand.setAttribute("desable", true);
    console.log('Etat du bouton:',Elt_Btncommand.desable)
    console.log("contact",contact);
  }
  Elt_Btncommand = document.getElementById("order");
  Elt_Btncommand.addEventListener("click", (event) => {
    console.log("contact",contact);
  
    if (Elt_Btncommand.disabled==false){
       
       
      const Panier_recap = JSON.parse(localStorage.getItem("Panier"))
    let products=[];
    for (i=0; i<Panier_recap.length;i++){ 
      products[i]=Panier_recap[i]._id;
      console.log("products",products[i]);
    }
    console.log("products",products);
     // contact=Client_Ref;
      const orderId=send(contact,products);
      //const orderId="12121df21d2f12df1"
       
       window.location.href = "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + orderId;
       
    }
  }) 


}
 

// envoi requete vers le server
function send(contact,products) {
  // Données à envoyer
   
  fetch("http://localhost:3000/api/products/order", {   //  fetch("http://localhost:3000/api/products/order";..
    method: "POST",
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({contact,products})
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(value) {
      console.log("value.postData.text",value);
      return(value);
  });

  }   
    
  
 