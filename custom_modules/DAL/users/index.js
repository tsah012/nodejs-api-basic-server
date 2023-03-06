const userModel = require('./userModel');
const bcrypt = require('bcrypt');


module.exports.getUserById = async function (userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return false;
        }

        return user;
    }
    catch (error) {
        throw error;
    }
}

module.exports.getUserByMail = async function (_mail) {
    try {
        const user = await userModel.findOne({ mail: _mail });
        if (!user) {
            return false;
        }

        return user;
    }
    catch (error) {
        throw error;
    }
}

module.exports.addUser = async function (_name, _mail, _password, _admin = false, _data = []) {
    try {
        validateUserFields(_name, _mail, _password);
        const hashedPassword = await bcrypt.hash(_password, 10);
        const user = new userModel({
            name: _name,
            mail: _mail,
            password: hashedPassword,
            admin: _admin,
            data: _data
        });

        await user.save();
    }
    catch (error) {
        if (error.message.includes('duplicate key')) {
            error.clientMessage = 'Email already in use';
        }
        throw error;
    }
}

function validateUserFields(name, email, password) {
    if (!(validateName(name) && validateEmail(email) && validatePassword(password))) {
        let error = new Error();
        error.clientMessage = 'INVALID INPUT';
        throw (error);
    }
}

function validateName(name) {
    return name.trim().length;
}

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.trim().length;
}