
const dashboardService = require('../services/dashboardservices');

exports.routes = function (app) {

    //dashboard APIs
    app.post('/getactivejob', dashboardService.getActiveJob); //Get Active job API
    app.post('/getduereview', dashboardService.getDueReview); //Get due review API
    app.post('/getissuedata', dashboardService.getIssueData); //Get issues API

    //notifications apis
    app.post('/adddeviceid', dashboardService.addDeviceId); //Get issues API
    app.post('/getnotifications', dashboardService.getNotifications); //Get issues API
    app.post('/readnotifications', dashboardService.readNotifications); //Get issues API
    

}