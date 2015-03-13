var React = require('react');

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
                <div className="row" dangerouslySetInnerHTML={{__html: this.props.html}} />
              </div>
            </div>
                <script src="bundle.js"></script>
          </body>
          </html>
		);
	}

});

module.exports = ListApp;
