var React = require('react');
var ListContainer = require('./ListContainer');
var ListFactory = React.createFactory(ListContainer);

var ListApp = React.createClass({
	render: function() {
		return (
      <html>
        <head>
          <title>{this.props.metaTitle || "Isomorphic Todo"}</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"></link>
        </head>
      <body>
        <div id="app">
          <div className="container">
            <div className="row">
              {React.renderToString(ListFactory())}
            </div>
          </div>
        </div>
			<script src="bundle.js"></script>
      </body>
      </html>
		);
	}

});

module.exports = ListApp;
