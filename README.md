### Etape 1 : dynamiser les modals pour créer des listes et des cartes

Pour ouvrir le site dans un navigateur :
$ open -a 'Google Chrome' index.html

Intégration avec [Bulma](https://bulma.io/)

- Fonction de gestion des écouteurs pour afficher/cacher les modals : `addListenerToActions`.
- Création d'un template dans le HTML avec un id spécifique (list-id), puis d'une méthode `makeListInDOM` qui récupère le template et l'envoie dans `handleAddListForm`, appelée lors de la soumission du formulaire de création de liste.
- Création d'une modal pour ajouter une carte avec id (list_id) dans le form et input hidden.
- Création d'un template dans le HTML mais pour les cartes cette fois.
- Pour afficher la modal card -> ajout dans le HTML de `.add-card-button` au niveau du +, et appel `showAddCardModal` dans `addListenerToActions`, comme pour liste mais avec l'argument `event` qui contient l'objet cliqué.
- Pour lier la carte à la bonne liste -> ciblage de `.panel` (la liste) le plus proche avec "event.target.closest", récupération de l'id de la liste à envoyer dans le champ id de card.
- Désormais, la modal d'ajout de carte s'affiche, donc écouteur sur "submit" qui lance `handleAddCardForm`.
- `handleAddCardForm` envoie à `makeCardInDOM` deux paramètres : name="content" (de la modal card) et list_id qui a été remplacée par l'id de la liste dans `showAddCardModal`.
- Même logique pour `makeCardInDOM` qu'avec `makeListInDOM` -> récupération du template, titre générique remplacé par celui entré dans le form et ajout de la carte dans la bonne liste.


### Etape 2 : récupération des listes via API et modification de la bdd depuis front

- Ajout d'une propriété `base_url` qui contient l'url de l'API (son point d'entrée de base).
- Puis appel AJAX sur cette url avec fetch et await la réponse en format JSON pour récupérer les données sous forme de tableau.
- Boucle sur tableau pour appeler `makeListInDOM` et créer chacune des listes.
- Boucle card dans boucle liste pour ajouter les cartes.
- Sélection '.box' du template card pour modifier background et lui attribuer card.color définie dans bdd (si modification de couleur ou position dans bdd, ne pas oublier de relancer avec `psql -U astrid -d trello -f ./data/create_db.sql`).
- Appel API dans `handleAddListForm` pour envoyer les listes créées dans le form à la bdd
- Ajout du middleware multer en back pour gérer le format de formData
- Modification du titre via form hidden, écouteur pour déclencher `showFormToEditTitle` dans `makeListInDOM`
- Listener sur submit lance `handleEditListForm` qui envoie les données dans la bdd avec fetch patch
- Ajout d'un formulaire d'édition dans le HTML de card template
- Création de `handleCardContentEdit` pour faire apparaitre le form d'édition de carte
- Création de `handleEditCardForm` pour modifier une carte et sauvegarder
- Création de `handleCardDelete` pour supprimer une carte et sauvegarder