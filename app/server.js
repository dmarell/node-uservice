// Application entrypoint
var app = require('express')();
var mongoose = require('mongoose');
var morgan = require('morgan');
var config = require('./config');
require('./api-ms')(app); // configure api default routes
require('./api-app')(app); // application specific API
require("console-stamp")(console, {pattern: "yyyy-mm-dd HH:MM:ss.l"});

if (process.env.NODE_ENV !== 'stage' && process.env.NODE_ENV !== 'prod') {
    app.use(morgan('dev')); // log requests to console
}

var port = 9090; // Server port

var environment = app.get('env');
console.log('Environment: ' + environment);

mongoose.connect(config.mongoUrl); // connect database

// Start server
app.listen(port);
console.log('Server is up on port ' + port);
