const bcrypt = require('bcryptjs');
const functions = require('../../functions');
const modelDefinitions = require('../../app');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const config = require('../../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config['sendgridKey']);
const moment = require('moment');
var param = process.argv[2];
var originurl = config[param];

//Login API
exports.authenticate = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.phoneNumber || !data.userPassword)
                return reject({ success: false, message: 'Phone number or password is missing' });
            const Users = modelDefinitions.model('tbl_users');

            return Users.findAll(
                {
                    where: { "user_phone": data.phoneNumber, "is_deleted": 0 }
                }
            ).then(userdata => {
                if (userdata.length !== 0) {
                    if (!userdata[0].is_verified)
                        return reject({ success: false, message: 'Please contact admin to set your password.' });
                    if (!bcrypt.compareSync(data.userPassword, userdata[0].password))
                        return reject({ success: false, message: 'Password not matched' });
                    if (!userdata[0].is_active)
                        return reject({ success: false, message: 'User is not active. Please contact admin' });
                    let uId = functions.encrypt(userdata[0].user_id.toString());
                    let rmd = functions.randomValueBase64(20);
                    let accessToken = functions.encrypt(rmd);
                    let temp = userdata[0].get({ plain: true });
                    req.session.userId = uId;
                    req.session.token = accessToken;
                    return resolve({ success: true, UserName: userdata[0].user_name, userType: userdata[0].user_type, userPhone: userdata[0].phone, userEmail: userdata[0].user_email, verificationStatus: true, status: true, authToken: accessToken, userId: uId, message: 'Logged in successfully' });
                } else {
                    return reject({ success: false, message: 'User not found' });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Something went wrong' });
            });
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Something went wrong" });
        }
    })
}

//Check Password set URL Status
exports.checkUrlStatus = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            console.log(data);
            if (!data.userId || !data.accessToken)
                return reject({ success: false, message: 'Invalid params' });
            let userId = functions.decrypt(data.userId);
            userId = Number(userId);
            let actoken = functions.decrypt(data.accessToken);
            const Users = modelDefinitions.model('tbl_users');
            return Users.findAll({ attributes: ['password_reset_token'], where: { "user_id": userId, "is_deleted": 0 } }).then(userdata => {
                if (userdata.length !== 0 && userdata[0].password_reset_token != null) {
                    if (bcrypt.compareSync(actoken, userdata[0].password_reset_token)) {
                        return resolve({ success: true, message: 'Url valid' });
                    } else {
                        return reject({ success: false, message: 'Url expired' });
                    }
                } else {
                    return reject({ success: false, message: 'Url expired' });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Url expired' });
            });
        } catch (err) {
            console.log(err);
            return reject({ success: false, message: 'Url expired' });
        }
    })
}

//Activate User API
exports.activateUser = function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.userId || !data.accessToken || !data.password)
                return reject({ success: false, message: 'Invalid params' });
            let userId = functions.decrypt(data.userId);
            userId = Number(userId);
            let actoken = functions.decrypt(data.accessToken);
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { "user_id": userId, "is_deleted": 0 };
            return Users.findOne({ attributes: ["user_id", 'password_reset_token'], where: queryWhere }).then(user => {
                if (user) {
                    if (bcrypt.compareSync(actoken, user.password_reset_token)) {
                        user.password_reset_token = bcrypt.hashSync(data.password, 10);
                        user.password = bcrypt.hashSync(data.password, 10);
                        if (req.url == '/activateuser') {
                            user.is_active = true;
                            user.is_verified = true;
                        }
                        return user.save({ "validate": true, "userId": 1 }).then(async updateres => {
                            return resolve({ success: true });
                        }).catch(err => {
                            console.log(err);
                            return reject({ success: false, message: 'Something went wrong' });
                        });
                    } else {
                        return reject({ success: false, message: 'Url expired' });
                    }
                } else {
                    return reject({ success: false, message: "No User found with this userId" });
                }
            }).catch(err => {
                console.log(err);
                return reject({ success: false, message: 'Something went wrong' });
            });
        }
        catch (error) {
            console.log(error);
            return reject({ success: false, message: "Sometyhing went wrong" });
        }
    })
}

