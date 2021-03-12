const app = {

    init: function () {
        console.log('app.init !');
        app.addListenerToActions();
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

    handleAddListForm: function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        // console.log(formData.get('name'));
        app.makeListInDOM(formData.get('name'));
    },

    handleAddCardForm: function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        app.makeCardInDOM(formData.get('content'), formData.get('list_id'));
    },

    makeListInDOM: function(listName) {
        const templateList = document.getElementById('template-list');
        const templateListContent = templateList.content;
        // Création d'un nouvel objet DOM (clone) à partir du fragment de document récupéré précédemment
        const newList = document.importNode(templateListContent, true);
        const listTitle = newList.querySelector('h2');
        listTitle.textContent = listName;
        const listContainer = document.querySelector('.card-lists');
        // ciblage du bouton pour ajouter une carte dans la liste
        const button = newList.querySelector('.add-card-button');
        listContainer.append(newList);
        app.hideModals();
        // listener après la création de la liste
        button.addEventListener('click', app.showAddCardModal);
    },

    makeCardInDOM: function(cardDescription, listId){
        const cardTemplate = document.getElementById('template-card');
        const templateCardContent = cardTemplate.content;
        const newCard = document.importNode(templateCardContent, true);
    
        const newCardContent = newCard.querySelector('.content');
        newCardContent.textContent = cardDescription;
    
        const listContainer = document.querySelector('[list-id="'+listId+'"] .panel-block');
        listContainer.append(newCard);
    
        app.hideModals();
      },
  
  };
  
  // Ecouteur d'évènement sur le doc : quand le chargement est terminé -> app.init
  document.addEventListener('DOMContentLoaded', app.init );