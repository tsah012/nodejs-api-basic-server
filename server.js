const config = require("./custom_modules/configuration/app");
const passportConfiguration = require('./custom_modules/configuration/passport/local');
const usersRouter = require("./custom_modules/routers/users");
const adminRouter = require('./custom_modules/routers/admin');
const auth = require('./custom_modules/routers/authMiddlewares');
const appAuthorization = require('./custom_modules/routers/appAuthentication');
const usersDAL = require('./custom_modules/DAL/users');
const mongo = require('./custom_modules/mongo');
const dbLogger = require('./custom_modules/logger');

const path = require('path');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');


const server = express();

const mongoSessionStore = new MongoDBStore({
    uri: config.dbConnectionString + config.dbName,
    collection: config.storeCollection
});

server.use(cors({ origin: config.host_url, credentials: true, optionsSuccessStatus: 200 }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(express.static(path.join(config.root, 'client')));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(flash());
server.use(session({
    secret: config.secret,
    // resave = save session in case nothing is changed. no need, therefore is false
    resave: false,
    // saveUninitialized = initialize session even if there is no data to store
    saveUninitialized: true,
    store: mongoSessionStore,
    cookie: {
        maxAge: config.sessionExpDate
    }
}));

server.use(passport.initialize());
server.use(passport.session());
passportConfiguration.configure(passport);

// routers
server.use(appAuthorization);
server.use('/api', usersRouter);
server.use('/admin', adminRouter);

// server.get("/", auth.isAuth, function (req, res) {
//     res.sendFile(path.join(config.root, 'client/pages/home/index.html'));
// });

// server.get('/library', auth.isAuth, async function (req, res) {
//     res.sendFile(path.join(config.root, 'client/pages/library/index.html'));
// });

server.use(errorHandler);
mongo.connect(function () {
    server.listen(config.port, function () {
        console.log("listening on port", config.port);
    });
});

// Error handler middleware in order to avoid crushing of the server
function errorHandler(err, req, res, next) {
    if (err) {
        console.log(err);
        dbLogger.saveLog(err);
        res.send({ status: false, message: err.clientMessage || 'Error in server' });
    }
}