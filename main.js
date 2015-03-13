var express = require('express');
var app = express();
var React = require('react');

require('node-jsx').install();

var ListApp = require('./app/components/ListApp');
var MyApp = React.createFactory(ListApp);
var ListContainer = require('./app/components/ListContainer');
var ListFactory = React.createFactory(ListContainer);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {

  res.setHeader('Content-Type', 'text/html');
  res.write("<!DOCTYPE html>");
  //Renders without React IDS
  res.end(React.renderToStaticMarkup(MyApp(
      {html: React.renderToString(ListFactory())
  })));	

});

app.get('/titlefromserver', function(req,res) {

  res.setHeader('Content-Type', 'text/html');
  res.write("<!DOCTYPE html>");
  //Renders without React IDS
  res.end(React.renderToStaticMarkup(MyApp({
      metaTitle: "TitleFromServer",
      html: React.renderToString(ListFactory())
  })));	

});

app.listen(3333);
console.log("Server running at, localhost:3333");
