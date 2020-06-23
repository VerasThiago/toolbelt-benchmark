"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const ramda_1 = require("ramda");
const Housekeeper_1 = require("../../lib/clients/IOClients/infra/Housekeeper");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const verbose_1 = require("../../verbose");
const prompts_1 = require("../prompts");
const utils_1 = require("../utils");
const promptUpdate = () => Promise.resolve(prompts_1.promptConfirm('Apply version updates?'));
const toMajorLocator = (appId) => {
    const [appName, appVersion] = appId.split('@', 2);
    return `${appName}@${locator_1.toMajorRange(appVersion)}`;
};
const includes = (k, list) => list.indexOf(k) >= 0;
const sourceFilter = (source) => ramda_1.filter((obj) => includes(ramda_1.prop('source', obj), [source]));
const printAppsDiff = (resolvedUpdates, message, type, source, onlyShowTableIfVerbose) => {
    let filterFunction;
    let pluckFunction;
    if (type === 'apps') {
        if (!source) {
            throw new Error(`source argument must be supplied when type === 'apps'`);
        }
        filterFunction = sourceFilter(source);
        pluckFunction = ramda_1.pluck('id');
    }
    else if (includes(type, ['infra', 'runtimes'])) {
        filterFunction = ramda_1.identity;
        pluckFunction = ramda_1.identity;
    }
    else {
        throw new Error(`Invalid type: ${type}`);
    }
    const appsToBeUpdated = ramda_1.compose(pluckFunction, filterFunction, ramda_1.path(['updates', type]))(resolvedUpdates);
    const appMajorsToBeUpdated = ramda_1.map(toMajorLocator, appsToBeUpdated);
    const currentApps = ramda_1.compose(ramda_1.filter((appId) => includes(toMajorLocator(appId), appMajorsToBeUpdated)), pluckFunction, ramda_1.path(['state', type]))(resolvedUpdates);
    const diffTable = utils_1.matchedDepsDiffTable('current', 'latest', currentApps, appsToBeUpdated);
    if (diffTable.length === 1) {
        return;
    }
    if (onlyShowTableIfVerbose && !verbose_1.isVerbose) {
        console.log(message);
        return;
    }
    console.log(`The following ${message}`);
    console.log(`${diffTable.toString()}\n`);
};
const printEditionAppsDiff = (resolvedUpdates) => {
    const oldState = ramda_1.path(['state', 'edition'], resolvedUpdates);
    const newState = ramda_1.difference(ramda_1.union(oldState, ramda_1.path(['updates', 'editionApps', 'install'], resolvedUpdates)), ramda_1.path(['updates', 'editionApps', 'uninstall'], resolvedUpdates));
    const diffTable = utils_1.matchedDepsDiffTable('uninstall', 'install', oldState, newState);
    if (diffTable.length === 1) {
        return;
    }
    console.log(`The following apps will be uninstalled/installed due to changes to current edition:`);
    console.log(`${diffTable.toString()}\n`);
};
const hasAvailableUpdates = (resolvedUpdates) => {
    const updates = ramda_1.prop('updates', resolvedUpdates);
    const anyAppsUpdates = ramda_1.compose(ramda_1.any(x => !!x), ramda_1.map(x => !ramda_1.isEmpty(x)), ramda_1.props(['apps', 'infra', 'runtimes']))(updates);
    const anyEditionUpdates = ramda_1.compose(ramda_1.any(x => !!x), ramda_1.map(x => !ramda_1.isEmpty(x)), ramda_1.props(['install', 'uninstall']), ramda_1.prop('editionApps'))(updates);
    return anyAppsUpdates || anyEditionUpdates;
};
const printUpdates = (resolvedUpdates) => {
    printAppsDiff(resolvedUpdates, `${chalk_1.default.blue.bold('Infra')} apps will be updated`, 'infra', undefined, true);
    printAppsDiff(resolvedUpdates, `${chalk_1.default.blue.bold('Runtimes')} will be updated`, 'runtimes', undefined, true);
    printAppsDiff(resolvedUpdates, `${chalk_1.default.blue.bold('Installed')} apps will be updated:`, 'apps', 'installation');
    printAppsDiff(resolvedUpdates, `${chalk_1.default.blue.bold('Dependencies')} will be updated:`, 'apps', 'dependency');
    printAppsDiff(resolvedUpdates, `${chalk_1.default.blue.bold('Edition')} apps will be updated`, 'apps', 'edition');
    printEditionAppsDiff(resolvedUpdates);
};
exports.default = async () => {
    const housekeeper = Housekeeper_1.createHousekeeperClient();
    const getSpinner = ora_1.default('Getting available updates').start();
    const resolvedUpdates = await housekeeper.resolve();
    getSpinner.stop();
    if (!hasAvailableUpdates(resolvedUpdates)) {
        logger_1.default.info('No updates available');
        return;
    }
    printUpdates(resolvedUpdates);
    const confirm = await promptUpdate();
    if (!confirm) {
        return;
    }
    const applySpinner = ora_1.default('Applying updates').start();
    await housekeeper.apply(resolvedUpdates);
    applySpinner.stop();
};
