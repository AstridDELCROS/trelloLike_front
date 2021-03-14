const app = {

    testAjax: async function() {
        const response = await fetch('https://swapi.dev/api/people/1');
        // interpréation du résultat en json
        const content = await response.json();
        console.log(content);
    },

    base_url: 'http://localhost:4000',

    getListsFromAPI: async function() {
        try {
            const response = await fetch(`${app.base_url}/lists`);
            if (response.status !== 200) {
                const error = await response.json();
                throw Error(error);
            }
            const lists = await response.json();
            // console.log(lists);
            for (const list of lists) {
                app.makeListInDOM(list.name, list.id);
                for (const card of list.cards) {
                    app.makeCardInDOM(card);
                }
            }
        } catch (error) {
            alert('désolé, un problème est survenu')
            console.log(error);
        }
    },

    init: function() {
        console.log('app.init !');
        app.addListenerToActions();
        // app.testAjax();
        app.getListsFromAPI();
    },
    
    addListenerToActions: function() {
        const getAddListButton = document.getElementById('addListButton');
        getAddListButton.addEventListener('click', app.showAddListModal);

        // getAddListButton.addEventListener('click', console.log('test'));
        const getButtonsToClose = document.querySelectorAll('.close');
        for (button of getButtonsToClose) {
            button.addEventListener('click', app.hideModals);
        };
        
        const getFormList = document.querySelector('#addListModal form');
        getFormList.addEventListener('submit', app.handleAddListForm);
        
        const addCardButtons = document.querySelectorAll('.add-card-button');
        for(const button of addCardButtons){
          button.addEventListener('click', app.showAddCardModal);
        }
        
        const getFormCard = document.querySelector('#addCardModal form');
        getFormCard.addEventListener('submit', app.handleAddCardForm);
    },
    
    showAddListModal: function() {
        const addListModal = document.getElementById('addListModal');
        addListModal.classList.add('is-active');
    },

    showAddCardModal: function(event){
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.classList.add('is-active');
        const currentList = event.target.closest('.panel');
        const listId = currentList.getAttribute('list-id');
        // Mise à jour de la valeur du champs list_id
        const listIdField = addCardModal.querySelector('[name="list_id"]');
        listIdField.value = listId;
    },

    hideModals: function() {
        const modals = document.querySelectorAll('.modal');
        for (modal of modals) {
            modal.classList.remove('is-active');
        }
    },

    handleAddListForm: async function(event) {
        try {
            event.preventDefault();
            const formData = new FormData(event.target);
            // Appel à l'API pour envoyer les données à sauvegarder (une liste)
            // FormData utilise le format `multipart/form-data` non géré par Express, il faut ajouter multer en back
            const response = await fetch(`${app.base_url}/lists`, {
                method: 'post',
                body: formData
            });
            const newListOrError = await response.json();
            if(response.status !== 200){
                throw Error(newListOrError);
            }
            // app.makeListInDOM(formData.get('name'));
            app.makeListInDOM(newListOrError.name, newListOrError.id);
        } catch (error) {
            alert('désolé, une erreur est survenue..');
            console.error(error);
        }
    },

    handleAddCardForm: async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        app.makeCardInDOM(formData.get('content'), formData.get('list_id'));
    },

    makeListInDOM: function(listName, listId) {
        const templateList = document.getElementById('template-list');
        const templateListContent = templateList.content;
        // Création d'un nouvel objet DOM (clone) à partir du fragment de document récupéré précédemment
        const newList = document.importNode(templateListContent, true);
        
        const listTitle = newList.querySelector('h2');
        listTitle.textContent = listName;
        
        listTitle.addEventListener('dblclick', app.showFormToEditTitle);
        const form = listTitle.nextElementSibling;
        form.addEventListener('submit', app.handleEditListForm);
        
        if (listId) {
            // On doit d'abord aller chercher l'élément DOM global du fragment
            const blockList = newList.querySelector('.panel');
            // puis on remplace 'list-id' par l'id de la liste courante récupérée par l'API,
            // comme ça les cartes ajoutées par la modal iront sur les listes ciblées
            blockList.setAttribute('list-id', listId);
            // Pour modifier la valeur du champs caché du formulaire caché permettant de modifier une liste
            const idField = form.querySelector('input[name="id"]');
            idField.value = listId;
            // Option : prépremplir le champ name avec la valeur actuelle du titre
            const nameField = form.querySelector('input[name="name"]');
            nameField.value = listName;
          }
        const listContainer = document.querySelector('.card-lists');
        // ciblage du bouton pour ajouter une carte dans la liste
        const button = newList.querySelector('.add-card-button');
        listContainer.append(newList);
        app.hideModals();
        // listener après la création de la liste
        button.addEventListener('click', app.showAddCardModal);
    },

    // params regroupés dans objet "card"
    makeCardInDOM: function(card){
        const cardTemplate = document.getElementById('template-card');
        const templateCardContent = cardTemplate.content;
        const newCard = document.importNode(templateCardContent, true);
    
        const newCardContent = newCard.querySelector('.content');
        newCardContent.textContent = card.content;
    
        const listContainer = document.querySelector('[list-id="'+card.list_id+'"] .panel-block');
        const cardBox = newCard.querySelector('.box');
        cardBox.style.backgroundColor = card.color;
        
        listContainer.append(newCard);
    
        app.hideModals();
    },
  
    showFormToEditTitle: function(event) {
        // pour recup le titre double-cliqué
        const currentTitle = event.target;
        // pour cacher le titre double-cliqué
        currentTitle.classList.add('is-hidden');
        // pour afficher le form à la place -> nextSibling sélectionne l'élément suivant du DOM
        const showForm = currentTitle.nextElementSibling;
        showForm.classList.remove('is-hidden');
    },

    handleEditListForm: async function(event) {
        try {
            event.preventDefault();

            const formData = new FormData(event.target);
            // ne pas oublier d'ajouter l'id de la route pour modifier la liste
            const response = await fetch(`${app.base_url}/lists/${formData.get('id')}`, {
                method: 'PATCH',
                body: formData
            });

            const newListOrError = await response.json();
            
            if(response.status !== 200){
                throw Error(newListOrError);
            }

            // doublon quand on modifie le titre avec :
            // app.makeListInDOM(newListOrError.name, newListOrError.id);
            // il faut directement modifier le nom via les données envoyées dans le formulaire
            // donc on récup le code de showFormToEditTitle et on inverse
            const currentList = event.target.closest('.panel');
            const currentTitle = currentList.querySelector('h2');
            currentTitle.textContent = newListOrError.name;
            currentTitle.classList.remove('is-hidden');
            const showForm = currentTitle.nextElementSibling;
            showForm.classList.add('is-hidden');

        } catch (error) {
            alert('désolé, une erreur est survenue..');
            console.error(error);
        }
    },
};
  
    // Ecouteur d'évènement sur le doc : quand le chargement est terminé -> app.init
    document.addEventListener('DOMContentLoaded', app.init );