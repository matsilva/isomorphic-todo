var express = require('express');
var app = express();
var React = require('react');

require('node-jsx').install();

var ListApp = require('./app/components/ListApp');
var MyApp = React.createFactory(ListApp);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {

  res.setHeader('Content-Type', 'text/html');
  res.write("<!DOCTYPE html>");
  //Renders without React IDS
  //Needs to be relative to the component
  res.end(React.renderToStaticMarkup(MyApp({child: './ListContainer'})));	

});

app.get('/titlefromserver', function(req,res) {

  res.setHeader('Content-Type', 'text/html');
  res.write("<!DOCTYPE html>");
  //Renders without React IDS
  //Needs to be relative to the component
  res.end(React.renderToStaticMarkup(MyApp({
    metaTitle: "TitleFromServer",
    child: "./ListContainer2"
  })));	

});

app.listen(3333);
console.log("Server running at, localhost:3333");
