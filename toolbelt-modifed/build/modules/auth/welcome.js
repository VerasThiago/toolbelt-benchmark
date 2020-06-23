"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("@vtex/api");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const Sponsor_1 = require("../../lib/clients/IOClients/apps/Sponsor");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const SessionManager_1 = require("../../lib/session/SessionManager");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const table_1 = require("../../table");
const filterBySource = (method) => {
    return (el) => (el === null || el === void 0 ? void 0 : el._source) === method;
};
const renderTable = (title, rows) => {
    console.log(title);
    const table = table_1.createTable();
    rows.forEach(([name, value]) => {
        if (value) {
            table.push([chalk_1.default.blue(name), value]);
        }
    });
    console.log(`${table.toString()}\n`);
};
const renderAppsTable = ({ title, emptyMessage, appArray, }) => {
    console.log(title);
    if (appArray.length === 0) {
        return console.log(`${emptyMessage}\n`);
    }
    const table = table_1.createTable();
    appArray.forEach(({ app }) => {
        const { vendor, name, version } = locator_1.parseLocator(app);
        const cleanedVersion = api_1.removeBuild(version);
        const formattedName = `${chalk_1.default.blue(vendor)}${chalk_1.default.gray.bold('.')}${name}`;
        table.push([formattedName, cleanedVersion]);
    });
    console.log(`${table.toString()}\n`);
};
const getEditionStatus = async () => {
    var _a, _b;
    const sponsorClient = Sponsor_1.Sponsor.createClient();
    let isEditionSet = null;
    let edition;
    try {
        edition = await sponsorClient.getEdition();
        isEditionSet = true;
    }
    catch (err) {
        if (((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.code) === 'resource_not_found') {
            isEditionSet = false;
        }
        else {
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.EDITION_REQUEST_ERROR,
                originalError: err,
            }).logErrorForUser({ coreLogLevelDefault: 'debug' });
        }
        edition = null;
    }
    return {
        isEditionSet,
        edition,
    };
};
const createEditionInfoRows = ({ edition, isEditionSet }) => {
    if (isEditionSet === false) {
        return [['Edition', 'not set']];
    }
    if (edition == null) {
        return [];
    }
    return [
        ['Edition', edition.title],
        ['Edition id', edition.id],
        ['Edition activated', edition._activationDate],
    ];
};
exports.default = async () => {
    const sessionManager = SessionManager_1.SessionManager.getSingleton();
    const { account, workspace } = sessionManager;
    const apps = Apps_1.createAppsClient();
    const editionStatus = await getEditionStatus();
    let appArray;
    try {
        const { data } = await apps.listApps();
        appArray = data;
    }
    catch (err) {
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
            originalError: err,
        }).logErrorForUser({ coreLogLevelDefault: 'debug' });
        appArray = null;
    }
    logger_1.default.info(`Welcome to VTEX IO!`);
    /** General information */
    renderTable(`${chalk_1.default.yellow('General')}`, [
        ['Account', account],
        ['Workspace', workspace],
        ...createEditionInfoRows(editionStatus),
    ]);
    /** RUNNING TESTS */
    // We could add here the ab tests running
    /** LATEST WORKSPACES */
    // We could add here the lastest workspaces used on this account
    /** APPS LIST */
    if (appArray != null) {
        renderAppsTable({
            title: `${chalk_1.default.yellow('Installed Apps')}`,
            emptyMessage: 'You have no installed apps',
            appArray: appArray.filter(filterBySource('installation')),
        });
    }
};
