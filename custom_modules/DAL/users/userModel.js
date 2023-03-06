const config = require('../../configuration/app');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    password: String,
    admin: Boolean,
    data: [Object],
});

module.exports = mongoose.model(config.usersCollection, userSchema);