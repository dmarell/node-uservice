// BASE SETUP
// =============================================================================

// needed packages
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to console

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080; // Server port
var mongoHost = "localhost"; // mongo db hostname

var environment = app.get('env');
console.log('Environment: ' + environment);
if (environment === 'production') {
    //app.use(express.errorHandler());
    mongoHost = "mongo"
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + mongoHost + ':27017/node-uservice-db'); // connect database
var Bear = require('./models/bear');

// API ROUTES
// =============================================================================

// create router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'Welcome! node-uservice is available below /api'});
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function (req, res) {

        var bear = new Bear();		// create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        bear.save(function (err) {
            if (err)
                res.send(err);


            res.json({message: 'Bear created! name: ' + bear.name});
        });


    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id
    .put(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;
            bear.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'Bear updated!'});
            });

        });
    })

    // delete the bear with this id
    .delete(function (req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });


// REGISTER ROUTES -------------------------------
app.use('/api', router);

// START SERVER
// =============================================================================
app.listen(port);
console.log('Server is up on port ' + port);
