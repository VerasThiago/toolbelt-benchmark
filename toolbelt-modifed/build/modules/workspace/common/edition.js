"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Sponsor_1 = require("../../../lib/clients/IOClients/apps/Sponsor");
const ErrorKinds_1 = require("../../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../../lib/error/ErrorReport");
const logger_1 = tslib_1.__importDefault(require("../../../logger"));
const prompts_1 = require("../../prompts");
const setEdition_1 = tslib_1.__importDefault(require("../../sponsor/setEdition"));
const recommendedEdition = 'vtex.edition-store@2.x';
const getCurrEdition = async () => {
    var _a;
    const sponsor = Sponsor_1.Sponsor.createClient({ workspace: 'master' });
    try {
        return await sponsor.getEdition();
    }
    catch (err) {
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) !== 404) {
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.EDITION_REQUEST_ERROR,
                originalError: err,
            });
            logger_1.default.debug(`Non-fatal error checking account edition: ${err.message}`);
        }
        return null;
    }
};
const promptSwitchEdition = (currEditionId) => {
    logger_1.default.warn(`This account is using the edition ${chalk_1.default.blue(currEditionId)}.`);
    logger_1.default.warn(`If you are developing your store in IO, it is strongly recommended that you switch to the ${chalk_1.default.blue(recommendedEdition)}.`);
    logger_1.default.warn(`For more information about editions, check ${chalk_1.default.blue('https://vtex.io/docs/concepts/edition-app/')}`);
    return prompts_1.promptConfirm(`Would you like to change the edition to ${chalk_1.default.blue(recommendedEdition)} now?`, false);
};
async function ensureValidEdition(workspace) {
    const edition = await getCurrEdition();
    if (edition && edition.vendor === 'vtex' && edition.name === 'edition-business') {
        const shouldSwitch = await promptSwitchEdition(edition.id);
        if (shouldSwitch) {
            await setEdition_1.default(recommendedEdition, workspace, true);
        }
    }
}
exports.ensureValidEdition = ensureValidEdition;
