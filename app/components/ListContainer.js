var React = require('react');
var AddItem = require('./AddItem');
var List = require('./List');
var todoStore = require('../stores/todoStores');
var todoActions = require('../actions/todoActions');

var ListContainer = React.createClass({
    getInitialState: function() {
        return {
            list: todoStore.getList()
        };
    },
    handleAddItem: function(item) {
        todoActions.addItem(item);
    },
    handleRemoveItem: function(i) {
        //TODO need to add removeAction
    },
    _onChange: function() {
        this.setState({
            list: todoStore.getList()
        });
    },
    componentDidMount: function() {
        todoStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        todoStore.removeChangeListener(this._onChange);
    },
    render: function() {
		return (
			<div className="col-sm-6 col-md-offset-3">
                <div className="col-sm-12">
                    <h3 className="text-center"> Todo List </h3>
                    <AddItem add={this.handleAddItem}/>
                    <List items={this.state.list} remove={this.handleRemoveItem}/>
                </div>
			</div>
		);
	}
});

module.exports = ListContainer;
