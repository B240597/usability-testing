const authService = require('../services/authservices');

exports.routes = function (app) {
    app.use(function timeLog(req, res, next) {
        try {
            let skipUrls = { "/": true, "/authenticate": true, "/checksession": true, "/logout": true, "/checkurlstatus": true, "/activateuser": true, "/resetpassword": true, "/forgotpassword": true, "/checkresetpassurlstatus": true };
            if (skipUrls[req.url]) return next();
            let bearerHeader = req.headers["authorization"];
            let bearer = bearerHeader.split(" ");
            let bearerToken = bearer[1];
            if (req.session.token === bearerToken) {
                next();
            } else {
                res.status(401).send({ success: false, message: 'Failed to authenticate token. 1' });
            }
        } catch (err) {
            res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
        }
    });
    app.post('/authenticate', authService.authenticate); //Login API
    app.get('/checksession', authService.checkSession); //Check Session on login
    app.post('/checkurlstatus', authService.checkUrlStatus); //Check Password set URL Status
    app.post('/activateuser', authService.activateUser); //Activate User API
    app.post('/forgotpassword', authService.forgotPassword); //Forgot Password API
    app.post('/resetpassword', authService.resetPassword); //Reset Password API
    app.post('/changepassword', authService.changePassword);//Change password API
    app.post('/adminchangepassword', authService.adminChangePassword);// Change Password For Admin API
    
    app.post('/logout', function (req, res) {
        try {
            if (req.session) {
                req.session.destroy();
            }
            res.json({ success: true, message: 'Logged out successfully' });

        } catch (e) {
            res.status(421).send({ message: 'Failed to process request' });
        }
    }); //Logout API
}