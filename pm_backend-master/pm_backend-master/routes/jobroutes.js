const jobService = require('../services/jobservices');

exports.routes = function (app) {

    //Job APIs
    app.post('/addjob', jobService.addJob); //Add Job API
    app.post('/getjob', jobService.getJobs); //Get Job API
    app.post('/getjobmanagement', jobService.getJobManagement); //Get Job API

    app.put('/updatejobstatus', jobService.updateJobStatus); //Update job Status API

    //Review  APIs
    app.post('/addreview', jobService.addReviewDate); //Add Review API
    app.post('/getreview', jobService.getReviewDate); //Get Review API
    app.put('/updatreview', jobService.updateReviewStatus); //Update Review Status API

    //Issue  APIs
    app.post('/addissue', jobService.addIssueDate); //Add Issue API
    app.post('/getissue', jobService.getIssueDate); //Get Issue API
    app.put('/updateissue', jobService.updateIssueStatus); //Update Issue Status API

    //Gird Columns
    app.post('/getjobgridcolumns', jobService.getJobGridColumns); //Get job grid columns API
    app.put('/updatejobgridcolumns', jobService.updateJobGridColumns); //Update  job grid columns API

}