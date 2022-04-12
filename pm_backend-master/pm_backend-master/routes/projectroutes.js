
const projectService = require('../services/projectservices');

exports.routes = function (app) {

    //Project APIs
    app.post('/addproject', projectService.addProject); //Add Project API
    app.post('/getproject', projectService.getProjects); //Get Project API
    app.post('/getprojectdropdown', projectService.getProjectDropdown); //Get Project Drop Down API
    app.put('/updateproject', projectService.updateProject); //Update Project API
    app.put('/updateprojectstatus', projectService.updateProjectStatus); //Update Project Status API

    //Gird Columns
    app.post('/getprojectgridcolumns', projectService.getProjectGridColumns); //Get project grid columns API
    app.put('/updateprojectgridcolumns', projectService.updateProjectGridColumns); //Update  project grid columns API

}