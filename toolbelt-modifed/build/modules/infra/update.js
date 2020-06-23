"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const pad_1 = tslib_1.__importDefault(require("pad"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const conf_1 = require("../../conf");
const Router_1 = require("../../lib/clients/IOClients/infra/Router");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const utils_1 = require("./utils");
const router = Router_1.createRouterClient();
const { listAvailableServices, listInstalledServices, installService } = router;
const promptUpdate = () => Promise.resolve(prompts_1.promptConfirm('Apply version updates?'));
const calculateColSize = (names) => Math.max(...names.map(n => n.length));
const logLatest = (name, version, colSize) => console.log(`${pad_1.default(name, colSize)}  ${chalk_1.default.yellow(version)}`);
const logUpdate = (name, currentVersion, latestVersion, colSize) => {
    const [fromVersion, toVersion] = utils_1.diffVersions(currentVersion, latestVersion);
    console.log(`${pad_1.default(name, colSize)}  ${fromVersion} ${chalk_1.default.gray('->')} ${toVersion}`);
};
const logVersionMap = ({ latest, update }) => {
    const latestKeys = Object.keys(latest);
    const updateKeys = Object.keys(update);
    const colSize = calculateColSize([...latestKeys, ...updateKeys]);
    latestKeys.map(k => logLatest(k, latest[k], colSize));
    updateKeys.map(k => logUpdate(k, update[k].current, update[k].latest, colSize));
};
const createVersionMap = (availableRes, installedRes) => installedRes.reduce((acc, { name, version: currentVersion }) => {
    const tag = utils_1.getTag(currentVersion);
    const latestVersion = availableRes[name].versions[conf_1.Region.Production] // See comment in src/modules/infra/install.ts:82
        .filter(v => utils_1.getTag(v) === tag)
        .sort(semver_1.default.rcompare)[0];
    if (currentVersion !== latestVersion) {
        acc.update[name] = {
            current: currentVersion,
            latest: latestVersion,
        };
    }
    else {
        acc.latest[name] = currentVersion;
    }
    return acc;
}, { latest: {}, update: {} });
const hasUpdate = (update) => Object.keys(update).length > 0;
const installUpdates = (update) => Promise.all(Object.keys(update).map(name => installService(name, update[name].latest)));
exports.default = async () => {
    const spinner = ora_1.default('Getting available updates').start();
    try {
        const versions = await Promise.all([listAvailableServices(), listInstalledServices()]);
        spinner.stop();
        const versionMap = createVersionMap(...versions);
        logVersionMap(versionMap);
        console.log('');
        if (!hasUpdate(versionMap.update)) {
            logger_1.default.info('All up to date!');
            return;
        }
        await promptUpdate()
            .then(confirm => {
            if (!confirm) {
                return;
            }
            spinner.text = 'Installing';
            spinner.start();
            return installUpdates(versionMap.update);
        })
            .then(() => spinner.stop())
            .then(() => logger_1.default.info('All updates were installed'));
    }
    catch (err) {
        spinner.stop();
        throw err;
    }
};
