const modelDefinitions = require('../../app');
const functions = require('../../functions');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
var FCM = require('fcm-node');
var serverKey = require('../../serviceAccountKey.json') //put your server key here
var fcm = new FCM(serverKey);

//job  APIs

//Get job management API
exports.getJobManagement = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Jobs = modelDefinitions.model('tbl_jobs');
            const projects = modelDefinitions.model('tbl_projects');
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'is_deleted': 0 };

            queryWhere["status"] = [2, 3, 4];

            if ("engineer" in data) {
                queryWhere["engineer"] = functions.decrypt(data.engineer);
            }

            if ('keywordSearch' in data) {
                queryWhere = {
                    [op.or]: [
                        { job_code: { [op.like]: '%' + data.keywordSearch + '%' } },
                        { job_description: { [op.like]: '%' + data.keywordSearch + '%' } }
                    ]
                }
            }

            if ("status" in data) {
                queryWhere["status"] = { [op.like]: '%' + data.status + '%' };
            }



            return Jobs.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    { model: projects, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                ]
            }).then(async jobData => {
                let finalArray = [];
                let array = jobData.rows;
                for (let i = 0; i < array.length; i++) {
                    element = array[i].get({ plain: true });
                    let eng = await getUserName(element.engineer);
                    let pro = await getUserName(element.tbl_project.project_manager);
                    let workDuration = await differenceInDates(element.start_date, element.target_date);
                    let issues = await getIssuesNumber(element.job_id);

                    let obj = {
                        'jobId': functions.encrypt(element.job_id.toString()),
                        'jobCode': element.job_code,
                        'projectName': element.tbl_project.project_name,
                        'projectCode': element.tbl_project.project_code,
                        'jobDescribtion': element.job_description,
                        'engineerName': eng.results,
                        'projectManagerName': pro.results,
                        'workDuration': workDuration,
                        'targetDate': element.target_date,
                        'remark': element.remark,
                        'reviewDate': element.review_date,
                        'issues': issues.count,
                        'startDate': element.start_date,
                        'completionDate': element.completion_date,
                        'approvedDate': element.approved_date,
                        'status': element.status,
                        'approveStatus': element.is_approved,
                        'declineStatus': element.is_declined,
                        'deleteStatus': element.is_deleted,
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray, count: jobData.count });
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

//Add job API
exports.addJob = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;
            let jobData = data.array;
            const Jobs = modelDefinitions.model('tbl_jobs');

            let finalArray = [];
            let projectName = data.projectName;
            jobData.forEach(element => {

                let finalObj = {};
                finalObj['project_id'] = functions.decrypt(element.projectId.toString());
                finalObj['job_code'] = element.jobCode;
                finalObj['job_description'] = element.Description;
                finalObj['engineer'] = functions.decrypt(element.engineerCode.toString());
                finalObj['start_date'] = element.startDate;
                finalObj['target_date'] = element.targetDate;
                finalObj['review_date'] = element.reviewDate;
                finalObj['created_by'] = 1;
                finalObj['modified_by'] = 1;

                finalArray.push(finalObj);
            })
            await compressArray(req, finalArray, projectName);
            return Jobs.bulkCreate(finalArray, { 'validate': true, 'userId': req.session.userId }).then(async jobAdded => {

                for (let i = 0; i < jobAdded.length; i++) {
                    let jobId = jobAdded[i].dataValues.job_id;
                    let reviewDate = jobAdded[i].dataValues.review_date;
                    await addReviewDate(req, jobId, reviewDate)
                }
                return resolve({ success: true, message: "Jobs added successfully" });
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
function addReviewDate(req, jobId, reviewDate) {
    return new Promise(function (resolve, reject) {
        try {
            let userId = functions.decrypt(req.session.userId);
            if (!jobId) {
                return reject({ success: false, message: "JobID is missing" });
            }
            const Review = modelDefinitions.model('tbl_review_date');
            const Jobs = modelDefinitions.model('tbl_jobs');
            let projectquery = { 'is_deleted': 0 };

            const projects = modelDefinitions.model('tbl_projects');
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'job_id': jobId };
            let dataObj = {};
            dataObj['job_id'] = jobId;
            dataObj['review_date'] = reviewDate;

            modelDefinitions.getSequelize().transaction().then(function (t) {
                return Review.create(dataObj, { 'validate': true, 'userId': req.session.userId }).then(async clientAdded => {
                    if (clientAdded) {
                        return Jobs.findOne({
                            where: queryWhere, distinct: true,
                            include: [
                                { model: projects, where: projectquery, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                            ]
                        }).then(async jobData => {
                            if (jobData) {
                                jobData["review_date"] = reviewDate;

                                let notification = await addNotification(req, 1, jobData.tbl_project.project_manager, jobData.engineer, 'Review Date Alert', 'Review Date is added to Job ' + jobData.job_code, '');
                                if (notification.success) {
                                    return jobData.save({ "validate": true, "userId": req.session.userId, transaction: t }).then(projectDataUpdated => {
                                        t.commit();
                                        return resolve({ success: true, message: "Review Date added successfully" });
                                    }).catch(error => {
                                        console.log(error);
                                        return reject({ success: false, message: "Something went wrong" });
                                    });
                                }
                            }
                            else {
                                return reject({ success: false, message: "No Job exists with this jobId" });
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
            });

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Get jobs API
exports.getJobs = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Jobs = modelDefinitions.model('tbl_jobs');
            const projects = modelDefinitions.model('tbl_projects');
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'is_deleted': 0 };
            let projectquery = { 'is_deleted': 0 };

            if (data.userType == 'project_manager') {
                projectquery["project_manager"] = functions.decrypt(req.session.userId);
            } else if (data.userType == 'associate') {
                queryWhere["engineer"] = functions.decrypt(req.session.userId);
            } else {
                if ("projectId" in data) {
                    queryWhere["project_id"] = functions.decrypt(data.projectId);
                }
            }

            if ("archived" in data) {
                queryWhere["is_approved"] = { [op.like]: data.archived };
            } else {
                queryWhere["is_approved"] = { [op.like]: 0 };
            }
            if ("jobCode" in data) {
                queryWhere["job_code"] = { [op.like]: '%' + data.jobCode + '%' };
            }
            if ("engineer" in data) {
                queryWhere["engineer"] = functions.decrypt(data.engineer);
            }
            if ("projectManager" in data) {
                projectquery["project_manager"] = functions.decrypt(data.projectManager);
            }
            if ("targetDate" in data) {
                queryWhere["target_date"] = { [op.like]: '%' + new Date(data.targetDate) + '%' };
            }
            if ("completionDate" in data) {
                queryWhere["completion_date"] = { [op.like]: '%' + new Date(data.completionDate) + '%' };
            }
            if ("reviewDate" in data) {
                queryWhere["review_date"] = { [op.like]: '%' + new Date(data.reviewDate) + '%' };
            }
            if ("status" in data) {
                queryWhere["status"] = data.status;
            }
            // console.log(queryWhere, 'queryWhere jobs');
            return Jobs.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    { model: projects, where: projectquery, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                ]
            }).then(async jobData => {
                let finalArray = [];
                let array = jobData.rows;

                for (let i = 0; i < array.length; i++) {
                    let element = array[i].get({ plain: true });
                    let eng = await getUserName(element.engineer);
                    let pro = await getUserName(element.tbl_project.project_manager);
                    let workDuration = await differenceInDates(element.start_date, element.target_date);
                    let issues = await getIssuesNumber(element.job_id);


                    let obj = {
                        'jobId': functions.encrypt(element.job_id.toString()),
                        'jobCode': element.job_code,
                        'projectName': element.tbl_project.project_name,
                        'jobDescribtion': element.job_description,
                        'engineerName': eng.results,
                        'projectManagerName': pro.results,
                        'projectManager': functions.encrypt(element.tbl_project.project_manager.toString()),
                        'workDuration': workDuration,
                        'targetDate': element.target_date,
                        'remark': element.remark,
                        'reviewDate': element.review_date,
                        'issues': issues.count,
                        'startDate': element.start_date,
                        'completionDate': element.completion_date,
                        'approvedDate': element.approved_date,
                        'status': element.status,
                        'approveStatus': element.is_approved,
                        'declineStatus': element.is_declined,
                        'deleteStatus': element.is_deleted,
                    };
                    finalArray.push(obj);
                }



                return resolve({ success: true, results: finalArray, count: jobData.count });
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

//Get User Name (Project Manager / engineer)
function getUserName(userId) {
    return new Promise(function (resolve, reject) {
        try {
            if (!userId) {
                return reject({ success: false, message: " params missing2" });
            }
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            queryWhere['user_id'] = userId;

            const Users = modelDefinitions.model("tbl_users");
            return Users.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(userData => {
                let finalArray = [];
                userData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    let finalObj = {};
                    finalObj['userName'] = element.user_name;
                    finalArray.push(finalObj);
                })
                return resolve({ success: true, results: finalArray[0].userName, count: userData.count });
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

//function for difference in dates
function differenceInDates(start_date, target_date) {
    var date1 = new Date(start_date);
    var date2 = new Date(target_date);
    // To calculate the time difference of two dates 
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days
}

//Get issues number
function getIssuesNumber(jobId) {
    return new Promise(function (resolve, reject) {
        try {
            if (!jobId) {
                return reject({ success: false, message: " params missing1" });
            }
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            queryWhere['job_id'] = jobId;

            const Issue = modelDefinitions.model('tbl_issues');
            return Issue.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(issueData => {
                let completed = 0;
                issueData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    if (element.status == 3) {
                        completed = completed + 1;
                    }
                })
                return resolve({ success: true, count: completed + '/' + issueData.count });
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

// Update job status
exports.updateJobStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.jobId) {
                return resolve({ success: false, message: "projectId is missing" });
            }
            const Jobs = modelDefinitions.model('tbl_jobs');
            let queryWhere = { 'job_id': functions.decrypt(data.jobId) };
            let projectquery = { 'is_deleted': 0 };

            const projects = modelDefinitions.model('tbl_projects');
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            modelDefinitions.getSequelize().transaction().then(function (t) {
                return Jobs.findOne({
                    where: queryWhere, distinct: true,
                    include: [
                        { model: projects, where: projectquery, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                    ]
                }).then(async jobData => {
                    if (jobData) {
                        delete data.jobId;
                        if ("status" in data) {
                            jobData["status"] = data.status;
                            if (data.status == 3) {
                                // console.log(jobData, 'jobData.project_manager');
                                let notification = await addNotification(req, 3, jobData.engineer, jobData.tbl_project.project_manager, 'Pending for approval', 'Job ID ' + jobData.job_code + ' pending for approval', jobData.job_code);
                                if (notification.success) {
                                    jobData["is_declined"] = 0;
                                }
                            }
                        } else if ("approveStatus" in data) {
                            jobData["is_approved"] = data.approveStatus;
                            addNotification(req, 2, jobData.tbl_project.project_manager, jobData.engineer, 'Job Approved Alert', 'Your Job ID ' + jobData.job_code + ' is approved', jobData.job_code);
                            if (data.approveStatus) {
                                jobData["is_declined"] = 0;
                                jobData["completion_date"] = new Date();
                                jobData['status'] = 4;
                            }

                        } else if ("declineStatus" in data) {
                            let notification = await addNotification(req, 2, jobData.tbl_project.project_manager, jobData.engineer, 'Job Rejection Alert', 'Your Job ID ' + jobData.job_code + ' is Rejected.', jobData.job_code);
                            if (notification.success) {
                                jobData["is_declined"] = data.declineStatus;
                                if (data.declineStatus) {
                                    jobData["is_approved"] = 0;
                                    jobData["completion_date"] = null;
                                    jobData['status'] = 1;
                                }
                            }
                        }
                        else {
                            jobData['is_deleted'] = data.deleteStatus;
                        }


                        return jobData.save({ "validate": true, "userId": req.session.userId, 'transaction': t }).then(async projectDataUpdated => {

                            if (data.deleteStatus) {
                                await deleteNotifications(jobData.job_code, t)
                                await deleteIssues(jobData.job_id, t)
                                await deleteReview(jobData.job_id, t)
                            }
                            t.commit();
                            return resolve({ success: true, message: "successfully" });
                        }).catch(error => {
                            console.log(error);
                            return reject({ success: false, message: "Something went wrong2" });
                        });
                    }
                    else {
                        return reject({ success: false, message: "No Job exists with this jobId" });
                    }
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: "Something went wrong" });
                });
            });
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

function deleteNotifications(job_code, t) {
    return new Promise(function (resolve, reject) {
        try {
            const Notifications = modelDefinitions.model('tbl_notification');

            let queryWhere = { 'is_deleted': 0, "job_code": job_code };

            return Notifications.findAndCountAll({ where: queryWhere }).then(async (note) => {
                if (note) {
                    let array = []
                    note.rows.forEach(element => {
                        element = element.get({ plain: true });
                        element['is_deleted'] = 1;
                        array.push(element);
                    });
                    return Notifications.bulkCreate(array, { updateOnDuplicate: ["is_deleted"], 'transaction': t }).then(cities => {
                        return resolve({ "success": true });
                    }).catch(err => {
                        console.log(err);
                        return reject({ "success": false });
                    });
                } else {
                    return reject({ success: false, message: "Something went wrong" });
                }
            });

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

function deleteIssues(job_id, t) {
    return new Promise(async function (resolve, reject) {
        try {
            const Issues = modelDefinitions.model('tbl_issues');
            let queryWhere = { 'is_deleted': 0, "job_id": job_id };

            return Issues.findAndCountAll({ where: queryWhere }).then(async (note) => {
                if (note) {
                    let array = []
                    note.rows.forEach(element => {
                        element = element.get({ plain: true });
                        element['is_deleted'] = 1;
                        array.push(element);
                    });
                    return Issues.bulkCreate(array, { updateOnDuplicate: ["is_deleted"], 'transaction': t }).then(cities => {
                        return resolve({ "success": true });
                    }).catch(err => {
                        console.log(err);
                        return reject({ "success": false });
                    });
                } else {
                    return reject({ success: false, message: "Something went wrong" });
                }
            });

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

function deleteReview(job_id, t) {
    return new Promise(async function (resolve, reject) {
        try {
            const Review = modelDefinitions.model('tbl_review_date');
            let queryWhere = { 'is_deleted': 0, "job_id": job_id };

            return Review.findAndCountAll({ where: queryWhere }).then(async (note) => {
                if (note) {
                    let array = []
                    note.rows.forEach(element => {
                        element = element.get({ plain: true });
                        element['is_deleted'] = 1;
                        array.push(element);
                    });
                    return Review.bulkCreate(array, { updateOnDuplicate: ["is_deleted"], 'transaction': t }).then(cities => {
                        return resolve({ "success": true });
                    }).catch(err => {
                        console.log(err);
                        return reject({ "success": false });
                    });
                } else {
                    return reject({ success: false, message: "Something went wrong" });
                }
            });

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}



// review date

//Add review date API
exports.addReviewDate = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            let userId = functions.decrypt(req.session.userId);
            if (!data.jobId) {
                return reject({ success: false, message: "JobID is missing" });
            }
            const Review = modelDefinitions.model('tbl_review_date');
            const Jobs = modelDefinitions.model('tbl_jobs');
            let projectquery = { 'is_deleted': 0 };

            const projects = modelDefinitions.model('tbl_projects');
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'job_id': functions.decrypt(data.jobId.toString()) };
            let dataObj = {};
            dataObj['job_id'] = functions.decrypt(data.jobId.toString());
            dataObj['review_date'] = data.reviewDate;

            // console.log(dataObj, 'userId')

            modelDefinitions.getSequelize().transaction().then(function (t) {
                return Review.create(dataObj, { 'validate': true, 'userId': req.session.userId }).then(async clientAdded => {
                    if (clientAdded) {
                        return Jobs.findOne({
                            where: queryWhere, distinct: true,
                            include: [
                                { model: projects, where: projectquery, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                            ]
                        }).then(async jobData => {
                            if (jobData) {
                                jobData["review_date"] = data.reviewDate;

                                let notification = await addNotification(req, 1, jobData.tbl_project.project_manager, jobData.engineer, 'Review Date Alert', 'Review Date is added to Job ' + jobData.job_code, '');
                                if (notification.success) {
                                    return jobData.save({ "validate": true, "userId": req.session.userId, transaction: t }).then(projectDataUpdated => {
                                        t.commit();
                                        return resolve({ success: true, message: "Review Date added successfully" });
                                    }).catch(error => {
                                        console.log(error);
                                        return reject({ success: false, message: "Something went wrong" });
                                    });
                                }
                            }
                            else {
                                return reject({ success: false, message: "No Job exists with this jobId" });
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
            });

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Get Review Date API
exports.getReviewDate = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Review = modelDefinitions.model('tbl_review_date');

            let queryWhere = { 'is_deleted': 0 };
            queryWhere['job_id'] = functions.decrypt(data.jobId.toString());

            return Review.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
            }).then(async reviewData => {
                let finalArray = [];
                let array = reviewData.rows;
                for (let i = 0; i < array.length; i++) {
                    element = array[i].get({ plain: true });

                    let pro = ''
                    if (element.project_manager) {
                        let proData = await getUserName(element.project_manager);
                        pro = proData.results
                    }


                    let obj = {
                        'reviewDateId': functions.encrypt(element.review_id.toString()),
                        'reviewDate': element.review_date,
                        'remark': element.remark,
                        'projectManager': pro
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray, count: reviewData.count });
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

// Update Review status
exports.updateReviewStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.reviewDateId) {
                return resolve({ success: false, message: "reviewDateId is missing" });
            }
            const Review = modelDefinitions.model('tbl_review_date');
            const Jobs = modelDefinitions.model('tbl_jobs');

            let queryWhere = { 'review_id': functions.decrypt(data.reviewDateId) };

            modelDefinitions.getSequelize().transaction().then(function (t) {
                return Review.findOne({ where: queryWhere }).then(reviewDateData => {
                    if (reviewDateData) {
                        reviewDateData["remark"] = data.remark;
                        reviewDateData["project_manager"] = functions.decrypt(req.session.userId);
                        return reviewDateData.save({ "validate": true, "userId": req.session.userId }).then(reviewDataUpdated => {
                            if (reviewDataUpdated) {
                                return Jobs.findOne({ where: { 'job_id': reviewDateData.job_id } }).then(jobData => {
                                    if (jobData) {
                                        delete data.jobId;
                                        jobData["remark"] = data.remark;
                                        return jobData.save({ "validate": true, "userId": req.session.userId, transaction: t }).then(projectDataUpdated => {
                                            t.commit();
                                            return resolve({ success: true, message: "Review Date updated successfully" });
                                        }).catch(error => {
                                            console.log(error);
                                            return reject({ success: false, message: "Something went wrong" });
                                        });
                                    }
                                    else {
                                        return reject({ success: false, message: "No Job exists with this jobId" });
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    return reject({ success: false, message: "Something went wrong" });
                                });
                            }
                        }).catch(error => {
                            console.log(error);
                            return reject({ success: false, message: "Something went wrong" });
                        });
                    }
                    else {
                        return reject({ success: false, message: "No Job exists with this jobId" });
                    }
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: "Something went wrong" });
                });
            });
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

// issue date

//Add issue API
exports.addIssueDate = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.jobId) {
                return reject({ success: false, message: "JobID is missing" });
            }
            const Issue = modelDefinitions.model('tbl_issues');

            let dataObj = {};
            dataObj['job_id'] = functions.decrypt(data.jobId.toString());
            dataObj['issue_date'] = data.issueDate;
            dataObj['issue_description'] = data.issueDescription;
            dataObj['posted_by'] = functions.decrypt(req.session.userId);
            dataObj['status'] = 1;

            return Issue.create(dataObj, { 'validate': true, 'userId': req.session.userId }).then(async clientAdded => {
                let notification = await addNotification(req, 3, functions.decrypt(req.session.userId), functions.decrypt(data.projectManager), 'Issue for Job', 'Job ID ' + data.jobCode + ' has a issue', data.jobCode);
                if (notification.success) {
                    return resolve({ success: true, message: "Issue added successfully" });
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

//Get issue API
exports.getIssueDate = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Issue = modelDefinitions.model('tbl_issues');

            let queryWhere = { 'is_deleted': 0 };
            queryWhere['job_id'] = functions.decrypt(data.jobId.toString());

            return Issue.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,

            }).then(async issueData => {
                let finalArray = [];
                let array = issueData.rows;
                for (let i = 0; i < array.length; i++) {
                    element = array[i].get({ plain: true });
                    let pro = ''
                    if (element.resolved_by) {
                        let proData = await getUserName(element.resolved_by);
                        pro = proData.results;
                    }
                    let eng = await getUserName(element.posted_by);

                    let obj = {
                        'issuesId': functions.encrypt(element.issues_id.toString()),
                        'issueDate': element.issue_date,
                        'issueDescription': element.issue_description,
                        'engineer': eng.results,
                        'projectManager': pro,
                        'status': element.status,
                        'resolvedDate': element.resolved_date
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray.reverse(), count: issueData.count });
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

// Update issue status
exports.updateIssueStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.issuesId) {
                return resolve({ success: false, message: "issuesId is missing" });
            }
            const Issue = modelDefinitions.model('tbl_issues');
            let queryWhere = { 'issues_id': functions.decrypt(data.issuesId) };

            return Issue.findOne({ where: queryWhere }).then(IssueData => {
                if (IssueData) {
                    delete data.jobId;
                    IssueData["status"] = data.status;
                    IssueData["resolved_by"] = functions.decrypt(req.session.userId);
                    IssueData["resolved_date"] = new Date();
                    return IssueData.save({ "validate": true, "userId": req.session.userId }).then(projectDataUpdated => {
                        return resolve({ success: true, message: "Issue updated successfully" });
                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "No Issue exists with this jobId" });
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

//grid column for jobs api's
//grid api's
exports.updateJobGridColumns = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;

            const JobGrids = modelDefinitions.model('tbl_job_grid_columns');

            return JobGrids.findOne().then(jobGrid => {
                if (jobGrid) {
                    delete data.job_grid_column_id;
                    for (let key in data) {
                        jobGrid[key] = data[key];
                    }
                    return jobGrid.save({ "validate": true, "userId": req.session.userId }).then(grids => {
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

exports.getJobGridColumns = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;
            const JobGrids = modelDefinitions.model('tbl_job_grid_columns');
            return JobGrids.findAndCountAll().then(grids => {
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

async function addNotification(req, noteType, from_user, to_user, title, message, jobCode) {
    return new Promise(async function (resolve, reject) {
        try {
            const Notification = modelDefinitions.model('tbl_notification');

            let deviceIdArray = [];
            let array = [];
            let dataObj = {};

            dataObj['title'] = title;
            dataObj['message'] = message;
            dataObj['from_user'] = from_user;
            dataObj['to_user'] = to_user;
            dataObj['note_type'] = noteType;
            dataObj['job_code'] = jobCode;
            dataObj['created_by'] = from_user;
            dataObj['modified_by'] = from_user;

            let deviceId = await getDeviceCode(to_user);
            deviceIdArray.push(deviceId.results);

            array.push(dataObj);
            console.log(array)
            return Notification.bulkCreate(array, { 'validate': true, 'userId': req.session.userId }).then(async clientAdded => {

                if (clientAdded) {
                    for (let i = 0; i < deviceIdArray.length; i++) {
                        if (deviceIdArray[i]) {

                            var message = {
                                to: deviceIdArray[i],

                                notification: {
                                    title: 'Title of your push notification',
                                    body: 'Body of your push notification'
                                }
                            };
                            console.log(message);
                            fcm.send(message, function (err, response) {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                                } else {

                                }
                            });
                        }
                    }
                    return resolve({ success: true, message: "Notification added successfully" });
                }

            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong2" });
            })

        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong1" });
        }
    })
}

//Get Device Code
function getDeviceCode(userId) {
    return new Promise(function (resolve, reject) {
        try {
            if (!userId) {
                return reject({ success: false, message: " params missing3" });
            }
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            queryWhere['user_id'] = userId;

            const Users = modelDefinitions.model("tbl_users");
            return Users.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(userData => {
                let finalArray = [];
                userData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    let finalObj = {};
                    finalObj['deviceId'] = element.device_id;
                    finalArray.push(finalObj);
                })
                return resolve({ success: true, results: finalArray[0].deviceId, count: userData.count });
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

async function compressArray(req, array, projectName) {

    var output = Object.values(array.reduce((obj, { engineer }) => {
        if (obj[engineer] === undefined)
            obj[engineer] = { engineer: engineer, occurrences: 1 };
        else
            obj[engineer].occurrences++;
        return obj;
    }, {}));
    for (let i = 0; i < output.length; i++) {
        await addNotification(req, 2, 1, output[i].engineer, 'New Job', 'You have got ' + output[i].occurrences + ' New jobs assigned for Project: ' + projectName, '');
    }
};

