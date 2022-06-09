fetch("http://localhost:3000/api/products") 
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(Liste_kanapé) {
  // DOM elements
 
    for (let i = 0; i < Liste_kanapé.length; i++){  
  let New_Produit = document.createElement("a");
  let NewArticle= document.createElement("Article");
  let NewImage= document.createElement("img");
  let NewTitre3= document.createElement("h3");
  let Newparagraphe= document.createElement("p");
  let pp = document.createElement("p");
  let elt = document.getElementById("items");  //déclaration du document principal dans lequel on ajoute un enfant
 

 const Element=document.getElementById("items"); // ajout un elemenent de typ <a>
  
 Element.appendChild(New_Produit);
 New_Produit.href='./product.html?id='+`${Liste_kanapé[i]._id}`;      // Déclaration de cet enfant comme element New_Produit
 New_Produit.appendChild(NewArticle);
 NewArticle.appendChild(NewImage); // creation balise Image , enfant de New_Produit
 //NewImage.innerHTML="src=\"\" alt=\"Lorem ipsum dolor sit amet, Kanap name1";


 NewImage.src=`${Liste_kanapé[i].imageUrl}`;
 NewImage.alt=`${Liste_kanapé[i].altTxt}`;
 NewArticle.appendChild(NewTitre3); // creation balise h3 , enfant de New_Produit
 NewTitre3.innerHTML=`${Liste_kanapé[i].name}`;
 NewTitre3.classList.add("productName");
 NewArticle.appendChild(Newparagraphe); // creation balise p , enfant de New_Produit
 Newparagraphe.innerHTML="voici mon canape."+`${Liste_kanapé[i].description}`;
 Newparagraphe.classList.add("productDescription");
}                                             // fin de boucle for
})
.catch(function(err) {
  // Une erreur est survenue
})