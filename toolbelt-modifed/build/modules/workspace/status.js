"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const workspaceState = (meta) => (meta.production ? 'production' : 'dev');
exports.default = async (name) => {
    const session = SessionManager_1.SessionManager.getSingleton();
    const { account } = session;
    const workspace = name || session.workspace;
    const workspaces = Workspaces_1.createWorkspacesClient();
    const meta = await workspaces.get(account, workspace);
    logger_1.default.info(`Workspace ${chalk_1.default.green(workspace)} in account ${chalk_1.default.blue(account)} is a ${chalk_1.default.yellowBright(workspaceState(meta))} workspace with weight ${chalk_1.default.yellowBright(`${meta.weight}`)}`);
};
