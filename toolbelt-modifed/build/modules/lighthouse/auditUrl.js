"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const Lighthouse_1 = require("../../lib/clients/IOClients/apps/Lighthouse");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const TableGenerator_1 = require("./TableGenerator");
async function isProdutionWorkspace(account, workspace) {
    const workspaces = Workspaces_1.createWorkspacesClient();
    const meta = await workspaces.get(account, workspace);
    return meta.production;
}
exports.default = async (url, option) => {
    const { workspace, account } = SessionManager_1.SessionManager.getSingleton();
    if (await isProdutionWorkspace(account, workspace)) {
        logger_1.default.error(`You cannot run lighthouse audits on production workspaces.`);
        return;
    }
    const spinner = ora_1.default(`Running Lighthouse on url: ${chalk_1.default.blue(url)}`).start();
    try {
        const lighthouse = Lighthouse_1.Lighthouse.createClient();
        const report = await lighthouse.runAudit(url);
        spinner.stop();
        if (option.json) {
            console.log(JSON.stringify(report, null, 1));
        }
        else {
            const table = new TableGenerator_1.TableGenerator();
            table.addReportScores(report);
            table.show();
        }
    }
    catch (error) {
        spinner.stop();
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({ originalError: error });
        logger_1.default.error(error);
    }
};
