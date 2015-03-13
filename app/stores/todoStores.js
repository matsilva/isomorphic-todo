var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = "change";

var _store = {
  list: [],
  addItem: function(item) {
    this.list.push(item);
  }
};

var addItem = function(item) {
  _store.list.push(item);
};

var removeItem = function(i) {
  _store.list.splice(i,1);
};

var todoStore = objectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {

    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback) {

    this.removeListener(CHANGE_EVENT, callback);
  },

  getList: function() {

    return _store.list;
  }

});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch (action.actionType) {

    case appConstants.ADD_ITEM:
      _store.addItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;

    case appConstants.REMOVE_ITEM:
      removeItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
  }
});

module.exports = todoStore;
