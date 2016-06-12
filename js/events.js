"use strict";



window.horello = window.horello || {};

horello.mountStatic = function() {

  $('.add-list').click(function(e) {
    $('#addList').collapse('toggle');
  });

  $('#addList').on('shown.bs.collapse', function (e) {
    $('#addListText').focus();
  });

  $('#addListSave').click(function(e) {
    var listName = $('#addListText').val();
    // validate input
    if (!listName) {
      alert("Please enter a list name");
      return;
    }
    board.addList(listName);
    $('#addListText').val('');
    $('#addList').collapse('toggle');
    horello.mount(board);
  });

  $('#addListCancel').click(function(e) {
    $('#addList').collapse('hide');
  });

  $('#cardEdit').on('show.bs.modal', function (e) {
    var button = $(e.relatedTarget);
    var cardId = button.data('card-id');
    var listId = button.data('list-id');
    var list = board.getList(listId);
    var card = list.getCard(cardId);
    $('#modalText').val(card.getTitle());
    $('#modalBody').val(card.getDescription());
    $('#modalSave').data('list-id', listId);
    $('#modalSave').data('card-id', cardId);
  });

  $('#modalSave').click(function (e) {
    var title = $('#modalText').val();
    var desc = $('#modalBody').val();
    if (!title) {
      alert('Please enter a title');
      return;
    }

    var listId = $(e.currentTarget).data('list-id');
    var cardId = $(e.currentTarget).data('card-id');
    var list = board.getList(listId);
    var card = list.getCard(cardId);
    card.setTitle(title);
    card.setDescription(desc);
    $('#cardEdit').modal('hide');
    board.load();
    horello.mount(board);
  });
};

// This function is called multiple times, to configure dynamic events.
horello.mount = function (board) {
 

  // Unrender and re-render the board
  $('#boardAnchor').empty();
  $('#boardAnchor').append(board.render());

  $('.add-card').each(function (idx) {
    $(this).off();

    var id = $(this).attr('addCardId');

    // Open add card form
    $(this).click(function (e) {
      $('#addCardForm'+id).collapse('toggle');
    });

    $('#addCardForm'+id).off();
    $('#addCardForm'+id).on('shown.bs.collapse', function(e) {
      $('#addCardTitle'+id).focus();
    });

    // Save new card
    $('#addCardBtn'+id).off();
    $('#addCardBtn'+id).click(function (e) {
      var val = $('#addCardTitle'+id).val();
      if (!val) {
        alert('Please enter a card title');
        return;
      }

      // Get the list object
      var list = board.getList(id);
      list.addCard(val);
      horello.mount(board);
    });

    // Cancel
    $('#addCardCancelBtn'+id).off();
    $('#addCardCancelBtn'+id).click(function (e) {
      $('#addCardForm'+id).collapse('hide');
    });
      

  });

  $('.card').each(function (idx) {
    $(this).off();
    $(this).click(function (e) {
      $('#cardEdit').modal('toggle', $(this));
    });
  });
};
