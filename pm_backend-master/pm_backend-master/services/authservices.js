const authDao = require('../orm/daos/authdao');
const functions = require('../functions');

//Login API
exports.authenticate = function (req, res) {
    try {
        authDao.authenticate(req).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            res.json(err);
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to process request" });
    }
}

//Check Session on login
exports.checkSession = async function (req, res) {
    try {
        let bearerHeader = req.headers["authorization"];
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        if (req.session.token === bearerToken) {
            res.json({ "success": true });
        } else {
            res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
        }
    } catch (error) {
        res.status(500).send({ "message": "Failed to process request" });
    }
}

//Check Password set URL Status
exports.checkUrlStatus = async function (req, res) {
    try {
        authDao.checkUrlStatus(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "message": "Failed to process request" });
    }
}

//Activate User API
exports.activateUser = function (req, res) {
    try {
        authDao.activateUser(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    } catch (error) {
        console.log(error);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

//Forgot Password API
exports.forgotPassword = function (req, res) {
    try {
        authDao.forgotPassword(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    } catch (error) {
        console.log(error);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

//Reset Password API
exports.resetPassword = function (req, res) {
    try {
        authDao.activateUser(req).then(data => {
            res.json(data);
        }).catch(error => {

            console.log(error);
            res.json(error);
        });

    } catch (e) {

        console.log(e);
        res.status(421).send({ message: 'Failed to process request' });
    }
}

//Change Password API
exports.changePassword = async function (req, res) {
    try {
        authDao.changePassword(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "message": "Failed to process request" });
    }
}

//Change Password for Admin API
exports.adminChangePassword = async function (req, res) {
    try {
        authDao.adminChangePassword(req).then(data => {
            res.json(data);
        }).catch(error => {
            console.log(error);
            res.json(error);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "message": "Failed to process request" });
    }
}
