const mongo = require('../../mongo');
const logsColl = require('../../configuration/app').logsCollection;


module.exports.getLogs = async function () {
    try {
        const db = mongo.getDB();
        const data = await db.collection(logsColl).find().toArray();
        return data;
    } catch (error) {
        throw (error);
    }

}