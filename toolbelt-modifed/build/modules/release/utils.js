"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const child_process_es6_promise_1 = require("child-process-es6-promise");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ramda_1 = require("ramda");
const semver_1 = tslib_1.__importDefault(require("semver"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_1 = require("../../manifest");
const prompts_1 = require("../prompts");
const root = manifest_1.getAppRoot();
const versionFile = path_1.resolve(root, 'manifest.json');
const changelogPath = path_1.resolve(root, 'CHANGELOG.md');
const unreleased = '## [Unreleased]';
const readVersionFile = () => {
    try {
        return fs_extra_1.readJsonSync(versionFile);
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            logger_1.default.error(`Version file not found: ${versionFile}.`);
        }
        throw e;
    }
};
const writeVersionFile = (newManifest) => {
    fs_extra_1.writeJsonSync(versionFile, newManifest, { spaces: 2 });
};
exports.readVersion = () => {
    const version = semver_1.default.valid(readVersionFile().version, true);
    if (!version) {
        throw new Error(`Invalid app version: ${version}`);
    }
    return version;
};
exports.incrementVersion = (rawOldVersion, releaseType, tagName) => {
    const oldVersion = semver_1.default.valid(rawOldVersion, true);
    if (tagName !== 'stable' && releaseType !== 'prerelease') {
        return semver_1.default.inc(oldVersion, `pre${releaseType}`, tagName);
    }
    return semver_1.default.inc(oldVersion, releaseType);
};
const getScript = (key) => {
    return ramda_1.path(['scripts', key], readVersionFile());
};
const runCommand = (cmd, successMessage, hideOutput = false, retries = 0, hideSuccessMessage = false) => {
    let output;
    try {
        output = child_process_es6_promise_1.execSync(cmd, { stdio: hideOutput ? 'pipe' : 'inherit', cwd: root });
        if (!hideSuccessMessage) {
            logger_1.default.info(successMessage + chalk_1.default.blue(` >  ${cmd}`));
        }
        return output;
    }
    catch (e) {
        logger_1.default.error(`Command '${cmd}' exited with error code: ${e.status}`);
        if (retries <= 0) {
            throw e;
        }
        logger_1.default.info(`Retrying...`);
        return runCommand(cmd, successMessage, hideOutput, retries - 1, hideSuccessMessage);
    }
};
const runScript = (key, msg) => {
    const cmd = getScript(key);
    return cmd ? runCommand(cmd, msg, false) : undefined;
};
exports.commit = (tagName) => {
    const commitMessage = `Release ${tagName}`;
    let successMessage = `File(s) ${versionFile} commited`;
    if (fs_extra_1.existsSync(changelogPath)) {
        successMessage = `Files ${versionFile} ${changelogPath} commited`;
    }
    return runCommand(`git commit -m "${commitMessage}"`, successMessage, true);
};
exports.tag = (tagName) => {
    const tagMessage = `Release ${tagName}`;
    return runCommand(`git tag ${tagName} -m "${tagMessage}"`, `Tag created: ${tagName}`, true);
};
exports.push = (tagName) => {
    return runCommand(`git push && git push origin ${tagName}`, 'Pushed commit and tags', true, 2);
};
exports.gitStatus = () => {
    return runCommand('git status', '', true);
};
exports.checkNothingToCommit = () => {
    const response = exports.gitStatus();
    return /nothing to commit/.test(response);
};
exports.checkIfGitPushWorks = () => {
    try {
        runCommand('git push', '', true, 2, true);
    }
    catch (e) {
        logger_1.default.error(`Failed pushing to remote.`);
        throw e;
    }
};
exports.preRelease = () => {
    const msg = 'Pre release';
    if (!exports.checkNothingToCommit()) {
        throw new Error('Please commit your changes before proceeding.');
    }
    exports.checkIfGitPushWorks();
    const key = 'prereleasy';
    runScript(key, msg);
    if (!exports.checkNothingToCommit()) {
        const commitMessage = `Pre release commit\n\n ${getScript(key)}`;
        return exports.commit(commitMessage);
    }
};
exports.confirmRelease = async () => {
    const answer = await prompts_1.promptConfirm(chalk_1.default.green('Are you sure?'));
    if (!answer) {
        logger_1.default.info('Cancelled by user');
        return false;
    }
    return true;
};
exports.checkGit = () => {
    try {
        child_process_es6_promise_1.execSync('git --version');
    }
    catch (e) {
        logger_1.default.error(`${chalk_1.default.bold(`git`)} is not available in your system. \
Please install it if you wish to use ${chalk_1.default.bold(`vtex release`)}`);
        throw e;
    }
};
exports.checkIfInGitRepo = () => {
    try {
        child_process_es6_promise_1.execSync('git rev-parse --git-dir');
    }
    catch (e) {
        logger_1.default.error(`The current working directory is not in a git repo. \
Please run ${chalk_1.default.bold(`vtex release`)} from inside a git repo.`);
        throw e;
    }
};
exports.postRelease = () => {
    const msg = 'Post release';
    if (getScript('postrelease')) {
        return runScript('postrelease', msg);
    }
    if (getScript('postreleasy')) {
        return runScript('postreleasy', msg);
    }
};
exports.add = () => {
    let gitAddCommand = `git add "${versionFile}"`;
    let successMessage = `File ${versionFile} added`;
    if (fs_extra_1.existsSync(changelogPath)) {
        gitAddCommand += ` "${changelogPath}"`;
        successMessage = `Files ${versionFile} ${changelogPath} added`;
    }
    return runCommand(gitAddCommand, successMessage, true);
};
exports.updateChangelog = (changelogVersion) => {
    if (fs_extra_1.existsSync(changelogPath)) {
        let data;
        try {
            data = fs_extra_1.readFileSync(changelogPath).toString();
        }
        catch (e) {
            throw new Error(`Error reading file: ${e}`);
        }
        if (data.indexOf(unreleased) < 0) {
            logger_1.default.info(chalk_1.default.red.bold(`I can't update your CHANGELOG. :( \n
        Make your CHANGELOG great again and follow the CHANGELOG format
        http://keepachangelog.com/en/1.0.0/`));
        }
        else {
            const position = data.indexOf(unreleased) + unreleased.length;
            const bufferedText = Buffer.from(`${changelogVersion}${data.substring(position)}`);
            const file = fs_extra_1.openSync(changelogPath, 'r+');
            try {
                fs_extra_1.writeSync(file, bufferedText, 0, bufferedText.length, position);
                fs_extra_1.close(file);
                logger_1.default.info(`updated CHANGELOG`);
            }
            catch (e) {
                throw new Error(`Error writing file: ${e}`);
            }
        }
    }
};
exports.bump = (newVersion) => {
    const manifest = readVersionFile();
    manifest.version = newVersion;
    writeVersionFile(manifest);
    logger_1.default.info(`Version bumped to ${chalk_1.default.bold.green(newVersion)}`);
};
