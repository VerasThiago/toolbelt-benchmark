"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
const util_1 = tslib_1.__importDefault(require("util"));
const winston_1 = require("winston");
const Paths_1 = require("./lib/constants/Paths");
const verbose_1 = require("./verbose");
// The debug file is likely to be on ~/.config/configstore/vtex_debug.txt
exports.DEBUG_LOG_FILE_PATH = path_1.join(Paths_1.PathConstants.LOGS_FOLDER, 'debug.json');
const isObject = (a) => {
    return !!a && a.constructor === Object;
};
const addArgs = winston_1.format(info => {
    // @ts-ignore
    const args = info[Symbol.for('splat')];
    info.args = args ? [...args] : [];
    return info;
});
const messageFormatter = winston_1.format.printf(info => {
    const { timestamp: timeString = '', sender = '', message, args = [] } = info;
    const formattedMsgWithArgs = util_1.default.formatWithOptions({ colors: true }, message, ...args);
    const msg = `${chalk_1.default.gray(timeString)} - ${info.level}: ${formattedMsgWithArgs}  ${chalk_1.default.gray(sender)}`;
    return msg;
});
// JSON.stringify doesn't get non-enumerable properties
// This is a workaround based on https://stackoverflow.com/a/18391400/11452359
const errorJsonReplacer = (key, value) => {
    if (key === '' && isObject(value) && value.args != null) {
        value.args = value.args.map((arg) => {
            if (arg instanceof Error) {
                const error = {};
                Object.getOwnPropertyNames(arg).forEach(objKey => {
                    error[objKey] = arg[objKey];
                });
                return error;
            }
            return arg;
        });
    }
    return value;
};
exports.consoleLoggerLevel = () => {
    return verbose_1.isVerbose ? 'debug' : 'info';
};
exports.fileLoggerLevel = () => {
    return 'debug';
};
const logger = winston_1.createLogger({
    format: winston_1.format.combine(addArgs(), winston_1.format.timestamp({ format: 'HH:mm:ss.SSS' })),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), messageFormatter),
            level: exports.consoleLoggerLevel(),
        }),
        new winston_1.transports.File({
            filename: exports.DEBUG_LOG_FILE_PATH,
            format: winston_1.format.combine(winston_1.format.json({ replacer: errorJsonReplacer, space: 2 })),
            level: exports.fileLoggerLevel(),
            maxsize: 5e6,
            maxFiles: 2,
        }),
    ],
});
const levels = ['debug', 'info', 'error', 'warn', 'verbose', 'silly'];
levels.forEach(level => {
    logger[level] = (msg, ...remains) => {
        if (remains.length > 0 && isObject(remains[0]) && remains[0].message) {
            msg = `${msg} `;
        }
        if (typeof msg !== 'string') {
            return logger.log(level, '', msg, ...remains);
        }
        logger.log(level, msg, ...remains);
    };
});
logger.on('error', err => {
    console.error('A problem occured with the logger:');
    console.error(err);
});
logger.on('finish', info => {
    console.log(`Logging has finished: ${info}`);
});
exports.default = logger;
