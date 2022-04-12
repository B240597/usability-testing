const validator = require('validator');
const config = require('./config');
const crypto = require('crypto');

exports.encrypt = function (text) {
    const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
    const iv = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (text) {
    const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
    const iv = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.validation = function (object, require, integer) {
    try {
        for (var r = 0; r < require.length; r++) {
            if (validator.isEmpty(object[require[r]])) {
                return { length: 0, status: false, message: "Please select " + require[r] };
            }
        }
        for (var i = 0; i < integer.length; i++) {
            if (object[integer[i]]) {
                if (!validator.isNumeric(object[integer[i]]) & object[integer[i]] !== "") {
                    return { length: 0, status: false, message: integer[i] + " should be numeric characters only" };
                }
            }
        }
        return { status: true, message: "" };
    } catch (e) {
        console.log(e);
        return { status: true, message: "Invalid param values" };
    }
};

exports.emailvalidation = function (object, email) {
    try {
        for (var r = 0; r < email.length; r++) {
            if (object[email[r]]) {
                if (!validator.isEmail(object[email[r]]) & object[email[r]] !== "") {
                    return { length: 0, status: false, message: email[r] + " is not in correct format" };
                }
            }
        }
        return { status: true, message: "" };
    } catch (e) {
        return { length: 0, status: false };
    }
};

exports.floatvalidation = function (object, float) {
    try {
        for (var r = 0; r < float.length; r++) {
            if (object[float[r]]) {
                if (!validator.isFloat(object[float[r]]) & object[float[r]] !== "") {
                    return { length: 0, status: false, message: float[r] + " is not in correct format" };
                }
            }
        }
        return { status: true, message: "" };
    } catch (e) {
        return { length: 0, status: false };
    }
};

exports.randomValueBase64 = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

exports.capitalizeString = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}