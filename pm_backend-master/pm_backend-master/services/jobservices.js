const jobDao = require('../orm/daos/jobdao');

//Job APIs

//Add Jobs API
exports.addJob = function (req, res) {
    try {
        jobDao.addJob(req).then(data => {
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

//get Job Management API
exports.getJobManagement = function (req, res) {
    try {
        jobDao.getJobManagement(req).then(data => {
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

//get Jobs API
exports.getJobs = function (req, res) {
    try {
        jobDao.getJobs(req).then(data => {
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

//update Jobs
exports.updateJobStatus = function (req, res) {
    try {
        jobDao.updateJobStatus(req).then(data => {
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


// Review dates

//add review Date
exports.addReviewDate = function (req, res) {
    try {
        jobDao.addReviewDate(req).then(data => {
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

//get Review date
exports.getReviewDate = function (req, res) {
    try {
        jobDao.getReviewDate(req).then(data => {
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

//update Review date
exports.updateReviewStatus = function (req, res) {
    try {
        jobDao.updateReviewStatus(req).then(data => {
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

// Issue dates

//add Issue Date
exports.addIssueDate = function (req, res) {
    try {
        jobDao.addIssueDate(req).then(data => {
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

//get Issue date
exports.getIssueDate = function (req, res) {
    try {
        jobDao.getIssueDate(req).then(data => {
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

//update Issue date
exports.updateIssueStatus = function (req, res) {
    try {
        jobDao.updateIssueStatus(req).then(data => {
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

// job grid column

//update job grid columns
exports.updateJobGridColumns = function (req, res) {
    try {
        jobDao.updateJobGridColumns(req).then(data => {
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

//get job grid columns
exports.getJobGridColumns = function (req, res) {
    try {
        jobDao.getJobGridColumns(req).then(data => {
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