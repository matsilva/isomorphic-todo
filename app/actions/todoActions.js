var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var todoActions = {

  addItem: function(item) {

    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ITEM,
      data: item
    });

  },
  
  removeItem: function(i) {

    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_ITEM,
      data: i
    });

  }
};

module.exports = todoActions;
