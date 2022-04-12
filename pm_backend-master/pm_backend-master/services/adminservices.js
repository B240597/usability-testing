const adminDao = require('../orm/daos/admindao');

//Lookups Api's
exports.getLookupOptions = async function (req, res) {
    try {
        adminDao.getLookupOptions(req).then(data => {
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

exports.addLookups = async function (req, res) {
    try {
        adminDao.addLookups(req).then(data => {
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

exports.updateLookup = async function (req, res) {
    try {
        adminDao.updateLookup(req).then(data => {
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

//Settings Api's

//Get Settings API
exports.getSettings = function (req, res) {
    try {
        adminDao.getSettings(req).then(data => {
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

//Update Settings API
exports.updateSettings = function (req, res) {
    try {
        adminDao.updateSettings(req).then(data => {
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

//User Api's

//Add New User API
exports.addNewUser = function (req, res) {
    try {
        adminDao.addNewUser(req).then(data => {
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

//Get Users API
exports.getUsers = function (req, res) {
    try {
        adminDao.getUsers(req).then(data => {
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

//Get Users dropdown API
exports.getUsersDropdown = function (req, res) {
    try {
        adminDao.getUsersDropdown(req).then(data => {
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

//Update User Status API
exports.updateUserStatus = function (req, res) {
    try {
        adminDao.updateUserStatus(req).then(data => {
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

//Update User API
exports.updateUser = function (req, res) {
    try {
        adminDao.updateUser(req).then(data => {
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