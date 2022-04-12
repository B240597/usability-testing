const dashboardDao = require('../orm/daos/dashboarddao');

//dashboard APIs

//get active job Data API
exports.getActiveJob = function (req, res) {
    try {
        dashboardDao.getActiveJob(req).then(data => {
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

//get due review Data API
exports.getDueReview = function (req, res) {
    try {
        dashboardDao.getDueReview(req).then(data => {
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

//get issues Data API
exports.getIssueData = function (req, res) {
    try {
        dashboardDao.getIssueData(req).then(data => {
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

//add DeviceId API
exports.addDeviceId = function (req, res) {
    try {
        dashboardDao.addDeviceId(req).then(data => {
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

//get Notifications API
exports.getNotifications = function (req, res) {
    try {
        dashboardDao.getNotifications(req).then(data => {
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

// readNotifications
exports.readNotifications = function (req, res) {
    try {
        dashboardDao.readNotifications(req).then(data => {
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
