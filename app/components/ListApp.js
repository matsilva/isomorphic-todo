var React = require('react');

var ListApp = React.createClass({
	render: function() {
    var Child = require(this.props.child);
    var ChildFactory = React.createFactory(Child);
    console.log(this.props.child);
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
              {React.renderToString(ChildFactory())}
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