//Forgot Password API
exports.forgotPassword = async function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            if (!data.email)
                return { success: false, message: 'Invalid params' };
            let utcString = new Date().toUTCString();
            let timeNow = moment(new Date(utcString)).utcOffset('+0530').format('YYYY-MM-DD HH:mm:ss');
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { "user_email": data.email, "is_deleted": 0 };
            return Users.findOne({ attributes: ["user_id", 'user_name', 'password_reset_token'], where: queryWhere }).then(user => {
                if (user) {
                    let accessToken = functions.randomValueBase64(20);
                    let hash = bcrypt.hashSync(accessToken, 10);
                    user.password_reset_token = hash;
                    return user.save({ "validate": true, "userId": '2b' }).then(async (updateres) => {
                        let token = functions.encrypt(accessToken);
                        let tStamp = functions.encrypt(timeNow)
                        let uId = functions.encrypt(user.user_id.toString());
                        let url = originurl + '/#/resetpassword?uid=' + uId + '&resetToken=' + token + '&tC=' + tStamp;
                        let email = data.email;
                        let email_res = await sendPassResetEmail(url, email, user.user_name);
                        if (email_res.success) {
                            return resolve(email_res);
                        } else {
                            return reject(email_res);
                        }
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

//Function to send password reset link
function sendPassResetEmail(reseturl, email, name) {
    return new Promise(function (resolve, reject) {
        const msg = {
            to: email,
            from: config.fromMailId,
            subject: 'Reset Password - Optima Heat', // Subject line
            html: '<p>Hello ' + functions.capitalizeString(name) + ',</p></br> <p> Did you forget your password to sign in to Optima Heat ? Let \'s get you a new one.</p></br><p>You have requested a new password for ' + email + ' </p></br><a style="color: #FFFFFF; background-color: #286ba5;padding: 7px 14px;text-decoration:none;" href="' + reseturl + '">Reset Password</a></br></br><p>Thanks,</p></br><b>Optima Heat Support Team</b>' // html body
        };
        sgMail.send(msg).then(() => {
            return resolve({ "success": true, "message": "Password reset link is sent to your email. please check" });
        }).catch(error => {
            return reject({ "success": false, "message": "Failed to send password reset link", "error": error.toString() });
        });
    });
}

//Change Password API
exports.changePassword = async function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            console.log(data);
            if (!data.email)
                return { success: false, message: 'Invalid params' };
            data.id = null;
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { "user_email": data.email, "is_deleted": 0 };
            return Users.findOne({ attributes: ["user_id", 'password'], where: queryWhere }).then(user => {
                if (user) {
                    if (!bcrypt.compareSync(data.old_password, user.password)) {
                        return reject({ success: false, message: 'Old Password not matched' });
                    } else {
                        user.password = bcrypt.hashSync(data.new_password, 10);
                        return user.save({ "validate": true, "userId": req.session.userId }).then(async (updateres) => {
                            return resolve({ success: true });
                        }).catch(err => {
                            console.log(err);
                            return reject({ success: false, message: 'Something went wrong' });
                        });
                    }
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

//Change Password for Admin API
exports.adminChangePassword = async function (req) {
    return new Promise(function (resolve, reject) {
        try {
            let data = req.body;
            console.log(data);
            if (!data.userId)
                return { success: false, message: 'Invalid params' };
            let userId = functions.decrypt(data.userId);
            userId = Number(userId);
            const Users = modelDefinitions.model('tbl_users');
            let queryWhere = { "user_id": userId, "is_deleted": 0 };
            return Users.findOne({ attributes: ["user_id", 'password'], where: queryWhere }).then(user => {
                if (user) {
                    user.password = bcrypt.hashSync(data.new_password, 10);
                    user.is_active = true;
                    user.is_verified = true;
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