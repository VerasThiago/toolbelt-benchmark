"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const ramda_1 = require("ramda");
const logger_1 = tslib_1.__importDefault(require("../../../logger"));
const prompts_1 = require("../../prompts");
const status_1 = tslib_1.__importDefault(require("./status"));
const utils_1 = require("./utils");
const SessionManager_1 = require("../../../lib/session/SessionManager");
const { account } = SessionManager_1.SessionManager.getSingleton();
const promptContinue = (workspace) => {
    return prompts_1.promptConfirm(`You are about to finish A/B testing in workspace \
${chalk_1.default.blue(workspace)}, account ${chalk_1.default.green(account)}. Are you sure?`, false);
};
const promptWorkspaceToFinishABTest = () => utils_1.abtester
    .status()
    .then(ramda_1.map(({ WorkspaceB }) => WorkspaceB))
    .then((workspaces) => enquirer_1.default.prompt({
    name: 'workspace',
    message: 'Choose which workspace to finish A/B testing:',
    type: 'select',
    choices: workspaces,
}))
    .then(ramda_1.prop('workspace'));
exports.default = async () => {
    await utils_1.installedABTester();
    const workspace = await promptWorkspaceToFinishABTest();
    const promptAnswer = await promptContinue(workspace);
    if (!promptAnswer) {
        return;
    }
    logger_1.default.info('Finishing A/B tests');
    logger_1.default.info(`Latest results:`);
    await status_1.default();
    await utils_1.abtester.finish(workspace);
    logger_1.default.info(`A/B testing with workspace ${chalk_1.default.blue(workspace)} is now finished`);
    logger_1.default.info(`No traffic currently directed to ${chalk_1.default.blue(workspace)}`);
};
