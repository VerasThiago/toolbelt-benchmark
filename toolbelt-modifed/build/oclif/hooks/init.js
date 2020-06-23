"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const os_1 = tslib_1.__importDefault(require("os"));
const plugin_help_1 = tslib_1.__importDefault(require("@oclif/plugin-help"));
const env_1 = require("../../env");
const CLIPreTasks_1 = require("../../CLIPreTasks/CLIPreTasks");
const TelemetryCollector_1 = require("../../lib/telemetry/TelemetryCollector");
const hrTimeToMs_1 = require("../../lib/utils/hrTimeToMs");
const update_1 = require("../../update");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const pkg = tslib_1.__importStar(require("../../../package.json"));
const conf = tslib_1.__importStar(require("../../conf"));
const nps_1 = require("../../nps");
const login_1 = tslib_1.__importDefault(require("../../modules/auth/login"));
const errors_1 = require("../../errors");
const SessionManager_1 = require("../../lib/session/SessionManager");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initTimeStartTime } = require('../../../bin/run');
let loginPending = false;
const logToolbeltVersion = () => {
    logger_1.default.debug(`Toolbelt version: ${pkg.version}`);
};
const checkLogin = async (command) => {
    const whitelist = [undefined, 'config', 'login', 'logout', 'switch', 'whoami', 'init', '-v', '--version', 'release'];
    if (!SessionManager_1.SessionManager.getSingleton().checkValidCredentials() && whitelist.indexOf(command) === -1) {
        logger_1.default.debug('Requesting login before command:', command);
        await login_1.default({});
    }
};
const main = async (options, calculateInitTime) => {
    const cliPreTasksStart = process.hrtime();
    CLIPreTasks_1.CLIPreTasks.getCLIPreTasks(pkg).runTasks();
    TelemetryCollector_1.TelemetryCollector.getCollector().registerMetric({
        command: 'not-applicable',
        ["cliPreTasks:latency" /* CLI_PRE_TASKS_LATENCY */]: hrTimeToMs_1.hrTimeToMs(process.hrtime(cliPreTasksStart)),
    });
    // Show update notification if newer version is available
    update_1.updateNotify();
    const args = process.argv.slice(2);
    conf.saveEnvironment(conf.Environment.Production); // Just to be backwards compatible with who used staging previously
    logToolbeltVersion();
    logger_1.default.debug('node %s - %s %s', process.version, os_1.default.platform(), os_1.default.release());
    logger_1.default.debug(args);
    await checkLogin(options.id);
    await nps_1.checkAndOpenNPSLink();
    if (calculateInitTime) {
        const initTime = process.hrtime(initTimeStartTime);
        const initTimeMetric = {
            command: options.id,
            ["startTime" /* START_TIME */]: hrTimeToMs_1.hrTimeToMs(initTime),
        };
        TelemetryCollector_1.TelemetryCollector.getCollector().registerMetric(initTimeMetric);
    }
};
exports.onError = async (e) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const status = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status;
    const statusText = (_b = e === null || e === void 0 ? void 0 : e.response) === null || _b === void 0 ? void 0 : _b.statusText;
    const headers = (_c = e === null || e === void 0 ? void 0 : e.response) === null || _c === void 0 ? void 0 : _c.headers;
    const data = (_d = e === null || e === void 0 ? void 0 : e.response) === null || _d === void 0 ? void 0 : _d.data;
    const code = (e === null || e === void 0 ? void 0 : e.code) || null;
    if (headers) {
        logger_1.default.debug('Failed request headers:', headers);
    }
    if (status === 401) {
        if (!loginPending) {
            logger_1.default.error('There was an authentication error. Please login again');
            // Try to login and re-issue the command.
            loginPending = true;
            login_1.default({}).then(() => {
                main();
            }); // TODO: catch with different handler for second error
        }
        return; // Prevent multiple login attempts
    }
    if (status) {
        if (status >= 400) {
            const message = data ? data.message : null;
            const source = e.config.url;
            logger_1.default.error('API:', status, statusText);
            logger_1.default.error('Source:', source);
            if ((_e = e.config) === null || _e === void 0 ? void 0 : _e.method) {
                logger_1.default.error('Method:', e.config.method);
            }
            if (message) {
                logger_1.default.error('Message:', message);
                logger_1.default.debug('Raw error:', data);
            }
            else {
                logger_1.default.error('Raw error:', {
                    data,
                    source,
                });
            }
        }
        else {
            logger_1.default.error('Oops! There was an unexpected error:');
            logger_1.default.error(e.read ? e.read().toString('utf8') : data);
        }
    }
    else if (code) {
        switch (code) {
            case 'ENOTFOUND':
                logger_1.default.error('Connection failure :(');
                logger_1.default.error('Please check your internet');
                break;
            case 'EAI_AGAIN':
                logger_1.default.error('A temporary failure in name resolution occurred :(');
                break;
            default:
                logger_1.default.error('Unhandled exception');
                logger_1.default.error('Please report the issue in https://github.com/vtex/toolbelt/issues');
                if (((_f = e.config) === null || _f === void 0 ? void 0 : _f.url) && ((_g = e.config) === null || _g === void 0 ? void 0 : _g.method)) {
                    logger_1.default.error(`${e.config.method} ${e.config.url}`);
                }
                logger_1.default.debug(e);
        }
    }
    else {
        switch (e.name) {
            case errors_1.CommandError.name:
                if (e.message && e.message !== '') {
                    logger_1.default.error(e.message);
                }
                break;
            case errors_1.SSEConnectionError.name:
                logger_1.default.error((_h = e.message) !== null && _h !== void 0 ? _h : 'Connection to login server has failed');
                break;
            default:
                logger_1.default.error('Unhandled exception');
                logger_1.default.error('Please report the issue in https://github.com/vtex/toolbelt/issues');
                logger_1.default.error('Raw error: ', e);
        }
    }
    process.removeListener('unhandledRejection', exports.onError);
    if (e instanceof errors_1.CommandError) {
        process.exit(1);
    }
    const errorReport = TelemetryCollector_1.TelemetryCollector.getCollector().registerError(e);
    logger_1.default.error(`ErrorID: ${errorReport.metadata.errorId}`);
    process.exit(1);
};
async function default_1(options) {
    // overwrite Help#showCommandHelp to customize help formating
    plugin_help_1.default.prototype.showCommandHelp = function (command, topics) {
        const name = command.id;
        const depth = name.split(':').length;
        topics = topics.filter(t => t.name.startsWith(`${name}:`) && t.name.split(':').length === depth + 1);
        const title = command.description && this.render(command.description).split('\n')[0];
        if (title)
            console.log(`\n${title}\n`);
        console.log(this.command(command));
        console.log('');
        if (topics.length > 0) {
            console.log(this.topics(topics));
            console.log('');
        }
    };
    axios_1.default.interceptors.request.use(config => {
        if (env_1.envCookies()) {
            config.headers.Cookie = `${env_1.envCookies()}; ${config.headers.Cookie || ''}`;
        }
        return config;
    });
    process.on('unhandledRejection', exports.onError);
    process.on('exit', () => {
        TelemetryCollector_1.TelemetryCollector.getCollector().flush();
    });
    await main(options, true);
}
exports.default = default_1;
