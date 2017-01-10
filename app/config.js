// Environment specific configurations
var mongoUrl;

if (process.env.NODE_ENV === 'prod') {
    mongoUrl = 'mongodb://mongodb:27017/node_uservice_prod';
} else if (process.env.NODE_ENV === 'stage') {
    mongoUrl = 'mongodb://mongodb:27017/node_uservice';
} else if (process.env.NODE_ENV === 'it') {
    mongoUrl = 'mongodb://mongodb:27017/node_uservice';
} else {
    mongoUrl = 'mongodb://localhost:27017/node_uservice';
}

module.exports = {
    mongoUrl: mongoUrl
};
