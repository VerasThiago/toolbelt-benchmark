"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const child_process_es6_promise_1 = require("child-process-es6-promise");
const diff_1 = require("diff");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const logger_1 = tslib_1.__importDefault(require("../logger"));
const manifest_1 = require("../manifest");
const table_1 = require("../table");
exports.yarnPath = `"${require.resolve('yarn/bin/yarn')}"`;
exports.formatNano = (nanoseconds) => `${(nanoseconds / 1e9).toFixed(0)}s ${((nanoseconds / 1e6) % 1e3).toFixed(0)}ms`;
exports.runYarn = (relativePath, force) => {
    logger_1.default.info(`Running yarn in ${chalk_1.default.green(relativePath)}`);
    const root = manifest_1.getAppRoot();
    const command = force
        ? `${exports.yarnPath} --force --non-interactive --ignore-engines`
        : `${exports.yarnPath} --non-interactive --ignore-engines`;
    child_process_es6_promise_1.execSync(command, { stdio: 'inherit', cwd: path_1.resolve(root, relativePath) });
    logger_1.default.info('Finished running yarn');
};
exports.runYarnIfPathExists = (relativePath) => {
    const root = manifest_1.getAppRoot();
    const pathName = path_1.resolve(root, relativePath);
    if (fs_extra_1.existsSync(pathName)) {
        try {
            exports.runYarn(relativePath, false);
        }
        catch (e) {
            logger_1.default.error(`Failed to run yarn in ${chalk_1.default.green(relativePath)}`);
            throw e;
        }
    }
};
const formatAppId = (appId) => {
    const [appVendor, appName] = ramda_1.default.split('.', appId);
    if (!appName) {
        // Then the app is an 'infra' app.
        const [infraAppVendor, infraAppName] = ramda_1.default.split(':', appId);
        if (!infraAppName) {
            return appId;
        }
        return `${chalk_1.default.blue(infraAppVendor)}:${infraAppName}`;
    }
    return `${chalk_1.default.blue(appVendor)}.${appName}`;
};
const cleanVersion = (appId) => {
    return ramda_1.default.compose((version) => {
        const [pureVersion, build] = ramda_1.default.split('+build', version);
        return build ? `${pureVersion}(linked)` : pureVersion;
    }, ramda_1.default.last, ramda_1.default.split('@'))(appId);
};
exports.matchedDepsDiffTable = (title1, title2, deps1, deps2) => {
    const depsDiff = diff_1.diffArrays(deps1, deps2);
    // Get deduplicated names (no version) of the changed deps.
    const depNames = [
        ...new Set(ramda_1.default.compose(ramda_1.default.map(k => ramda_1.default.head(ramda_1.default.split('@', k))), ramda_1.default.flatten, ramda_1.default.pluck('value'), ramda_1.default.filter((k) => !!k.removed || !!k.added))(depsDiff)),
    ].sort((strA, strB) => strA.localeCompare(strB));
    const produceStartValues = () => ramda_1.default.map(_ => [])(depNames);
    // Each of the following objects will start as a { `depName`: [] }, ... }-like.
    const addedDeps = ramda_1.default.zipObj(depNames, produceStartValues());
    const removedDeps = ramda_1.default.zipObj(depNames, produceStartValues());
    // Custom function to set the objects values.
    const setObjectValues = (obj, formatter, filterFunction) => {
        ramda_1.default.compose(
        // eslint-disable-next-line array-callback-return
        ramda_1.default.map(k => {
            const index = ramda_1.default.head(ramda_1.default.split('@', k));
            obj[index].push(formatter(k));
        }), ramda_1.default.flatten, ramda_1.default.pluck('value'), ramda_1.default.filter(filterFunction))(depsDiff);
        ramda_1.default.mapObjIndexed((_, index) => {
            obj[index] = obj[index].join(',');
        })(obj);
    };
    // Setting the objects values.
    setObjectValues(removedDeps, k => chalk_1.default.red(`${cleanVersion(k)}`), (k) => !!k.removed);
    setObjectValues(addedDeps, k => chalk_1.default.green(`${cleanVersion(k)}`), (k) => !!k.added);
    const table = table_1.createTable(); // Set table headers.
    table.push(['', chalk_1.default.bold.yellow(title1), chalk_1.default.bold.yellow(title2)]);
    const formattedDepNames = ramda_1.default.map(formatAppId, depNames);
    // Push array of changed dependencies pairs to the table.
    Array.prototype.push.apply(table, ramda_1.default.map((k) => ramda_1.default.flatten(k))(ramda_1.default.zip(
    // zipping 3 arrays.
    ramda_1.default.zip(formattedDepNames, ramda_1.default.values(removedDeps)), ramda_1.default.values(addedDeps))));
    return table;
};
