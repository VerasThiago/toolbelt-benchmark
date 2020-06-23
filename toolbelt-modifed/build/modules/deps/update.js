"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const diff_1 = require("diff");
const ramda_1 = require("ramda");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
const { getDependencies, updateDependencies, updateDependency } = Apps_1.createAppsClient();
const cleanDeps = ramda_1.compose(ramda_1.keys, utils_1.removeNpm);
exports.default = async (optionalApps) => {
    const appsList = optionalApps.filter(arg => arg && arg !== '');
    try {
        logger_1.default.debug('Starting update process');
        const previousDeps = await getDependencies();
        let currentDeps;
        if (appsList.length === 0) {
            currentDeps = await updateDependencies();
        }
        else {
            for (const locator of appsList) {
                const { vendor, name, version } = locator_1.parseLocator(locator);
                if (!name || !version) {
                    logger_1.default.error(`App ${locator} has an invalid app format, please use <vendor>.<name>@<version>`);
                }
                else {
                    try {
                        logger_1.default.debug(`Starting to update ${locator}`);
                        // eslint-disable-next-line no-await-in-loop
                        await updateDependency(`${vendor}.${name}`, version, vendor);
                    }
                    catch (e) {
                        logger_1.default.error(e.message);
                        if (ramda_1.path(['response', 'data', 'message'], e)) {
                            logger_1.default.error(e.response.data.message);
                        }
                    }
                }
            }
            currentDeps = await getDependencies();
        }
        const [cleanPrevDeps, cleanCurrDeps] = ramda_1.map(cleanDeps, [previousDeps, currentDeps]);
        const diff = diff_1.diffJson(cleanPrevDeps, cleanCurrDeps);
        let nAdded = 0;
        let nRemoved = 0;
        diff.forEach(({ count, value, added, removed }) => {
            const color = added ? chalk_1.default.green : removed ? chalk_1.default.red : chalk_1.default.gray;
            if (added) {
                nAdded += count;
            }
            else if (removed) {
                nRemoved += count;
            }
            process.stdout.write(color(value));
        });
        if (nAdded === 0 && nRemoved === 0) {
            logger_1.default.info('No dependencies updated');
        }
        else {
            if (nAdded > 0) {
                logger_1.default.info('', nAdded, nAdded > 1 ? ' dependencies ' : ' dependency ', chalk_1.default.green('added'), ' successfully');
            }
            if (nRemoved > 0) {
                logger_1.default.info('', nRemoved, nRemoved > 1 ? ' dependencies ' : 'dependency ', chalk_1.default.red('removed'), ' successfully');
            }
        }
    }
    catch (e) {
        logger_1.default.error(e.message);
        if (ramda_1.path(['response', 'data', 'message'], e)) {
            logger_1.default.error(e.response.data.message);
        }
    }
};
