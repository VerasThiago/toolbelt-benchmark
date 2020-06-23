"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const logger_1 = tslib_1.__importDefault(require("./logger"));
const SessionManager_1 = require("./lib/session/SessionManager");
const Workspaces_1 = require("./lib/clients/IOClients/infra/Workspaces");
const workspaceState = (meta) => (meta.production ? 'production' : 'dev');
const getWorkspaceState = async (account, workspace) => {
    try {
        const workspaces = Workspaces_1.createWorkspacesClient();
        const meta = await workspaces.get(account, workspace);
        return `${workspaceState(meta)} `;
    }
    catch (err) {
        logger_1.default.debug(`Unable to fetch workspace state`);
        logger_1.default.debug(err.message);
        return undefined;
    }
};
exports.greeting = async () => {
    const { account, userLogged, workspace } = SessionManager_1.SessionManager.getSingleton();
    if (account && userLogged && workspace) {
        let loggedMessage = 'Logged into';
        let state = await getWorkspaceState(account, workspace);
        if (!state) {
            loggedMessage = `${chalk_1.default.red('Not logged in')}. Previously logged into`;
            state = '';
        }
        return [
            `${loggedMessage} ${chalk_1.default.blue(account)} as ${chalk_1.default.green(userLogged)} at ${chalk_1.default.yellowBright(state)}workspace ${chalk_1.default.green(workspace)}`,
        ];
    }
    return ['Welcome to VTEX I/O', `Login with ${chalk_1.default.green('vtex login')} ${chalk_1.default.blue('<account>')}`];
};
