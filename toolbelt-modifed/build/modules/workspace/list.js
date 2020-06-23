"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const table_1 = require("../../table");
exports.default = () => {
    const { account, workspace: currentWorkspace } = SessionManager_1.SessionManager.getSingleton();
    logger_1.default.debug('Listing workspaces');
    const table = table_1.createTable({ head: ['Name', 'Weight', 'Production'] });
    const workspaces = Workspaces_1.createWorkspacesClient();
    return workspaces
        .list(account)
        .then((workspaceArray) => workspaceArray.forEach(workspace => {
        const name = workspace.name === currentWorkspace ? chalk_1.default.green(`* ${workspace.name}`) : workspace.name;
        const { weight } = workspace;
        const { production } = workspace;
        table.push([name, weight, production]);
    }))
        .then(() => console.log(table.toString()));
};
