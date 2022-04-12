//Declarations required to use in this file are declared here
const modelDefinitions = require('../../app');
const functions = require('../../functions');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const config = require('../../config');
const bcrypt = require('bcryptjs');
const param = process.argv[2];
const originurl = config[param];
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendgridKey);

//Lookup Api's

exports.getLookupOptions = async function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!("page" in data) || !("per_page" in data)) {
                return reject({ "success": false, "message": "Pagination params missing." })
            }
            let orderBy = [
                ["lookup_id", "desc"]
            ];
            let start_limit = parseInt(data["page"]) * parseInt(data["per_page"]);
            const LookupOptions = modelDefinitions.model('tbl_lookup_options');
            const CodeMaster = modelDefinitions.model('tbl_code_master');

            LookupOptions.hasOne(CodeMaster, { foreignKey: 'code_master_id' });
            return LookupOptions.findAndCountAll({
                attributes: ["code_master_id", "lookup_name", "lookup_id", "is_active", "is_deleted"],
                where: { 'is_deleted': 0 },
                limit: parseInt(data["per_page"]),
                offset: start_limit,
                order: orderBy,
                distinct: true,
                include: [
                    { model: CodeMaster, on: { '$tbl_lookup_options.code_master_id$': { [op.col]: 'tbl_code_master.code_master_id' } } }
                ]
            }).then(lookups => {
                let results = [];
                lookups.rows.forEach(element => {
                    element = element.get({ plain: true });
                    element['code_name'] = element.tbl_code_master.code_name;
                    delete element.tbl_code_master;
                    results.push(element);
                });
                return resolve({ "success": true, "results": results, "count": lookups.count });
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

exports.addLookups = async function (req) {
    return new Promise(function (resolve, reject) {
        let data = req.body;
        if (!data.code_master_id || !data.lookup_names.length)
            return reject({ success: false, message: 'Invalid params' });
        let userId = functions.decrypt(req.session.userId);
        const LookupOptions = modelDefinitions.model('tbl_lookup_options');
        let finalItems = [];
        for (let i = 0; i < data.lookup_names.length; i++) {
            let item = { "code_master_id": data.code_master_id, "lookup_name": data.lookup_names[i], "created_by": userId, "modified_by": userId };
            finalItems.push(item);
        }
        LookupOptions.bulkCreate(finalItems, { "validate": true, "userId": req.session.userId }).then(lookup_res => {
            return resolve({ "success": true });
        }).catch(err => {
            console.log(err);
            return reject({ "success": false, "message": 'Something went wrong' });
        });
    });
}

exports.updateLookup = async function (req) {
    return new Promise(function (resolve, reject) {
        let data = req.body;
        if (!data.lookup_id)
            return reject({ success: false, message: 'Invalid params' });
        data.id = data.lookup_id;
        let queryWhere = { "lookup_id": { [op.in]: [data.lookup_id] } };
        const LookupOptions = modelDefinitions.model('tbl_lookup_options');
        LookupOptions.findOne({ attributes: ["lookup_id", "lookup_name", "is_active", "is_deleted"], where: queryWhere }).then(lookup => {
            if (lookup) {
                delete data.lookup_id;
                for (let key in data) {
                    lookup[key] = data[key];
                }
                return lookup.save({ "validate": true, "userId": req.session.userId }).then(updateres => {
                    return resolve({ "success": true });
                }).catch(err => {
                    console.log(err);
                    return reject({ success: false, message: 'Something went wrong' });
                });
            } else {
                return reject({ "success": false, "message": "Lookup option not found" });
            }
        }).catch(err => {
            console.log(err);
            return reject({ "success": false, "message": "Something went wrong" });
        })
    });
}

//Settings Api's

//Get Setting API
exports.getSettings = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }
            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            const Settings = modelDefinitions.model('tbl_settings');
            return Settings.findAndCountAll({ offset: start_limit, limit: parseInt(data.per_page) }).then(settingsData => {
                let finalArray = [];
                settingsData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    let obj = { 'Name': element.name, 'Description': element.description, 'settingsId': functions.encrypt(element.settings_id.toString()), 'settingValue': element.value };
                    finalArray.push(obj);
                })
                return resolve({ success: true, results: finalArray, count: settingsData.count });
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

//Update Setting API
exports.updateSettings = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.settingsId) {
                return resolve({ success: false, message: "settingsId is missing" });
            }
            const Settings = modelDefinitions.model('tbl_settings');
            let queryWhere = { 'settings_id': functions.decrypt(data.settingsId) };
            return Settings.findOne({ where: queryWhere }).then(settingData => {
                if (settingData) {
                    delete data.settingsId;
                    settingData['value'] = data.new_value;
                    return settingData.save({ "validate": true, "userId": 1 }).then(settingDataUpdated => {
                        return resolve({ success: true, message: "Settings updated successfully" });
                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "No city exists with this cityId" });
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

// User Api's

//Add New User API
exports.addNewUser = function (req) {
    return new Promise(async function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userName || !data.userPhone || !data.userCode)
                return reject({ auth: false, message: 'Input parameters are missing' });
            const Users = modelDefinitions.model("tbl_users");
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            queryWhere['user_code'] = data.userCode;
            return Users.findAll({ where: queryWhere }).then(userCodeData => {
                if (userCodeData.length) {
                    return reject({ success: false, message: "User with same code already exists" });
                }
                else {
                    return Users.findAll({ where: { 'user_phone': data.userPhone, 'is_deleted' : 0 } }).then(userPhoneData => {
                        if (userPhoneData.length) {
                            return reject({ success: false, message: "User with same Phone Number already exists" });
                        }
                        else {
                            modelDefinitions.getSequelize().transaction().then(function (t) {
                                var accessToken = functions.randomValueBase64(20);
                                let hash = bcrypt.hashSync(accessToken, 10);
                                let finalObj = {};
                                finalObj['user_name'] = data.userName;
                                finalObj['user_email'] = data.userEmail;
                                finalObj['user_type'] = data.userType;
                                finalObj['user_code'] = data.userCode;
                                finalObj['password'] = hash;
                                finalObj['password_reset_token'] = hash;
                                finalObj['user_phone'] = data.userPhone;
                                finalObj['is_active'] = data.status;
                                Users.create(finalObj, { "validate": true, "userId": 1, 'transaction': t }).then(async (usrres) => {
                                    t.commit();
                                    return resolve({ success: true, message: "User added successfully" });
                                }).catch(err => {
                                    console.log(err);
                                    return reject({ "success": false, "message": 'Something went wrong' });
                                });
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        return reject({ success: false, message: "Something went wrong" });
                    })
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: "Something went wrong" });
            })

        } catch (err) {
            console.log(err);
            logger.info("in catch")
            return reject({ "success": false, "message": 'Something went wrong' });
        }
    });
}

//Function to send account activation email to the added user
function sendActivationEmail(url, email, name, sendingEmail, transaction) {
    return new Promise(function (resolve, reject) {
        const msg = {
            to: email,
            from: sendingEmail,
            subject: 'Account Activation - optimaheat',
            html: '<p>Hello ' + functions.capitalizeString(name) + ',</p></br> <p>Welcome to Optima Heat, please click the below link to activate your account.</p> </br>' + ' </p></br><a style="color: #FFFFFF; background-color: #286ba5;padding: 7px 14px;text-decoration:none;" href="' + url + '">Click Here</a></br></br>' + '</br></br > <p>Thanks</p></br > <b>Optima Heat Support Team</b>' // html body
        };
        sgMail.send(msg).then(() => {
            return resolve({ "success": true, "message": "Account activation link is sent to your email. please check" });
        }).catch(error => {
            return reject({ "success": false, "message": "Failed to send verification link", "error": error.toString() });
        });
    });
}

//Get Users API
exports.getUsers = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.per_page || !("page" in data)) {
                return reject({ success: false, message: "Pagination params missing" });
            }
            let start_limit = parseInt(data.page) * parseInt(data.per_page);
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            let userID = functions.decrypt(req.session.userId)
            if (userID != 1) {
                queryWhere['user_id'] = { [op.notIn]: [userID] };
            }

            if ("userName" in data) {
                queryWhere['user_name'] = { [op.like]: '%' + data.userName + '%' };
            }
            if ("status" in data) {
                queryWhere["is_active"] = data.status;
            }
            const Users = modelDefinitions.model("tbl_users");
            return Users.findAndCountAll({
                where: queryWhere, offset: start_limit, limit: parseInt(data.per_page), distinct: true
            }).then(userData => {
                let finalArray = [];
                userData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    let finalObj = {};
                    finalObj['userName'] = element.user_name;
                    finalObj['userId'] = functions.encrypt(element.user_id.toString());
                    finalObj['userType'] = element.user_type;
                    finalObj['userEmail'] = element.user_email;
                    finalObj['userPhone'] = element.user_phone;
                    finalObj['userCode'] = element.user_code;
                    finalObj['verificationStatus'] = element.is_verified;
                    finalObj['status'] = element.is_active;
                    finalObj['deleteStatus'] = element.is_deleted;
                    finalArray.push(finalObj);
                })
                return resolve({ success: true, results: finalArray, count: userData.count });
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

//Get User drop down (Project Manager / engineer)
exports.getUsersDropdown = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userType) {
                return reject({ success: false, message: " params missing5" });
            }
            let queryWhere = {};
            queryWhere['is_deleted'] = 0;
            if ("userType" in data) {
                queryWhere['user_type'] = { [op.like]: '%' + data.userType + '%' };
            }
            const Users = modelDefinitions.model("tbl_users");
            return Users.findAndCountAll({
                where: queryWhere, distinct: true
            }).then(userData => {
                let finalArray = [];
                userData.rows.forEach(element => {
                    element = element.get({ plain: true });
                    let finalObj = {};
                    finalObj['userName'] = element.user_name;
                    finalObj['userId'] = functions.encrypt(element.user_id.toString());
                    finalObj['userType'] = element.user_type;
                    finalObj['userEmail'] = element.user_email;
                    finalObj['userPhone'] = element.user_phone;
                    finalObj['userCode'] = element.user_code;
                    finalObj['verificationStatus'] = element.is_verified;
                    finalObj['status'] = element.is_active;
                    finalObj['deleteStatus'] = element.is_deleted;
                    finalArray.push(finalObj);
                })
                return resolve({ success: true, results: finalArray, count: userData.count });
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

//Update User Status API
exports.updateUserStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId) {
                return resolve({ success: false, message: "userId is missing" });
            }
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { 'user_id': functions.decrypt(data.userId) };
            return Users.findOne({ where: queryWhere }).then(userData => {
                if (userData) {
                    delete data.userId;
                    if ("status" in data) {
                        userData["is_active"] = data.status;
                    }
                    else
                        userData['is_deleted'] = data.deleteStatus;
                    return userData.save({ "validate": true, "userId": 1 }).then(userDataUpdated => {
                        if (data.deleteStatus)
                            return resolve({ success: true, message: "User deleted successfully" });
                        else {
                            if (data.status)
                                return resolve({ success: true, message: "User activated successfully" });
                            else
                                return resolve({ success: true, message: "User deactivated successfully" });
                        }
                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "No User exists with this roleId" });
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

//Update User API
exports.updateUser = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId) {
                return resolve({ success: false, message: "userId is missing" });
            }
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { 'user_id': functions.decrypt(data.userId) };
            return Users.findOne({ where: queryWhere }).then(userData => {
                if (userData) {
                    delete data.userId;
                    userData['user_name'] = data.userName;
                    userData['user_code'] = data.userCode;
                    userData['user_email'] = data.userEmail;
                    userData['user_type'] = data.userType;
                    userData['is_active'] = data.status;
                    userData['user_phone'] = data.userPhone;
                    return userData.save({ "validate": true, "userId": 1 }).then(userDataUpdated => {
                        return resolve({ success: true, message: "User updated successfully" });
                    }).catch(error => {
                        console.log(error);
                        return reject({ success: false, message: "Something went wrong" });
                    });
                }
                else {
                    return reject({ success: false, message: "No user exists with this userId" });
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