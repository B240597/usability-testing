const { transports } = require('winston');
const winston = require('winston');
require('winston-daily-rotate-file');

let transport = new winston.transports.DailyRotateFile({
    filename: './logs/daily_query_log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'all'
});

let logger = winston.createLogger({
    transports: [transport]
});

module.exports = {
    'sessionSecret': 'optima2021!@#',
    'algorithm': 'aes-256-ctr',
    'local': 'http://localhost:4200',
    'dev': 'https://dev.optimaheat.org',
    'live': 'https://optimaheat.org',
    'localServ': 'http://localhost:6500',
    'devServ': 'https://dev.optimaheat.org/:6501',
    'liveServ': 'https://optimaheat.org/:6503',
    'undefined': 'http://localhost:4200',
    'localDB': {
        connectionLimit: 100,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'project_management',
        dialect: 'mysql',
        logger: logger,
        logging: true
    },
    'localport': 6500,
}
