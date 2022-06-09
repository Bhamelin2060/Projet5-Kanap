let str = document.location.href; // récupére l'id du document en cours
let url = new URL(str);
let QTe_Choisie = 0;
let couleur_choisie = "";

var Id_produit = url.searchParams.get("id"); // permet d'extraire la référence du canapé qui  à appele la page
fetch("http://localhost:3000/api/products/" + Id_produit)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (Liste_kanapé) {
    // DOM elements
    // recherche de l'id demandé ou du kanapé demande

    // recherche de l'image du canapé
    const Elt_Img = document.getElementsByClassName("item__img"); // séléction de l'item pour initialise l'url image
    const Elt_Img2 = document.querySelector("article .item__img");
    let NewImage = document.createElement("img");
    Elt_Img2.appendChild(NewImage);
    NewImage.src = Liste_kanapé.imageUrl;
    NewImage.alt = Liste_kanapé.altTxt;
    // extraction du nom du canapé
    const Elt_name = document.getElementById("title"); // séléction de la balise prix par son Id
    Elt_name.innerHTML = Liste_kanapé.name;
    // extraction du prix du canapé
    const Elt_Price = document.getElementById("price"); // séléction de la balise prix par son Id
    Elt_Price.innerHTML = Liste_kanapé.price;
    // extraction de la description du canapé
    const Elt_description = document.getElementById("description");
    Elt_description.innerHTML = Liste_kanapé.description;

    // extraction de la couleur possible du canapé
    const Elmt_Color = document.getElementById("colors");
    const New_Option = document.createElement("option");

    for (let N_color in Liste_kanapé.colors) {
      const New_Option = document.createElement("option");
      Elmt_Color.appendChild(New_Option);
      New_Option.innerHTML = Liste_kanapé.colors[N_color];
    }

    // <select name="color-select" id="colors">

    document.getElementById("colors").selectedIndex = "0"; // initialise la première valeur par defaut
    // fonction event couleur
    document
      .getElementById("colors")

      .addEventListener("change", function (e) {
        couleur_choisie = e.target.value;
      });

    // fonction event quantité
    document
      .getElementById("quantity")
      .addEventListener("change", function (e) {
        QTe_Choisie = e.target.value;
      });
    //-----------------------------------------
    // fonction event bouton ajout panier
    //-----------------------------------------
    const Btn_Ajout_Panier = document.getElementById("addToCart"); // selection du bouton AJOUTER AU PANIER

    Btn_Ajout_Panier.addEventListener("click", function () {
      // traitement des alertes couleur non choisie et quantité non comforme
      if (couleur_choisie == "") {
        return alert(" Vous devez choisir une couleur");
      } // fin  if couleur choisie
      else if (QTe_Choisie < 1 || QTe_Choisie > 100) {
        return alert(" Vous devez sélectionner une quantité entre 1 et 100");
      } // fin test quantité valable
      else {
        //-1- Récupération du panier dans localStorage
        //  localStorage.clear()  //vidage local storage  pour debug****************************************************
        Panier_recap = localStorage.getItem("Panier");
        Panier_recap = JSON.parse(Panier_recap);

        if (Panier_recap === null) {
          // Test existence du panier

          Panier_recap = [];
        } //else{

        let produit = {
          // Si le panier n'existe pas en session, on le crée
          _id: "",
          color: "",
          quantity: "",
        };

        // introduction du permier article dans le panier
        produit._id = Id_produit;
        produit.color = couleur_choisie;
        produit.quantity = parseInt(QTe_Choisie);

        // le panier existe , on ajoute le produit
        Qte_Article_panier = Panier_recap.length;
        article_au_panier = false;
        for (let i = 0; i < Qte_Article_panier; i++) {
          if (
            Panier_recap[i]._id == produit._id &&
            Panier_recap[i].color == couleur_choisie
          ) {
            Panier_recap[i].quantity =
              Panier_recap[i].quantity + parseInt(QTe_Choisie);
            article_au_panier = true;
          }
        }
        if (article_au_panier == false) {
          Panier_recap.push(produit);
        }
        //      }
        Panier_recap = JSON.stringify(Panier_recap);
        localStorage.setItem("Panier", Panier_recap);
      }
    });
    //  fin function .addEventListener("click", function(e)
  }) // fin de traitement du bouton validation parnier
  .catch(function (err) {
    // Une erreur est survenue
  });
