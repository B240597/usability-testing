
const projectDao = require('../orm/daos/projectdao');

//Project APIs

//Add Project API
exports.addProject = function (req, res) {
    try {
        projectDao.addProject(req).then(data => {
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

//Get Project API
exports.getProjects = function (req, res) {
    try {
        projectDao.getProjects(req).then(data => {
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

//Get single project
exports.getProjectDropdown = function (req, res) {
    try {
        projectDao.getProjectDropdown(req).then(data => {
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

//Update Project API
exports.updateProject = function (req, res) {
    try {
        projectDao.updateProject(req).then(data => {
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

//Update Project Status API
exports.updateProjectStatus = function (req, res) {
    try {
        projectDao.updateProjectStatus(req).then(data => {
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


// project grid column

//update project grid columns
exports.updateProjectGridColumns = function (req, res) {
    try {
        projectDao.updateProjectGridColumns(req).then(data => {
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

//get project grid columns
exports.getProjectGridColumns = function (req, res) {
    try {
        projectDao.getProjectGridColumns(req).then(data => {
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