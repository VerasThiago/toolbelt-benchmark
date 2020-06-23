"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const ramda_1 = require("ramda");
const env = tslib_1.__importStar(require("../../env"));
const Headers_1 = require("../../lib/constants/Headers");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const getAvailableRoles = async (token, supportedAccount) => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    const response = await axios_1.default.get(`https://app.io.vtex.com/vtex.support-authority/v0/${account}/${workspace}/${supportedAccount}/roles`, {
        headers: {
            Authorization: token,
            [Headers_1.Headers.VTEX_ORIGINAL_CREDENTIAL]: token,
            ...(env.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env.cluster() } : null),
        },
    });
    return response.data;
};
const promptRoles = async (roles) => {
    const cancel = 'Cancel';
    const chosen = ramda_1.prop('role', await enquirer_1.default.prompt({
        name: 'role',
        message: 'Which role do you want to assume?',
        type: 'select',
        choices: [...roles, cancel],
    }));
    if (chosen === cancel) {
        logger_1.default.info('Bye! o/');
        return process.exit();
    }
    return chosen;
};
const loginAsRole = async (token, supportedAccount, role) => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    const response = await axios_1.default.get(`https://app.io.vtex.com/vtex.support-authority/v0/${account}/${workspace}/${supportedAccount}/login/${role}`, {
        headers: {
            Authorization: token,
            [Headers_1.Headers.VTEX_ORIGINAL_CREDENTIAL]: token,
            ...(env.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env.cluster() } : null),
        },
    });
    return response.data;
};
const assertToken = (raw) => {
    if (!jsonwebtoken_1.default.decode(raw)) {
        throw Error(`Could not validate new token! token = '${raw}'`);
    }
};
const saveSupportCredentials = (account, token) => {
    const session = SessionManager_1.SessionManager.getSingleton();
    session.DEPRECATEDchangeAccount(account);
    session.workspaceSwitch({ targetWorkspace: 'master' });
    session.DEPRECATEDchangeToken(token);
};
exports.default = async (account) => {
    if (!account) {
        logger_1.default.error(`Please specify the account that will receive support. type vtex --help for more information.`);
        return;
    }
    const actualToken = SessionManager_1.SessionManager.getSingleton().token;
    try {
        const roles = await getAvailableRoles(actualToken, account);
        if (roles.length === 0) {
            logger_1.default.error('No support roles available for this account.');
            return;
        }
        const role = await promptRoles(roles);
        const newToken = await loginAsRole(actualToken, account, role);
        assertToken(newToken);
        saveSupportCredentials(account, newToken);
        logger_1.default.info(`Logged into ${chalk_1.default.blue(account)} with role ${role}!`);
    }
    catch (err) {
        if (err.message) {
            logger_1.default.error(err.message);
            if (err.response && err.response.status === 404) {
                logger_1.default.info('Make sure vtex.support-authority is installed in your workspace.');
            }
            return;
        }
        logger_1.default.error(err);
    }
};
