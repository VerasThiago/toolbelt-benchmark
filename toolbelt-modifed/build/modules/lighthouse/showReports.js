"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const Lighthouse_1 = require("../../lib/clients/IOClients/apps/Lighthouse");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const TableGenerator_1 = require("./TableGenerator");
function allWhenUndefined(atribute) {
    return atribute !== null && atribute !== void 0 ? atribute : '<all>';
}
function appUrlFormatString(app, url) {
    return `${chalk_1.default.green(allWhenUndefined(app))} and url: ${chalk_1.default.blue(allWhenUndefined(url))}`;
}
async function showReports(app, url) {
    if (!app && !url) {
        logger_1.default.error('You must specify app or url flags to query reports');
        return;
    }
    const spinner = ora_1.default(`Querying reports containing app: ${appUrlFormatString(app, url)}`).start();
    try {
        const lighthouse = Lighthouse_1.Lighthouse.createClient();
        const reports = await lighthouse.getReports(app, url);
        spinner.stop();
        if (reports.length === 0) {
            logger_1.default.info(`No reports with app: ${appUrlFormatString(app, url)}`);
            return;
        }
        const table = new TableGenerator_1.TableGenerator();
        table.addListOfReports(reports);
        table.show();
    }
    catch (error) {
        spinner.stop();
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({ originalError: error });
        logger_1.default.error(error);
    }
}
exports.showReports = showReports;
