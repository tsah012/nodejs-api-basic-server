const express = require("express");
const usersDAL = require('../DAL/users');
const auth = require('./authMiddlewares');
const httpStatusCodes = require("http-status-codes").StatusCodes;
const router = express.Router();

router.post('/user/add', async function (req, res, next) {
    try {
        await usersDAL.addUser(req.body.name, req.body.mail, req.body.password);
        res.status(httpStatusCodes.CREATED).send({ status: true, message: 'Request ended successfully' });
    }
    catch (err) {
        next(err);
    }
});


// Authenticated routes - only if user is logged in
//------------------------------------------------------------------

router.get('/user', auth.isAuth, async function (req, res, next) {
    try {
        let user = req.user;
        delete user.password;
        res.send(user);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;