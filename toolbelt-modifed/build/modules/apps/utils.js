"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cli_table2_1 = tslib_1.__importDefault(require("cli-table2"));
const enquirer_1 = tslib_1.__importDefault(require("enquirer"));
const ramda_1 = require("ramda");
const semver_diff_1 = tslib_1.__importDefault(require("semver-diff"));
const errors_1 = require("../../errors");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const Registry_1 = require("../../lib/clients/IOClients/infra/Registry");
const Workspaces_1 = require("../../lib/clients/IOClients/infra/Workspaces");
const manifest_1 = require("../../lib/manifest");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const workspaceExampleName = process.env.USER || 'example';
const workspaceMasterAllowedOperations = ['install', 'uninstall'];
// It is not allowed to link apps in a production workspace.
const workspaceProductionAllowedOperatios = ['install', 'uninstall'];
const builderHubMessagesLinkTimeout = 2000; // 2 seconds
const builderHubMessagesPublishTimeout = 10000; // 10 seconds
exports.workspaceMasterMessage = `This action is ${chalk_1.default.red('not allowed')} in workspace ${chalk_1.default.green('master')}, please use another workspace.
You can run "${chalk_1.default.blue(`vtex use ${workspaceExampleName} -r`)}" to use a workspace named "${chalk_1.default.green(workspaceExampleName)}"`;
exports.workspaceProductionMessage = workspace => `This action is ${chalk_1.default.red('not allowed')} in workspace ${chalk_1.default.green(workspace)} because it is a production workspace. You can create a ${chalk_1.default.yellowBright('dev')} workspace called ${chalk_1.default.green(workspaceExampleName)} by running ${chalk_1.default.blue(`vtex use ${workspaceExampleName} -r`)}`;
exports.promptWorkspaceMaster = async (account) => {
    const confirm = await prompts_1.promptConfirm(`Are you sure you want to force this operation on the ${chalk_1.default.green('master')} workspace on the account ${chalk_1.default.blue(account)}?`, false);
    if (!confirm) {
        return false;
    }
    logger_1.default.warn(`Using ${chalk_1.default.green('master')} workspace. I hope you know what you're doing. 💥`);
    return true;
};
exports.validateAppAction = async (operation, app) => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    if (workspace === 'master') {
        if (!ramda_1.contains(operation, workspaceMasterAllowedOperations)) {
            throw new errors_1.CommandError(exports.workspaceMasterMessage);
        }
        else {
            const confirm = await exports.promptWorkspaceMaster(account);
            if (!confirm) {
                return false;
            }
        }
    }
    const workspaces = Workspaces_1.createWorkspacesClient();
    const workspaceMeta = await workspaces.get(account, workspace);
    if (workspaceMeta.production && !ramda_1.contains(operation, workspaceProductionAllowedOperatios)) {
        throw new errors_1.CommandError(exports.workspaceProductionMessage(workspace));
    }
    // No app arguments and no manifest file.
    const isReadable = await manifest_1.ManifestEditor.isManifestReadable();
    if (!app && !isReadable) {
        throw new errors_1.CommandError(`No app was found, please fix your manifest.json${app ? ' or use <vendor>.<name>[@<version>]' : ''}`);
    }
    return true;
};
exports.wildVersionByMajor = ramda_1.compose(ramda_1.concat(ramda_1.__, '.x'), ramda_1.head, ramda_1.split('.'));
exports.extractVersionFromId = ramda_1.compose(ramda_1.last, ramda_1.split('@'));
exports.pickLatestVersion = (versions) => {
    const start = ramda_1.head(versions);
    return ramda_1.reduce((acc, version) => {
        return semver_diff_1.default(acc, version) ? version : acc;
    }, start, ramda_1.tail(versions));
};
exports.handleError = ramda_1.curry((app, err) => {
    if (err.response && err.response.status === 404) {
        return Promise.reject(new errors_1.CommandError(`App ${chalk_1.default.green(app)} not found`));
    }
    return Promise.reject(err);
});
exports.appLatestVersion = (app, version = 'x') => {
    return Registry_1.createRegistryClient()
        .getAppManifest(app, version)
        .then(ramda_1.prop('id'))
        .then(exports.extractVersionFromId)
        .catch(exports.handleError(app));
};
exports.appLatestMajor = (app) => {
    return exports.appLatestVersion(app).then(exports.wildVersionByMajor);
};
exports.appIdFromRegistry = (app, majorLocator) => {
    return Registry_1.createRegistryClient()
        .getAppManifest(app, majorLocator)
        .then(ramda_1.prop('id'))
        .catch(exports.handleError(app));
};
function optionsFormatter(billingOptions) {
    /** TODO: Eliminate the need for this stray, single `cli-table2` dependency */
    const table = new cli_table2_1.default({
        head: [{ content: chalk_1.default.cyan.bold('Billing Options'), colSpan: 2, hAlign: 'center' }],
        chars: { 'top-mid': '─', 'bottom-mid': '─', 'mid-mid': '─', middle: ' ' },
    });
    if (billingOptions.free) {
        table.push([{ content: chalk_1.default.green('This app is free'), colSpan: 2, hAlign: 'center' }]);
    }
    else {
        table.push([
            { content: 'Plan', hAlign: 'center' },
            { content: 'Values', hAlign: 'center' },
        ]);
        billingOptions.policies.forEach(policy => {
            let rowCount = 0;
            const itemsArray = [];
            policy.billing.items.forEach(i => {
                if (i.fixed) {
                    itemsArray.push([{ content: `${i.fixed} ${i.itemCurrency}`, hAlign: 'center', vAlign: 'center' }]);
                    rowCount++;
                }
                else if (i.calculatedByMetricUnit) {
                    if (i.calculatedByMetricUnit.minChargeValue) {
                        itemsArray.push([`Minimum charge: ${i.calculatedByMetricUnit.minChargeValue} ${i.itemCurrency}`]);
                        rowCount++;
                    }
                    let rangesStr = '';
                    i.calculatedByMetricUnit.ranges.forEach(r => {
                        if (r.inclusiveTo) {
                            rangesStr += `${r.multiplier} ${i.itemCurrency}/${i.calculatedByMetricUnit.metricName} (${r.exclusiveFrom} to ${r.inclusiveTo})`;
                            rangesStr += '\nor\n';
                        }
                        else {
                            rangesStr += `${r.multiplier} ${i.itemCurrency}/${i.calculatedByMetricUnit.metricName} (over ${r.exclusiveFrom})`;
                        }
                    });
                    rowCount++;
                    itemsArray.push([{ content: rangesStr, hAlign: 'center', vAlign: 'center' }]);
                }
                itemsArray.push([{ content: '+', hAlign: 'center' }]);
                rowCount++;
            });
            itemsArray.pop();
            rowCount--;
            table.push([
                {
                    content: `${chalk_1.default.yellow(policy.plan)}\n(Charged montlhy)`,
                    rowSpan: rowCount,
                    colSpan: 1,
                    vAlign: 'center',
                    hAlign: 'center',
                },
                itemsArray[0][0],
            ], ...itemsArray.slice(1));
            table.push([
                {
                    content: `The monthly amount will be charged in ${chalk_1.default.red(policy.currency)}`,
                    colSpan: 2,
                    hAlign: 'center',
                },
            ]);
        });
    }
    table.push([
        { content: chalk_1.default.bold('Terms of use:'), hAlign: 'center' },
        { content: billingOptions.termsURL, hAlign: 'center' },
    ]);
    return table.toString();
}
exports.optionsFormatter = optionsFormatter;
async function checkBuilderHubMessage(cliRoute) {
    const http = axios_1.default.create({
        baseURL: `https://vtex.myvtex.com`,
        timeout: cliRoute === 'link' ? builderHubMessagesLinkTimeout : builderHubMessagesPublishTimeout,
    });
    try {
        const res = await http.get(`/_v/private/builder/0/getmessage/${cliRoute}`);
        return res.data;
    }
    catch (e) {
        return {};
    }
}
exports.checkBuilderHubMessage = checkBuilderHubMessage;
const promptConfirmName = (msg) => enquirer_1.default
    .prompt({
    message: msg,
    name: 'appName',
    type: 'input',
})
    .then(ramda_1.prop('appName'));
async function showBuilderHubMessage(message, showPrompt, manifest) {
    if (message) {
        if (showPrompt) {
            const confirmMsg = `Are you absolutely sure?\n${message ||
                ''}\nPlease type in the name of the app to confirm (ex: vtex.getting-started):`;
            const appNameInput = await promptConfirmName(confirmMsg);
            const AppName = `${manifest.vendor}.${manifest.name}`;
            if (appNameInput !== AppName) {
                throw new errors_1.CommandError(`${appNameInput} doesn't match with the app name.`);
            }
        }
        else {
            logger_1.default.info(message);
        }
    }
}
exports.showBuilderHubMessage = showBuilderHubMessage;
exports.resolveAppId = (appName, appVersion) => {
    const apps = Apps_1.createAppsClient();
    return apps.getApp(`${appName}@${appVersion}`).then(ramda_1.prop('id'));
};
exports.isLinked = ramda_1.propSatisfies(ramda_1.contains('+build'), 'version');
