"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const Router_1 = require("../../lib/clients/IOClients/infra/Router");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const table_1 = require("../../table");
const utils_1 = require("./utils");
const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
const router = Router_1.createRouterClient();
const { listAvailableServices, listInstalledServices, getAvailableVersions } = router;
const printAvailableServices = () => listAvailableServices()
    .then((availableRes) => {
    const table = table_1.createTable({ head: ['Name', 'Last stable', 'Last prerelease'] });
    Object.keys(availableRes).forEach(res => {
        const [stable, prerelease] = utils_1.getLastStableAndPrerelease(availableRes[res]);
        table.push([res, chalk_1.default.bold.green(stable), chalk_1.default.yellow(prerelease)]);
    });
    return table;
})
    .then(table => {
    logger_1.default.info('Available services');
    console.log(table.toString());
});
const printAvailableServiceVersions = (name, filter) => getAvailableVersions(name).then(({ versions }) => {
    const region = Object.keys(versions)[0];
    return versions[region]
        .filter(v => !filter || v.indexOf(filter) >= 0)
        .map(semver_1.default.valid)
        .filter(v => v !== null)
        .sort(semver_1.default.compare)
        .reverse()
        .slice(0, 20)
        .forEach(v => {
        if (semver_1.default.prerelease(v) !== null) {
            console.log(`  ${chalk_1.default.yellow(v)}`);
        }
        else {
            console.log(`  ${chalk_1.default.bold.green(v)}`);
        }
    });
});
const printInstalledServices = () => listInstalledServices()
    .then((installedRes) => {
    const table = table_1.createTable();
    installedRes.forEach(({ name, version }) => {
        const validVersion = semver_1.default.valid(version);
        const styledVersion = semver_1.default.prerelease(validVersion) !== null ? chalk_1.default.yellow(validVersion) : chalk_1.default.bold.green(validVersion);
        table.push([name, styledVersion]);
    });
    return table;
})
    .then(table => {
    logger_1.default.info(`Services installed on ${chalk_1.default.blue(account)}/${chalk_1.default.green(workspace)}`);
    console.log(table.toString());
});
exports.default = (name, options) => {
    const filter = options.f || options.filter;
    const available = options.a || options.available;
    return available
        ? name
            ? printAvailableServiceVersions(name, filter)
            : printAvailableServices()
        : printInstalledServices();
};
