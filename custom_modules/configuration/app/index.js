const process = require('process');
const root = process.cwd();

module.exports = {
    port: 4000,
    root: root,
    host_url: 'http://localhost:3000',
    dbConnectionString: 'mongodb://localhost:27017/',
    dbName: 'booksdir',
    booksCollection: 'library',
    usersCollection: 'users',
    logsCollection: 'logs',
    storeCollection: 'sessions',
    secret: 'badook',
    sessionExpDate: 24*60*60*1000 // time in milliseconds
}