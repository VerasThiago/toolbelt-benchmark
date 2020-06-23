"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const host_1 = require("../../host");
const archiver_1 = tslib_1.__importDefault(require("archiver"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const get_stream_1 = tslib_1.__importDefault(require("get-stream"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const MB = 1000000;
const getSizeString = (byteSize, colored = true, megaBytesintensityScale = [10, 20]) => {
    const mbSize = byteSize / MB;
    const mbSizeString = mbSize.toFixed(2);
    if (!colored) {
        return `${mbSizeString}MB`;
    }
    if (mbSize < megaBytesintensityScale[0]) {
        return `${chalk_1.default.bold.green(`${mbSizeString}MB`)}`;
    }
    if (mbSize < megaBytesintensityScale[1]) {
        return `${chalk_1.default.bold.yellow(`${mbSizeString}MB`)}`;
    }
    return `${chalk_1.default.bold.red(`${mbSizeString}MB`)}`;
};
class ProjectSizeLimitError extends Error {
    constructor(projectByteSize, maxByteSize) {
        super(`This project size (${getSizeString(projectByteSize)}) is exceeding the size limit ${getSizeString(maxByteSize)} `);
        this.projectByteSize = projectByteSize;
    }
}
exports.ProjectSizeLimitError = ProjectSizeLimitError;
class ChangeSizeLimitError extends Error {
    constructor(changeByteSize, maxByteSize) {
        super(`This change size (${getSizeString(changeByteSize)}) is exceeding the size limit ${getSizeString(maxByteSize)} `);
        this.changeByteSize = changeByteSize;
    }
}
exports.ChangeSizeLimitError = ChangeSizeLimitError;
class ProjectUploader {
    constructor(appName, builderHubClient) {
        this.appName = appName;
        this.builderHubClient = builderHubClient;
        this.compressFilesOnMemory = async (files, zlibOptions = {}) => {
            const zip = archiver_1.default('zip', { zlib: zlibOptions });
            zip.on('error', (err) => {
                throw err;
            });
            files.forEach(({ content, path }) => zip.append(content, { name: path }));
            const [zipContent] = await Promise.all([get_stream_1.default.buffer(zip), zip.finalize()]);
            return zipContent;
        };
    }
    static getProjectUploader(appId, contextOrClient, clientTimeout = 60000) {
        let builderHubClient;
        if (contextOrClient instanceof Builder_1.Builder) {
            builderHubClient = contextOrClient;
        }
        else {
            builderHubClient = Builder_1.Builder.createClient(contextOrClient, { timeout: clientTimeout });
        }
        const projectUploader = new ProjectUploader(appId, builderHubClient);
        return projectUploader;
    }
    async sendToPublish(files, publishTag, params = {}) {
        const { zipFile, builderHubResolvingOpts } = await this.prepareRequest(files);
        return this.builderHubClient.publishApp(this.appName, zipFile, { ...builderHubResolvingOpts, tag: publishTag }, params);
    }
    async sendToTest(files, params = {}) {
        const { zipFile, builderHubResolvingOpts } = await this.prepareRequest(files);
        return this.builderHubClient.testApp(this.appName, zipFile, builderHubResolvingOpts, params);
    }
    async sendToLink(files, linkID, params = {}) {
        const { zipFile, builderHubResolvingOpts } = await this.prepareRequest(files);
        return this.builderHubClient.linkApp(this.appName, linkID, zipFile, builderHubResolvingOpts, params);
    }
    sendToRelink(changes, linkID, params = {}) {
        this.checkSizeLimits(changes, true);
        return this.builderHubClient.relinkApp(this.appName, changes, linkID, params);
    }
    checkSizeLimits(filesOrChanges, isChange = false) {
        const totalByteSize = filesOrChanges.reduce((acc, file) => acc + file.byteSize, 0);
        const sizeLimit = isChange ? ProjectUploader.CHANGE_BYTESIZE_LIMIT : ProjectUploader.PROJECT_BYTESIZE_LIMIT;
        if (totalByteSize > sizeLimit) {
            if (isChange) {
                throw new ChangeSizeLimitError(totalByteSize, sizeLimit);
            }
            else {
                throw new ProjectSizeLimitError(totalByteSize, sizeLimit);
            }
        }
        if (!isChange || isChange) {
            const logMessage = `Project size: ${getSizeString(totalByteSize)}`;
            if (totalByteSize > ProjectUploader.BYTES_PROJECT_SIZE_SCALE[0]) {
                logger_1.default.warn(logMessage);
            }
            else {
                logger_1.default.info(logMessage);
            }
        }
    }
    async prepareRequest(files) {
        this.checkSizeLimits(files);
        this.checkForManifest(files);
        logger_1.default.info('Compressing project files...');
        const zipFile = await this.compressFilesOnMemory(files);
        logger_1.default.info(`Compressed project size: ${getSizeString(zipFile.byteLength, false)}`);
        const stickyHint = await this.getBuilderHubSticky();
        const builderHubResolvingOpts = {
            sticky: true,
            stickyHint,
        };
        return { zipFile, builderHubResolvingOpts };
    }
    checkForManifest(files) {
        const indexOfManifest = files.findIndex(({ path }) => path === 'manifest.json');
        if (indexOfManifest === -1) {
            throw new Error('No manifest.json file found in files.');
        }
    }
    getBuilderHubSticky(hostsToTry = 3, timeout = 1000) {
        return host_1.getSavedOrMostAvailableHost(this.appName, this.builderHubClient, hostsToTry, timeout);
    }
}
exports.ProjectUploader = ProjectUploader;
ProjectUploader.CHANGE_BYTESIZE_LIMIT = 50 * MB;
ProjectUploader.PROJECT_BYTESIZE_LIMIT = 90 * MB;
ProjectUploader.BYTES_PROJECT_SIZE_SCALE = [10 * MB, 20 * MB];
