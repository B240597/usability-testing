const modelDefinitions = require('../../app');
const functions = require('../../functions');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

//Project  APIs

//Add Project API
exports.addProject = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            const Projects = modelDefinitions.model('tbl_projects');
            let queryWhere = {};
            queryWhere['project_code'] = data.projectCode;
            queryWhere['is_deleted'] = 0;
            return Projects.findAll({ where: queryWhere }).then(projectData => {
                if (projectData.length) {
                    return reject({ success: false, message: "Project #  already exists" });
                }
                else {
                    let dataObj = {};
                    dataObj['project_code'] = data.projectCode;
                    dataObj['project_name'] = data.projectName;
                    dataObj['project_type'] = data.projectType;
                    dataObj['client_name'] = data.clientName;
                    dataObj['client_location'] = data.clientLocation;
                    dataObj['project_manager'] = functions.decrypt(data.projectManager.toString());
                    dataObj['start_date'] = data.startDate;
                    dataObj['delivery_date'] = data.deliveryDate;
                    dataObj['status'] = data.status;
                    return Projects.create(dataObj, { 'validate': true, 'userId': 1 }).then(clientAdded => {
                        return resolve({ success: true, message: "Project added successfully" });
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: "Something went wrong" });
                    })
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Get project Dropdown
exports.getProjectDropdown = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            const projects = modelDefinitions.model('tbl_projects');

            let queryWhere = { 'is_deleted': 0, 'status': 1 };

            if (data.userType == 'project_manager') {
                queryWhere["project_manager"] = functions.decrypt(req.session.userId);
            }

            return projects.findAndCountAll({
                where: queryWhere,
                distinct: true,
            }).then(projectData => {
                let finalArray = [];
                projectData.rows.forEach(element => {
                    element = element.get({ plain: true });

                    let finalObj = {};
                    finalObj['projectCode'] = element.project_code;
                    finalObj['projectName'] = element.project_name;
                    finalObj['deliveryDate'] = element.delivery_date;
                    finalObj['projectId'] = functions.encrypt(element.project_id.toString());
                    finalObj['projectManager'] = functions.encrypt(element.project_manager.toString());
                    finalArray.push(finalObj);
                })
                return resolve({ success: true, results: finalArray });
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Get Project API
exports.getProjects = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const projects = modelDefinitions.model('tbl_projects');
            const Users = modelDefinitions.model("tbl_users");
            projects.hasOne(Users, { foreignKey: "user_id" });

            let queryWhere = { 'is_deleted': 0 };

            if (data.userType == 'project_manager') {
                queryWhere["project_manager"] = functions.decrypt(req.session.userId);
            }

            if ("projectCode" in data) {
                queryWhere["project_code"] = data.projectCode;
            }
            if ("projectManager" in data) {
                queryWhere["project_manager"] = functions.decrypt(data.projectManager);
            }
            if ("startDate" in data) {
                queryWhere["start_date"] = new Date(data.startDate);
            }
            if ("deliveryDate" in data) {
                queryWhere["delivery_date`"] = new Date(data.deliveryDate);
            }
            if ("status" in data) {
                queryWhere["status"] = data.status;
            }


            return projects.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    { model: Users, on: { '$tbl_projects.project_manager$': { [op.col]: 'tbl_user.user_id' } } },
                ]
            }).then(async projectData => {
                let finalArray = [];

                for (let i = 0; i < projectData.rows.length; i++) {
                    element = projectData.rows[i].get({ plain: true });
                    let jobs = await getJobNumber(element.project_id);
                    let obj = {
                        'projectId': functions.encrypt(element.project_id.toString()),
                        'projectCode': element.project_code,
                        'projectName': element.project_name,
                        'projectType': element.project_type,
                        'clientName': element.client_name,
                        'clientLocation': element.client_location,
                        'projectManagerName': element.tbl_user.user_name,
                        'projectManager': functions.encrypt(element.project_manager.toString()),
                        'startDate': element.start_date,
                        'deliveryDate': element.delivery_date,
                        'jobs': jobs.count,
                        'status': element.status,
                        'deleteStatus': element.is_deleted,
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray, count: projectData.count });
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Update Project API
exports.updateProject = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.projectId) {
                return resolve({ success: false, message: "projectId is missing" });
            }
            const Projects = modelDefinitions.model('tbl_projects');
            let queryWhere = {};
            return Projects.findAll({ where: { 'project_id': { [op.notIn]: [functions.decrypt(data.projectId)] }, 'project_code': data.projectCode } }).then(projectData => {
                if (projectData.length) {
                    return reject({ success: false, message: "Project #  already exists" });
                }
                else {
                    return Projects.findOne({ where: queryWhere }).then(projectData => {
                        if (projectData) {
                            delete data.projectId;

                            projectData['project_code'] = data.projectCode;
                            projectData['project_name'] = data.projectName;
                            projectData['project_type'] = data.projectType;
                            projectData['client_name'] = data.clientName;
                            projectData['client_location'] = data.clientLocation;
                            projectData['project_manager'] = functions.decrypt(data.projectManager.toString());
                            projectData['start_date'] = data.startDate;
                            projectData['delivery_date'] = data.deliveryDate;
                            projectData['status'] = data.status;

                            return projectData.save({ "validate": true, "userId": 1 }).then(projectDataUpdated => {
                                return resolve({ success: true, message: "Project updated successfully" });
                            }).catch(error => {
                                console.log(error);
                                return reject({ success: false, message: "Something went wrong" });
                            });
                        }
                        else {
                            return reject({ success: false, message: "No project exists with this projectId" });
                        }
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Update Project Status API
exports.updateProjectStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.projectId) {
                return resolve({ success: false, message: "projectId is missing" });
            }
            const Projects = modelDefinitions.model('tbl_projects');
            let queryWhere = { 'project_id': functions.decrypt(data.projectId) };
            return Projects.findOne({ where: queryWhere }).then(projectData => {
                if (projectData) {
                    delete data.projectId;
                    if ("status" in data) {
                        projectData["status"] = data.status;
                    }
                    else
                        projectData['is_deleted'] = data.deleteStatus;

                    return projectData.save({ "validate": true, "userId": 1 }).then(projectDataUpdated => {

                        return resolve({ success: true, message: "Project Updated successfully" });

                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "No project exists with this projectId" });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            });
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Get issues number
function getJobNumber(projectId) {
    return new Promise(function (resolve, reject) {
        try {
            if (!projectId) {
                return reject({ success: false, message: " params missing4" });
            }
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            queryWhere['project_id'] = projectId;

            const Jobs = modelDefinitions.model('tbl_jobs');
            return Jobs.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(jobData => {
                let completed = 0;
                jobData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    if (element.completion_date) {
                        completed = completed + 1;
                    }
                })
                return resolve({ success: true, count: completed + '/' + jobData.count });
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//grid column for project api's
//grid api's
exports.updateProjectGridColumns = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;

            const ProjectGrids = modelDefinitions.model('tbl_project_grid_columns');

            return ProjectGrids.findOne().then(projectGrid => {
                if (projectGrid) {
                    delete data.project_grid_column_id;
                    for (let key in data) {
                        projectGrid[key] = data[key];
                    }
                    return projectGrid.save({ "validate": true, "userId": req.session.userId }).then(grids => {
                        return resolve({ success: true });
                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "Column not found" });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            });
        }
        catch (err) {
            console.log(err);
            return reject({ success: false, message: "Something went wrong" });
        }
    });
}

exports.getProjectGridColumns = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;
            const ProjectGrids = modelDefinitions.model('tbl_project_grid_columns');
            return ProjectGrids.findAndCountAll().then(grids => {
                return resolve({ success: true, results: grids.rows, count: grids.count });
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            });
        }
        catch (err) {
            console.log(err);
            return reject({ success: false, message: "Something went wrong" });
        }
    });
}