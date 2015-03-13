# TodoFlux

####Objectives
The purpose of this project is to get your feet wet with the Flux way of doings things. We're going to recreate the todo list we built in the mini project on day one but with Flux this time (This is the last time we're rebuilding this, pinky promise).

As an overview, the process for Flux goes something like this
**(1) A user initiates some event, (2) that event invokes an action (3) which then triggers the dispatcher. The dispatcher then (4) dispatches an event which (5) is then caught by the Stores who subscribe to those events. The Store then (6) calls some internal setter method which alters its internal state, then the Store (7) emits a change event which brings us full circle back to the (8) view which updates its own internal state.**.

####Step 1: Grab the Original Todo List

* Download your original todo list app for the Mini Project we did on day 1. *If for some reason you don't have this project, clone the original project [HERE](https://github.com/ReactWeek/mini1-todolist) then use ```git checkout solution``` to get the solution.
* In the root of this project in your terminal run ```rm -rf .git``` to remove all the Git stuff from the project.
* Fork this page and then run ```git init``` then ```git remote add origin https://github.com/YOUR_USERNAME/mini4-todoflux.git``` to add your fork as a remote.
* Head over to the ```package.json``` file and replace what's there with this,
```javascript
{
  "name": "mini-todoflux",
  "version": "1.0.0",
  "description": "",
  "main": "App.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/ReactWeek/mini4-todoflux"
  },
  "author": "Tyler McGinnis",
  "dependencies": {
    "events": "^1.0.2",
    "flux": "^2.0.1",
    "react": "0.12.1"
  },
  "devDependencies": {
    "jsx-loader": "^0.12.2",
    "webpack": "^1.5.3"
  }
}
```
* then run ```npm install```. That will give us some helper libraries to use with Flux.

####Step 2: Folder Structure

Now we need to make our folder structure more Flux like.

* Add the following folders inside of the ```app``` folder
  - actions
  - components
  - constants
  - dispatcher
  - stores

* Move the ```AddItem.js```, ```List.js``` , and the ```ListContainer.js``` component inside the components folder. 
* In ```App.js``` modify ```require('./ListContainer')``` to be the new path, ```require('./components/ListContainer')```
* Head over to your newly created constants folder and inside of it create a file called ```appConstants.js```. 
* Inside ```appConstants.js``` create an object called ```appConstants``` and then export that object.

####Step 3: Dispatcher

The Dispatcher is going to receive actions and then broadcast payloads to any callback which is registered to that action. This will make more sense when we start building out our app.

* Inside the ```dispatcher``` folder create a file called ```AppDispatcher.js```

Anytime an event occurs, an action will invoke our dispatcher passing it what action occurred. Our dispatcher will then broadcast an event and then any events subscribed to that specific event will invoke some setter function. There is one global dispatcher per app. Add the following code to your newly created ```AppDispatcher.js``` file.

```javascript
var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

AppDispatcher.handleAction = function(action){
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

module.exports = AppDispatcher;
```

Notice all it does it take in some action then dispatches that action. 

####Step 4: Stores

The nice thing about Flux is you really have to think about the organization and structure of your application before you start hacking away. When you finish building out your Stores, you'll know a few things about your application. You'll know your data schema, your action types, and your app constants. Once you know this information, the rest of your app will simply be built to support it. This makes starting off building your stores the easy choice when building a flux application.

Our todolist App is just going to have one store which will manage the todo list array.

* Inside of the stores folder create a file called ```todoStore.js```. 

Each store usually requires a few things.
* Require your AppDispatcher in the ```dispatcher/AppDispatcher``` folder
* Require your appConstants in the ```constants/appConstants``` folder
* Require EventEmitter using ```require('events').EventEmitter```. *EventEmitter will allow us to emit changes from our Store and listen for those changes in our Components*
* Require objectAssign which can be found at ```react/lib/Object.assign```. *objectAssign allows us to extend an object with another object. We'll use it to give our todoStore object the ability to emit events by extending it (or copying properties) with the EventEmitter*
* create a variable called ```CHANGE_EVENT``` and set it equal to the string 'change'. This "constant" will be used as the variable we emit when some internal data in the store changes.

Remember, the purpose of a "store" is to really just keep track of some data. Every property in the store is in some way dealing with the store's data.

What's great about flux is that "data" is really just some native JavaScript datatype (usually an object). 

* Create a variable called ```_store``` and set it equal to an object with a ```list``` property whose value is an empty array. 

At this point your todoStore should look like this.
```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};
```

Now that we have our store, let's create some functions which will be in charge of manipulating the store.

* Create an ```addItem``` function which takes in an item as its only parameter and adds that item to our ```list``` in the store.
* Create a ```removeItem``` function which takes in an index as its only parameter and removes the item in that specific index from the ```list``` array in our store. 

Now that our setter functions are done, let's create our actual Store.

To do this, as mentioned earlier, we're going to use objectAssign. From the objectAssign docs, here's some more info about it.

