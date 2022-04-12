const modelDefinitions = require('../../app');
var moment = require('moment');
const functions = require('../../functions');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

//Get dashboard data API
exports.getActiveJob = function (req) {
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
            queryWhere['status'] = 1;
            queryWhere["target_date"] = { [op.lte]: '%' + new Date(data.date) + '%' };
            // console.log(queryWhere, 'queryWhere');
            return Jobs.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    { model: projects, on: { '$tbl_jobs.project_id$': { [op.col]: 'tbl_project.project_id' } } },
                ]
            }).then(async jobData => {
                let finalArray = [];
                let array = jobData.rows;
                let totalJobs = await totalJobCount(req);
                for (let i = 0; i < array.length; i++) {
                    let element = array[i].get({ plain: true });

                    let eng = await getUserName(element.engineer);
                    let pro = await getUserName(element.tbl_project.project_manager);

                    let obj = {
                        'jobId': functions.encrypt(element.job_id.toString()),
                        'jobCode': element.job_code,
                        'projectName': element.tbl_project.project_code,
                        'jobDescribtion': element.job_description,
                        'engineerName': eng.results,
                        'targetDate': element.target_date,
                        'projectManagerName': pro.results,
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray, count: jobData.count, totalJobCount: totalJobs.count });
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong1" });
            })
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

function totalJobCount(req) {
    return new Promise(function (resolve, reject) {
        try {

            const Jobs = modelDefinitions.model('tbl_jobs');

            let queryWhere = { 'is_deleted': 0 };
            queryWhere['status'] = 1;

            return Jobs.findAndCountAll({
                where: queryWhere
            }).then(async jobData => {
                return resolve({ success: true, count: jobData.count });
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

exports.getDueReview = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Review = modelDefinitions.model('tbl_review_date');
            const Jobs = modelDefinitions.model('tbl_jobs');
            const projects = modelDefinitions.model('tbl_projects');
            Review.hasOne(Jobs, { foreignKey: "job_id" });
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'is_deleted': 0 };
            queryWhere["review_date"] = { [op.lte]: '%' + new Date(data.date) + '%' };


            return Review.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    {
                        model: Jobs, on: { '$tbl_review_date.job_id$': { [op.col]: 'tbl_job.job_id' } },
                        include: [
                            {
                                model: projects, on: { '$tbl_job.project_id$': { [op.col]: 'tbl_job.tbl_project.project_id' } },
                            }
                        ]

                    }
                ]
            }).then(async reviewData => {
                let finalArray = [];
                let reviewArray = reviewData.rows;
                for (let i = 0; i < reviewArray.length; i++) {
                    let element = reviewArray[i].get({ plain: true });

                    // if (new Date(element.review_date).getDate() < new Date(data.date).getDate()) {
                    let pro = ''
                    if (element.tbl_job.tbl_project.project_manager) {
                        let proData = await getUserName(element.tbl_job.tbl_project.project_manager);
                        pro = proData.results
                    }
                    let eng = await getUserName(element.tbl_job.engineer);
                    let obj = {
                        'reviewDateId': functions.encrypt(element.review_id.toString()),
                        'reviewDate': element.review_date,
                        'remark': element.remark,
                        'job': element.tbl_job.job_code,
                        'jobId': functions.encrypt(element.tbl_job.job_id.toString()),
                        'project': element.tbl_job.tbl_project.project_code,
                        'engineer': eng.results,
                        'projectManager': pro
                    };
                    finalArray.push(obj);
                    // }
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

exports.getIssueData = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }

            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Issue = modelDefinitions.model('tbl_issues');
            const Jobs = modelDefinitions.model('tbl_jobs');
            const projects = modelDefinitions.model('tbl_projects');
            Issue.hasOne(Jobs, { foreignKey: "job_id" });
            Jobs.hasOne(projects, { foreignKey: "project_id" });

            let queryWhere = { 'is_deleted': 0 };
            queryWhere['status'] = 1;

            return Issue.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true,
                include: [
                    {
                        model: Jobs, on: { '$tbl_issues.job_id$': { [op.col]: 'tbl_job.job_id' } },
                        include: [
                            {
                                model: projects, on: { '$tbl_job.project_id$': { [op.col]: 'tbl_job.tbl_project.project_id' } },

                            }
                        ]

                    }
                ]

            }).then(async issueData => {
                let finalArray = [];
                let array = issueData.rows;
                for (let i = 0; i < array.length; i++) {
                    let element = array[i].get({ plain: true });
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
                        'job': element.tbl_job.job_code,
                        'project': element.tbl_job.tbl_project.project_code,
                        'projectManager': pro,
                        'status': element.status,
                        'resolvedDate': element.resolved_date
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray, count: issueData.count });
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
                return reject({ success: false, message: " params missing6" });
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

//add Device id
exports.addDeviceId = async function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId)
                return { success: false, message: 'Invalid params' };
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { "user_id": functions.decrypt(data.userId), "is_deleted": 0 };
            return Users.findOne({ attributes: ["user_id", 'device_id'], where: queryWhere }).then(user => {
                if (user) {
                    user.device_id = data.id;
                    return user.save({ "validate": true, "userId": req.session.userId }).then(async (updateres) => {
                        return resolve({ success: true });
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: 'Something went wrong' });
                    });
                } else {
                    return reject({ success: false, message: "User not found" });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Something went wrong' });
            });
        } catch (err) {
            console.log(err);
            return reject({ success: false, message: 'Something went wrong' });
        }
    });
}

// get notifications
exports.getNotifications = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId)
                return { success: false, message: 'Invalid params' };
            const Notifications = modelDefinitions.model('tbl_notification');

            let queryWhere = { 'is_deleted': 0 };

            let userId = functions.decrypt(data.userId)

            if (userId === '1') {
                queryWhere['note_type'] = 3;
            } else {
                queryWhere["to_user"] = userId
            }

            // console.log(queryWhere, 'userId')
            return Notifications.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(async noteData => {
                let finalArray = [];
                let array = noteData.rows;
                for (let i = 0; i < array.length; i++) {
                    let element = array[i].get({ plain: true });

                    let obj = {
                        'notificationId': functions.encrypt(element.notification_id.toString()),
                        'title': element.title,
                        'message': element.message,
                        'date': new Date(element.created_date).getDate(),
                        'month': formatDate(element.created_date),
                        'read': element.read,
                        'noteType': element.note_type,
                        'jobCode': element.job_code
                    };
                    finalArray.push(obj);
                }

                return resolve({ success: true, results: finalArray.reverse(), count: noteData.count });
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

// month format
function formatDate(date) {
    if (date !== undefined && date !== "") {
        var myDate = new Date(date);
        var month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ][myDate.getMonth()];
        var str = month
        return str;
    }
    return "";
}

//notification read status
exports.readNotifications = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId)
                return { success: false, message: 'Invalid params' };
            const Notifications = modelDefinitions.model('tbl_notification');

            let queryWhere = { 'is_deleted': 0 };

            let userId = functions.decrypt(data.userId)

            if (userId === '1') {
                queryWhere['note_type'] = 3;
            } else {
                queryWhere["to_user"] = userId
            }

            return Notifications.findAndCountAll({ where: queryWhere }).then(async (note) => {
                if (note) {
                    let array = []
                    note.rows.forEach(element => {
                        element = element.get({ plain: true });
                        element['read'] = 1;
                        array.push(element);
                    });
                    return Notifications.bulkCreate(array, { updateOnDuplicate: ["read"] }).then(cities => {
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

