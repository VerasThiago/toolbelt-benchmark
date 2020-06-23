"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const SessionManager_1 = require("../../lib/session/SessionManager");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const table_1 = require("../../table");
const { listApps } = Apps_1.createAppsClient();
const cleanVersion = ramda_1.compose(ramda_1.head, ramda_1.split('+build'));
const filterBySource = (source) => ramda_1.filter(ramda_1.compose(ramda_1.equals(source), ramda_1.prop('_source')));
const renderTable = ({ title, emptyMessage, appArray, }) => {
    console.log(title);
    if (appArray.length === 0) {
        return console.log(`${emptyMessage}\n`);
    }
    const table = table_1.createTable();
    appArray.forEach(({ app }) => {
        const { vendor, name, version } = locator_1.parseLocator(app);
        const cleanedVersion = cleanVersion(version);
        const formattedName = `${chalk_1.default.blue(vendor)}${chalk_1.default.gray.bold('.')}${name}`;
        table.push([formattedName, cleanedVersion]);
    });
    console.log(`${table.toString()}\n`);
};
exports.default = async () => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    logger_1.default.debug('Starting to list apps');
    const appArray = await listApps().then(ramda_1.prop('data'));
    renderTable({
        // Apps inherited by account's edition
        title: `${chalk_1.default.yellow('Edition Apps')} in ${chalk_1.default.blue(account)} at workspace ${chalk_1.default.yellow(workspace)}`,
        emptyMessage: 'You have no edition apps',
        appArray: filterBySource('edition')(appArray),
    });
    renderTable({
        // Installed apps
        title: `${chalk_1.default.yellow('Installed Apps')} in ${chalk_1.default.blue(account)} at workspace ${chalk_1.default.yellow(workspace)}`,
        emptyMessage: 'You have no installed apps',
        appArray: filterBySource('installation')(appArray),
    });
    renderTable({
        // Linked apps
        title: `${chalk_1.default.yellow('Linked Apps')} in ${chalk_1.default.blue(account)} at workspace ${chalk_1.default.yellow(workspace)}`,
        emptyMessage: 'You have no linked apps',
        appArray: filterBySource('link')(appArray),
    });
};
