var express = require('express');
var router = express.Router();
var config = require('./config');

// Application specific endpoints
module.exports = function (app) {
    var Bear = require('./models/bear');
    // ----------------------------------------------------
    // on routes that end in /bears
    router.route('/bears')

        // create a bear (accessed at POST http://localhost:9090/bears)
        .post(function (req, res) {

            var bear = new Bear();		// create a new instance of the Bear model
            bear.name = req.body.name;  // set the bears name (comes from the request)

            bear.save(function (err) {
                if (err)
                    res.send(err);


                res.json({message: 'Bear created! name: ' + bear.name});
            });
        })

        // get all the bears (accessed at GET http://localhost:9090/api/bears)
        .get(function (req, res) {
            Bear.find(function (err, bears) {
                if (err)
                    res.send(err);

                res.json(bears);
            });
        });

    // ----------------------------------------------------
    // on routes that end in /bears/:bear_id
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


    // Register routes
    app.use('/', router);

};