```
var newObject = objectAssign(target, source, [source, ...])

Assigns enumerable own properties of source objects to the target object and returns the target object. Additional source objects will overwrite previous ones.
```

The source is going to be an object with properties we want our store to have, and the result be an object with all of those properties combined. So, our target will be an empty object and the sources will be the ```EventEmitter.prototype``` object, and an object with all of the properties we want to store to have. We're essentially creating an object which has properties we define as well as all properties that are on the ```EventEmitter.prototype``` object (which are things like emit and on).

* Use objectAssign to create a new object called todoStore which extends EventEmitter and has the following properties.
  - An ```addChangeListener``` method which takes in a callback function as its only parameter and then invokes the ```on``` method which was originally on EventEmitter.prototype passing it the change event variable we defined earlier as well as the callback which was passed in.
  - A ```removeChangeListener``` method which takes in a callback function as its only parameter and then invokes the ```removeListener``` method which was originally on EventEmitter.prototype passing it the change event variable we defined earlier as well as the callback which was passed in.
  - A ```getList``` method which returns the ```list``` property on our ```_state``` object.

I know that got a little wordy. Here's what that last addition should look like,
```javascript
var todoStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  getList: function(){
    return _store.list;
  }
});
```

One thing to note is the ```todoStore``` itself only has getter methods. The ```todoStore``` object is what we're going to be exporting from this file and we don't want to be able to manipulate any data from calling a property on it. That's not the flux way of doing things. Instead, we'll use our store to get the internal data and then add some listeners so when that internal state changes, our view will reset the state of the component (as we'll see in a little bit).

Now the last thing we need to do is register actions with our Store so our Store will be able to listen for certain signals dispatched by the dispatcher. Remember the process for Flux goes like this, **(1) A user initiates some event, (2) that event invokes an action (3) which then triggers the dispatcher. The dispatcher then (4) dispatches an event which (5) is then caught by the Stores who subscribe to those events. The Store then (6) calls some internal setter method which alters its internal state, then the Store (7) emits a change event which brings us full circle back to the (8) view which updates its own internal state.**.

So our Store is responsible for numbers 5 - 7. We've created the ability to do number 6 and 7, but we still haven't had our Store subscribe to any events (5). Let's do that right now.

What you might have the thought of doing initially is to register the Dispatcher actions on the actual Store itself. In our example above, something like this ```todoStore.register(function...)```, however, that's not how it works. You register your action's listeners on the Dispatcher itself. This makes sense if you think of it as the Dispatcher is the one dispatching the event, so it could also be the one who registers what functionality will be invoked when those dispatches are received.

* Use ```AppDispatcher.register``` and pass in a function that receives "payload" as its only parameter. *This payload is going to have an ```action``` property which has an "actionType" property and a "data" property (which was specified when we dispatched the event)*.
* Inside our callback function, create a variable called ```action``` which gets assigned the value of ```payload.action```.
* Create a switch statement which is checking the ```action.actionType``` value.

Earlier I mentioned how in order to build out your stores, you'll need to know the action types that your app is going to use. In the case of our todoStore, let's brainstorm some actions which will be happening. The user needs the ability to get add a new item to the todolist and remove an item from the todolist. Let's now create two constants which will represent those two actions.

* Head over to your constants folder and find the file you created earlier called ```appConstants.js```.
* In the appConstant object you created earlier, create the following keys value pairs
  - ADD_ITEM: "ADD_ITEM"
  - REMOVE_ITEM: "REMOVE_ITEM"

Now anytime we want to represent any of the Todo list actions we mentioned above, we can use these constants to be consistent throughout our application.

Head back over to the ```todoStore.js``` file and inside the switch statement create the following cases.
 - ```appConstants.ADD_ITEM``` which will call the ```addItem``` setter function we created earlier and pass it ```action.data``` then invoke ```todoStore.emit``` and pass it the change event variable we created at the top of the file.
 - ```appConstants.REMOVE_ITEM``` which will call the ```removeItem``` setter function we created earlier and pass it ```action.data``` then emit that a change occurred.
 - Have the default case just return true

*One thing to note is that when a change occurred, we're not emitting what that change was, we're only emitting that a change occurred. Our view doesn't care about what changed, it just cares that something did change. With the power of the virtual DOM we can just tell our view to rerender every time there is a change without performance worries.*

* Use module.exports to export the todoStore.

Your ```todoStore.js``` file should now look like this.

```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

var addItem = function(item){
  _store.list.push(item);
};

var removeItem = function(index){
  _store.list.splice(index, 1);
}

var todoStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  getList: function(){
    return _store.list;
  },
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.ADD_ITEM:
      addItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.REMOVE_ITEM:
      removeItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = todoStore;
```

If it hasn't quite "clicked" yet, maybe this will help. 

Let's walk through exactly what our app will do when someone types in a new todolist item and then hits the "submit" button.

1) When the user clicks on the "Submit" button, a method in the component will get invoked.
2) This method will then invoke another method in our "actions" folder which we'll create next. 
3) This "action" method will then invoke the ```handleAction``` method we created earlier in our ```AppDispatcher.js``` file and that method will then "dispatch" a specific action, in this case the "ADD_ITEM" action. 
4) Our switch statement in the todoStore.js file will notice that the "ADD_ITEM" event has been broadcasted and then it will invoke the ```addItem``` method passing it the new data. ```addItem``` will run which will add the new item to our ```_store.list``` array. 
5) "change" will get emitted 
6) The ```todoStore``` will notice that a "change" has been emitted and it will run the on change callback it got earlier from the view (which we haven't done yet) which will use ```setState``` to update the state with the data it gets from calling ```todoStore.getList()```. And we've come full circle.

This seems like a lot, that's because it is. The real benefits of Flux won't be seen with a small application like this but once your Apps start getting bigger and become more data intensive, you'll be glad you're using Flux.

####Step 5: Actions

* Head over to your ```actions``` folder and create a new file called ```todoActions.js```. 

The method we specify here will kind of be the mediator between the component and the dispatcher. 

* Require ```AppDispatcher``` and ```appConstants```.
* Create an object called ```todoActions``` which has a ```addItem``` method which accepts an item as its only parameter and a ```removeItem``` method which accepts an index as its only parameter.
* at the end of the file export the ```todoActions``` object.

* Inside of ```addItem``` method invoke the ```handleAction``` method on ```AppDispatcher``` and pass it an object with the following properties and values
  - actionType: appConstants.ADD_ITEM,
  - data: item

* Do the same thing as above for removeItem but instead of ```ADD_ITEM``` have ```REMOVE_ITEM``` and instead of ```item``` have ```index```.

Your full ```todoActios.js``` file should look like this.
```javascript
var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var todoActions = {
  addItem: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ITEM,
      data: item
    });
  },
  removeItem: function(index){
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_ITEM,
      data: index
    })
  }
};

module.exports = todoActions;
```

####Step 6: Components

Now that are stores and actions are created, we now just need to tie those to our components. 

The only component we're going to modify is the ```listContainer``` component because that's the component which is managing the list itself.

* At the top of the file after you require the ```List``` component also require ```todoStore``` and ```todoActions```.
* Inside of ```getInitialState``` instead of the value of ```list``` being an empty array, have it be the result invocation of ```todoStore.getList()```. *Notice that since we moved the data out of this component into a store, we need to call out getter method on the store to get that data.*
* Inside of ```handleAddItem``` remove the code that's there and replace it with ```todoActions.addItem(newItem)```. *so now instead of manipulating the state here, we'll invoke an action, which will send off a dispatch, which will update the store.
* Inside of ```handleRemoveItem``` remove the code that's there and replace it with ```todoActions.removeItem(index)```. 

We're almost done. Now the only piece that's missing is when our store changes and emits a "change" event, we will have needed to tell our view what to do when that happens in order for our state to udpate. The way we're going to do this is to take advantage of the ```addChangeListener``` method we built in our store earlier. If we pass this a method which will update the components state, then whenever our store hears the "change" broadcast, the component will update its state by refetching the data from the store. Let's see what that looks like.

* First create a method called ```_onChange``` which calls ```setState``` and sets ```list``` to whatever ```todoStore.getList()``` returns.
* Now, when ListContainer mounts, you'll need to invoke ```addChangeListener``` on the ```todoStore``` object passing it ```this._onChange```.

Now, whenever the store hears a "change" broadcast, the ListContainer component will refetch the data from the store and update its internal state. 

* The very last thing you need to do is make sure that when the component unmounts, you remove the change listener you attached earlier. That code looks like this
```javascript
componentWillUnmount: function(){
  todoStore.removeChangeListener(this._onChange);
}
```

Which makes the full ListContainer component look like this,
```javascript
var React = require('react');
var AddItem = require('./AddItem');
var List = require('./List');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');

var ListContainer = React.createClass({
  getInitialState: function(){
    return {
      list: todoStore.getList()
    }
  },
  componentDidMount: function(){
    todoStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    todoStore.removeChangeListener(this._onChange);
  },
  handleAddItem: function(newItem){
    todoActions.addItem(newItem);
  },
  handleRemoveItem: function(index){
    todoActions.removeItem(index);
  },
  _onChange: function(){
    this.setState({
      list: todoStore.getList()
    })
  },
  render: function(){
    return (
      <div className="col-sm-6 col-md-offset-3">
        <div className="col-sm-12">
          <h3 className="text-center"> Todo List </h3>
          <AddItem add={this.handleAddItem}/>
          <List items={this.state.list} remove={this.handleRemoveItem}/>
        </div>
      </div>
    )
  }
});

module.exports = ListContainer;
```

I hope that this mini project has helped you wrap your head around the Flux way of doing things. The nice thing is once you get it, looking at any Flux project will make sense very quickly because they're all organized in the same manner. 
