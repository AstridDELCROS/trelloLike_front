### Etape 1

Pour ouvrir le site dans un navigateur :
$ open -a 'Google Chrome' index.html

Intégration avec [lien](https://bulma.io/)

**Dynamiser les modals pour créer des listes et des cartes**
- Fonction de gestion des écouteurs pour afficher/cacher les modals : `addListenerToActions`.
- Création d'un template dans le HTML avec un id spécifique (list-id), puis d'une méthode `makeListInDOM` qui récupère le template et l'envoie dans `handleAddListForm`, appelée lors de la soumission du formulaire de création de liste.
- Création d'une modal pour ajouter une carte avec id (list_id) dans le form et input hidden.
- Création d'un template dans le HTML mais pour les cartes cette fois.
- Pour afficher la modal card -> ajout dans le HTML de `.add-card-button` au niveau du +, et appel `showAddCardModal` dans `addListenerToActions`, comme pour liste mais avec l'argument `event` qui contient l'objet cliqué.
- Pour lier la carte à la bonne liste -> ciblage de `.panel` (la liste) le plus proche avec "event.target.closest", récupération de l'id de la liste à envoyer dans le champ id de card.
- Désormais, la modal d'ajout de carte s'affiche, donc écouteur sur "submit" qui lance `handleAddCardForm`.
- `handleAddCardForm` envoie à `makeCardInDOM` deux paramètres : name="content" (de la modal card) et list_id qui a été remplacée par l'id de la liste dans `showAddCardModal`.
- Même logique pour `makeCardInDOM` qu'avec `makeListInDOM` -> récupération du template, titre générique remplacé par celui entré dans le form et ajout de la carte dans la bonne list.