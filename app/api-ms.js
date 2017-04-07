// Micro service standard endpoints
var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var router = express.Router();
var mongoose = require('mongoose');

var allowCrossDomain = function (req, res, next) {
    var origin = req.get('origin');
    if (config.allowedOrigins && config.allowedOrigins.indexOf(origin) != -1) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }
    next();
};

module.exports = function (app) {
    // configure body parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(allowCrossDomain);

    // Build number
    router.get('/version', function (req, res) {
        res.json({
            value: process.env.VERSION || "dev-build",
            deployed: process.env.DEPLOY_TIMESTAMP
        });
    });

    // Health check
    router.get('/health', function (req, res) {
        var result = {
            ok: true
        };

        // DB connection state
        result.ok = mongoose.connection.readyState == 1;
        if (result.ok === false) {
            var stateStr = "connected";
            switch (mongoose.connection.readyState) {
                case 1:
                    // no error
                    break;
                case 0:
                    stateStr = "disconnected";
                    break;
                case 2:
                    stateStr = "connecting";
                    break;
                case 3:
                    stateStr = "disconnecting";
                    break;
                case 4:
                    stateStr = "unauthorized";
                    break;
                case 99:
                    stateStr = "uninitialized";
                    break;
            }
            if (!result.errors) result.errors = []
            result.errors.push("DB:" + stateStr);
        }

        res.json(result);
    });

    // test route to make sure everything is working (accessed at GET http://localhost:9090/)
    router.get('/', function (req, res) {
        res.json({message: 'Welcome to node-uservice API'});
    });

    // Register routes
    app.use('/', router);
};