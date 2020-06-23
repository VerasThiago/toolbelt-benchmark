"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const semver_1 = tslib_1.__importDefault(require("semver"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const utils_1 = require("./utils");
exports.releaseTypeAliases = {
    pre: 'prerelease',
};
exports.supportedReleaseTypes = ['major', 'minor', 'patch', 'prerelease'];
exports.supportedTagNames = ['stable', 'beta', 'hkignore'];
const releaseTypesToUpdateChangelog = ['major', 'minor', 'patch'];
const tagNamesToUpdateChangelog = ['stable'];
const shouldUpdateChangelog = (releaseType, tagName) => {
    return ((releaseTypesToUpdateChangelog.indexOf(releaseType) >= 0 && tagNamesToUpdateChangelog.indexOf(tagName) >= 0) ||
        semver_1.default.valid(releaseType));
};
const getNewAndOldVersions = (releaseType, tagName) => {
    if (semver_1.default.valid(releaseType)) {
        // If `releaseType` is a valid (semver) version, use it.
        const oldVersion = utils_1.readVersion();
        const newVersion = semver_1.default.parse(releaseType).version;
        if (!semver_1.default.gt(newVersion, oldVersion)) {
            // TODO: Remove the below log.error when toolbelt has better error handling.
            logger_1.default.error(`The new version has to be greater than the old one: \
${newVersion} <= ${oldVersion}`);
            throw new Error(`The new version has to be greater than the old one: \
${newVersion} <= ${oldVersion}`);
        }
        return [oldVersion, newVersion];
    }
    // Else `releaseType` is just a regular release type. Then we increment the
    // actual version.
    // Check if releaseType is valid.
    if (ramda_1.indexOf(releaseType, exports.supportedReleaseTypes) === -1) {
        // TODO: Remove the below log.error when toolbelt has better error handling.
        logger_1.default.error(`Invalid release type: ${releaseType}
Valid release types are: ${exports.supportedReleaseTypes.join(', ')}`);
        throw new Error(`Invalid release type: ${releaseType}
Valid release types are: ${exports.supportedReleaseTypes.join(', ')}`);
    }
    // Check if tagName is valid.
    if (ramda_1.indexOf(tagName, exports.supportedTagNames) === -1) {
        // TODO: Remove the below log.error when toolbelt has better error handling.
        logger_1.default.error(`Invalid release tag: ${tagName}
Valid release tags are: ${exports.supportedTagNames.join(', ')}`);
        throw new Error(`Invalid release tag: ${tagName}
Valid release tags are: ${exports.supportedTagNames.join(', ')}`);
    }
    const oldVersion = utils_1.readVersion();
    const newVersion = utils_1.incrementVersion(oldVersion, releaseType, tagName);
    return [oldVersion, newVersion];
};
exports.default = async (releaseType = 'patch', // This arg. can also be a valid (semver) version.
tagName = 'beta') => {
    utils_1.checkGit();
    utils_1.checkIfInGitRepo();
    const normalizedReleaseType = ramda_1.prop(releaseType, exports.releaseTypeAliases) || releaseType;
    const [oldVersion, newVersion] = getNewAndOldVersions(normalizedReleaseType, tagName);
    logger_1.default.info(`Old version: ${chalk_1.default.bold(oldVersion)}`);
    logger_1.default.info(`New version: ${chalk_1.default.bold.yellow(newVersion)}`);
    const [month, day, year] = new Date()
        .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .split('/');
    // Pachamama v2 requires that version tags start with a 'v' character.
    const tagText = `v${newVersion}`;
    const changelogVersion = `\n\n## [${newVersion}] - ${year}-${month}-${day}`;
    if (!(await utils_1.confirmRelease())) {
        // Abort release.
        return;
    }
    logger_1.default.info('Starting release...');
    try {
        await utils_1.preRelease();
        await utils_1.bump(newVersion);
        if (shouldUpdateChangelog(normalizedReleaseType, tagName)) {
            utils_1.updateChangelog(changelogVersion);
        }
        await utils_1.add();
        await utils_1.commit(tagText);
        await utils_1.tag(tagText);
        await utils_1.push(tagText);
        await utils_1.postRelease();
    }
    catch (e) {
        logger_1.default.error(`Failed to release \n${e}`);
    }
};
