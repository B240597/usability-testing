const adminService = require('../services/adminservices');

exports.routes = function (app) {

    //Lookups APIs
    app.post('/getlookupoptions', adminService.getLookupOptions);
    app.post('/addlookupsurl', adminService.addLookups);
    app.put('/updatelookup', adminService.updateLookup);

    // Settings APIs
    app.post('/getsettings', adminService.getSettings); //Get Settings API
    app.put('/updatesettings', adminService.updateSettings); //Update Settings API
    
    //User APIs
    app.post('/addnewuser',adminService.addNewUser); //Add New User API
    app.post('/getusers',adminService.getUsers); //Get Users API
    app.post('/getusersdropdown',adminService.getUsersDropdown); //Get Users drop down APIs
    app.put('/updateuserstatus',adminService.updateUserStatus); //Update User Status API
    app.put('/updateuser',adminService.updateUser); //Update User API
}