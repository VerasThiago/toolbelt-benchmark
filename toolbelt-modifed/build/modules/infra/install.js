"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const ramda_1 = require("ramda");
const semver_1 = tslib_1.__importDefault(require("semver"));
const conf_1 = require("../../conf");
const Router_1 = require("../../lib/clients/IOClients/infra/Router");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const prompts_1 = require("../prompts");
const utils_1 = require("./utils");
const router = Router_1.createRouterClient();
const { getAvailableVersions, listInstalledServices, installService } = router;
const promptInstall = () => Promise.resolve(prompts_1.promptConfirm('Continue with the installation?'));
const findVersion = (pool, predicate) => pool
    .filter(v => semver_1.default.valid(v))
    .filter(predicate)
    .sort(semver_1.default.rcompare)
    .shift();
const getNewVersion = ramda_1.curry((suffix, installedVersion, availableVersions) => {
    const tag = utils_1.getTag(installedVersion);
    const hasValidSuffix = semver_1.default.valid(suffix);
    const hasSuffixAndValidSuffix = suffix && hasValidSuffix;
    const hasSuffixOnAvailable = availableVersions.find(v => v === suffix);
    if (hasSuffixAndValidSuffix && hasSuffixOnAvailable) {
        return [installedVersion, suffix];
    }
    if (hasSuffixAndValidSuffix && !hasSuffixOnAvailable) {
        return [installedVersion, null];
    }
    const hasValidRange = semver_1.default.validRange(suffix, true);
    const hasTagOrInstalledVersion = !tag || !installedVersion;
    const fn = hasValidRange
        ? v => semver_1.default.satisfies(v, suffix, true)
        : suffix && !hasValidSuffix
            ? v => utils_1.getTag(v) === null
            : hasTagOrInstalledVersion
                ? v => semver_1.default.prerelease(v) === null
                : v => utils_1.getTag(v) === tag;
    const newVersion = findVersion(availableVersions, fn);
    return [installedVersion, newVersion];
});
const logInstall = ramda_1.curry((name, [installedVersion, newVersion]) => {
    if (!newVersion) {
        logger_1.default.error(`No suitable version for ${name}`);
        return;
    }
    if (newVersion === installedVersion) {
        console.log(`${name}  ${chalk_1.default.yellow(installedVersion)}`);
        logger_1.default.info('Service is up to date.');
        return;
    }
    if (installedVersion) {
        const [from, to] = utils_1.diffVersions(installedVersion, newVersion);
        return console.log(`${name}  ${from} ${chalk_1.default.gray('->')} ${to}`);
    }
    return console.log(`${name}  ${chalk_1.default.green(newVersion)}`);
});
const hasNewVersion = ([installedVersion, newVersion]) => !!(newVersion && newVersion !== installedVersion);
const getInstalledVersion = (service) => listInstalledServices()
    .then(data => data.find(({ name }) => name === service))
    .then(s => s === null || s === void 0 ? void 0 : s.version);
exports.default = async (name) => {
    const [service, suffix] = name.split('@');
    const spinner = ora_1.default('Getting versions').start();
    // We force getting versions from the Production region as currently all
    // regions use the same ECR on us-east-1 region. This API is old and weird,
    // as it shouldn't return the regions in the response if I'm already querying
    // a single region. Only change to use `env.region()` when router fixed.
    try {
        const allVersions = (await Promise.all([
            getInstalledVersion(service),
            getAvailableVersions(service).then(ramda_1.path(['versions', conf_1.Region.Production])),
        ]));
        spinner.stop();
        const newVersions = getNewVersion(suffix)(...allVersions);
        logInstall(service)(newVersions);
        if (!hasNewVersion(newVersions)) {
            return null;
        }
        await Promise.resolve(console.log(''))
            .then(promptInstall)
            .then(confirm => {
            if (!confirm) {
                return;
            }
            spinner.text = 'Installing';
            spinner.start();
            return installService(service, newVersions[1]);
        })
            .then(() => {
            spinner.stop();
            logger_1.default.info('Installation complete');
        });
    }
    catch (err) {
        spinner.stop();
        throw err;
    }
};
