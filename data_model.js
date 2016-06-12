"use strict";

window.horello = window.horello || {};

horello.generateId = function() {
  var chunk = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return chunk() + chunk() + '-' + chunk() + '-' + chunk() + '-' +
    chunk() + '-' + chunk() + chunk() + chunk();
};

// CARD

horello.Card = function(id, title, desc, listId) {
  this.id = id;
  this.listId = listId;
  this.title = title;
  this.desc = desc;
};

horello.Card.prototype = {
  getId: function() {
    return this.id;
  },

  getTitle: function() {
    return this.title;
  },

  setTitle: function(titleStr) {
   $.ajax('https://api.trello.com/1/cards/' + this.id + '', {
       data: {
           key: 'ab3e895cad67a947ad0fcc93d33fc689',
           token: '3f8ac1459d8885b64edf0259a2af87b4eb6f964599cd19143a378479dd2796d5',
           name: titleStr
        },
       method: 'PUT'
   })
  },

  getDescription: function() {
    return this.desc;
  },

  setDescription: function(desc) {
     $.ajax('https://api.trello.com/1/cards/' + this.id + '', {
       data: {
           key: 'ab3e895cad67a947ad0fcc93d33fc689',
           token: '3f8ac1459d8885b64edf0259a2af87b4eb6f964599cd19143a378479dd2796d5',
           desc: desc
        },
       method: 'PUT'
   })
  },

  render: function() {
    // build wrappers
    var wrapper = $('<div></div>');
    var cardwrapper = $('<div class="card" data-list-id="'+this.listId+'" data-card-id="'+this.id+'"></div>');
    var cardmore = $('<span class="card-more"></span>');
    if (this.getDescription()) {
      cardmore.append($('<span class="glyphicon glyphicon-align-left"></span>'));
    }
    var cardbody = $('<div class="card-body">'+this.title+'</div>');

    wrapper.append(cardwrapper);
    cardwrapper.append(cardmore);
    cardwrapper.append(cardbody);
    cardbody.append($("<p></p>")).text(this.title);

    return wrapper.html();
  }
};

horello.Card.fromJSON = function(data) {
  var doge = new horello.Card(data.id, data.name, data.desc, data.idList);
    return doge;
};


// LIST

horello.List = function(id, name, cards) {
  this.id = id;
  this.name = name;
  this.cards = [];
};

horello.List.prototype = {
  getId: function() {
      return this.id;
  },

  getName: function() {
    return this.name;
  },

  setName: function(name) {
     $.ajax('https://api.trello.com/1/lists/' + this.id + '', {
       data: {
           key: 'ab3e895cad67a947ad0fcc93d33fc689',
           token: '3f8ac1459d8885b64edf0259a2af87b4eb6f964599cd19143a378479dd2796d5',
           name: name
        },
       method: 'PUT'
   })
  },

  addCard: function(name, desc) {
      $.ajax('https://api.trello.com/1/cards/', {
       data: {
           key: 'ab3e895cad67a947ad0fcc93d33fc689',
           token: '3f8ac1459d8885b64edf0259a2af87b4eb6f964599cd19143a378479dd2796d5',
           listId: this.id,
           due: null,
           name: name,
           desc: desc,
           idList: this.id
        },
       method: 'POST',
       solution: function(response){
       this.cards.push(response);
       }
   })
      board.load();
    return card.getId();
  },

  getCard: function(cardId) {
    var card = this.cards.filter(function(c) {
      return (c.getId() == cardId);
    });
    if (card.length > 0) {
      return card[0];
    }
    return null;
  },

  render: function() {
    // Build wrappers
    var wrapper = $('<div></div>');

    var listContainer = $('<div class="list-container"></div>');
    var listWrapper = $('<div class="list" id="'+this.id+'"></div>');
    var listHeader = $('<div class="list-header"></div>');
    var listBody = $('<div class="list-cards"></div>');
    var listFooter = $('<div class="list-footer"></div>');

    wrapper.append(listContainer);
    listContainer.append(listWrapper);
    listWrapper.append(listHeader);
    listWrapper.append(listBody);
    listWrapper.append(listFooter);
    listHeader.append($('<span class="list-title"></span>').text(this.name));
    listFooter.append($('<button class="add-card" addCardId="'+this.id+'">Add a card...</button>'));
    listFooter.append($('\
      <div class="collapse" id="addCardForm'+this.id+'">\
      <div class="well add-card-form">\
      <input type="text" class="form-control" placeholder="Card title" id="addCardTitle'+this.id+'">\
      <button type="button" class="btn btn-default" id="addCardBtn'+this.id+'">\
      Save\
      </button>\
      <button type="button" class="btn btn-default">\
      <span class="glyphicon glyphicon-remove" id="addCardCancelBtn'+this.id+'"></span>\
      </button>\
      </div>\
      </div>\
    '));

    // Build cards in the body
    listBody.html(this.cards.reduce(function(prev, cur) {
      return prev + cur.render();
    }, ""));

    return wrapper.html();
  }
};

horello.List.fromJSON = function(data) {
   var doge2 = new horello.List(data.id, data.name, data.cards);
    return doge2;
};


// BOARD

horello.Board = function () {
  this.lists = [];
};

horello.Board.prototype = {
  addList: function(listName) {
     debugger;
      $.ajax('https://api.trello.com/1/lists/', {
       data: {
           key: 'ab3e895cad67a947ad0fcc93d33fc689',
           token: '3f8ac1459d8885b64edf0259a2af87b4eb6f964599cd19143a378479dd2796d5',
           name: listName,
           idBoard: '573b41293e57e519647cf5b1'
        },
        method: 'POST',
       success: function(response){
        board.load();
        return response.id;
       }
    })
  },

  getList: function(listId) {
    return this.lists.find(function(c) {
      return (c.getId() == listId);
    });
  },

  render: function() {
    var wrapper = $('<div id="board" class="board"></div>');
    wrapper.html(this.lists.reduce(function(prev, cur) {
      return prev + cur.render();
    }, ""));
    return wrapper;
  }

};

horello.Board.prototype.load = function(){
   
    board.lists = [];
    $.ajax('https://api.trello.com/1/boards/573b41293e57e519647cf5b1/lists', {
        data: {
            key: horello.apiKey,
            token: horello.apiToken
        }, method: 'GET',
        
        success: function(response){
           response.forEach(function(item){
            var dogey = horello.List.fromJSON(item);
                board.lists.push(dogey);
                $.ajax('https://api.trello.com/1/lists/' + dogey.id + '/cards', {
                    data: {
                        key: horello.apiKey,
                        token: horello.apiToken
                    }, method: 'GET',
                
                    success: function(response) {
                        response.forEach(function(item){
                        var dogey2 = horello.Card.fromJSON(item);
                        dogey.cards.push(dogey2);
                        horello.mount(board);
                        })
                    }
                })
            })
        }
    })
    
    console.log(board);
}