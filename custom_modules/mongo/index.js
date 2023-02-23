const config = require("../configuration/app");
const mongodb = require('mongodb').MongoClient;
var _db = false;

function connect(fn) {
    mongodb.connect(config.dbConnectionString + config.dbName, { useUnifiedTopology: true }, function (err, database) {
        if (err) throw err;
        _db = database.db();
        fn();
    });
};

function getDB() {
    return _db;
}

module.exports = { connect, getDB }