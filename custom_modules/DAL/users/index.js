const mongo = require('../../mongo');
const usersCol = require('../../configuration/app').usersCollection;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');


module.exports.getUserById = async function (userId) {
    try {
        const db = mongo.getDB();
        const user = await db.collection(usersCol).findOne({ _id: ObjectId(userId) });
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
        const db = mongo.getDB();
        const user = await db.collection(usersCol).findOne({ mail: _mail });
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
        const db = mongo.getDB();
        const hashedPassword = await bcrypt.hash(_password, 10);
        const user = await db.collection(usersCol).insertOne({ name: _name, mail: _mail, password: hashedPassword, admin: _admin, data: _data });
        return user;
    }
    catch (error) {
        if (error.message.includes('duplicate key')) {
            error.clientMessage = 'Email already in use';
        }
        throw error;
    }
}

// EXAMPLE OF UPDATING USER DATA. IN FOLLOWING EXAMPLE DATA IS BOOKS

// module.exports.updateUserBooks = async function (userId, booksList) {
//     try {
//         const db = mongo.getDB();
//         const res = await db.collection(usersCol).updateOne({ _id: ObjectId(userId) }, { $set: { books: booksList } });
//         if (!res) {
//             return false;
//         }

//         return res;
//     }
//     catch (error) {
//         throw error;
//     }
// }

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