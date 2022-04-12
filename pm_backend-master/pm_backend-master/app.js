var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var moment = require('moment');
var path = require('path');
var session = require('express-session');
var morgan = require('morgan');
var helmet = require('helmet');
var frameguard = require('frameguard');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access-Log-' + moment().format('DD-MM-YYYY') + '.log'), { flags: 'a' });
var config = require('./config');
var param = process.argv[2];
var originurl = config[param];
const winston = require('winston');
var Sequelize = require("sequelize");
var DataTypes = require("sequelize").DataTypes;
var sequelize = null;
var models = {};

modelsPath = './orm/models';


var corsOptions = {
    origin: originurl,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

var port = config[param + 'port'];
var authRoutes = require('./routes/authroutes');
var adminRoutes = require('./routes/adminroutes');
var projectRoutes = require('./routes/projectroutes');
var jobRoutes = require('./routes/jobroutes');
var dashboardRoutes = require('./routes/dashboardroutes');

//middleware of application.
app.set('port', process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(cookieParser());
app.all('*', function (req, res, next) {
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Content-Length', '52250');
    res.header('X-XSS-Protection', '1');
    res.header('Cache-Control', 'no-cache');
    next();
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));


app.all('*', function (req, res, next) {

    //Origin is the HTML/Angular domain from where the ExpressJS API would be called.
    res.header('Access-Control-Allow-Origin', originurl);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //make sure you set this parameter and make it true so that Angular and Express are able to exchange session values between each other .

    next();

});
app.use(helmet());
app.use(frameguard({ action: 'deny' }));

app.set('trust proxy', 1) // trust first proxy.
app.use(session({
    secret: config.sessionSecret,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 50000,
        resave: true,
        rolling: true,
    },
    saveUninitialized: false,
    resave: false,
    rolling: true
}));

// Setting routes to express app
authRoutes.routes(app);
adminRoutes.routes(app);
projectRoutes.routes(app);
jobRoutes.routes(app);
dashboardRoutes.routes(app);

callDBSetup();

function callDBSetup() {
    logger = config[param + 'DB'].logger;
    sequelize = new Sequelize(config[param + 'DB'].database, config[param + 'DB'].user, config[param + 'DB'].password, {
        host: config[param + 'DB'].host,
        dialect: config[param + 'DB'].dialect,
        logging: config.logging,
        pool: {
            max: config[param + 'DB'].connectionLimit,
            min: 0,
            idle: 10000
        },
    });
    sequelize.authenticate().then(function (result) {
        console.log("connected to db " + config[param + 'DB'].database);
        console.log(config[param + 'DB'].database + " => " + config[param + 'DB'].user + " => " + config[param + 'DB'].password);
    }).catch(function (err) {
        console.log(err);
    });
    init();
}

function init() {
    fs.readdirSync(modelsPath).forEach(function (name) {
        if (name.indexOf(".swp") == -1) {
            var modelName = name.replace(/\.js$/i, "");
            var object = require("./orm/models/" + modelName)(sequelize, DataTypes);
            models[modelName] = object;
        }
        else {
            logger.log(name);
        }
    });
}

this.model = function (name) {
    return models[name];
}

this.getSequelize = function () {
    return sequelize;
}

app.use(function (err, req, res, next) {
    logger.warn("Error here");
    res.status(500).send({ "Error": err.stack });
});

//satrting server.
http.createServer(app).listen(app.get('port'), "0.0.0.0", function () {
    console.log('Server is listening on port ' + app.get('port'));
});