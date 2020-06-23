"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const async_retry_1 = tslib_1.__importDefault(require("async-retry"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const conf = tslib_1.__importStar(require("../../conf"));
const env_1 = require("../../env");
const ProjectFilesManager_1 = require("../../lib/files/ProjectFilesManager");
const manifest_1 = require("../../lib/manifest");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_2 = require("../../manifest");
const switch_1 = require("../auth/switch");
const build_1 = require("../build");
const prompts_1 = require("../prompts");
const utils_1 = require("../utils");
const file_1 = require("./file");
const ProjectUploader_1 = require("./ProjectUploader");
const utils_2 = require("./utils");
const SessionManager_1 = require("../../lib/session/SessionManager");
const root = manifest_2.getAppRoot();
const buildersToRunLocalYarn = ['node', 'react'];
const automaticTag = (version) => (version.indexOf('-') > 0 ? null : 'latest');
const publisher = (workspace = 'master') => {
    const publishApp = async (appRoot, tag, force, projectUploader) => {
        const paths = await file_1.listLocalFiles(appRoot);
        const retryOpts = {
            retries: 2,
            minTimeout: 1000,
            factor: 2,
        };
        const publish = async (_, tryCount) => {
            const filesWithContent = paths.map(ProjectFilesManager_1.createPathToFileObject(appRoot));
            if (tryCount === 1) {
                logger_1.default.debug('Sending files:', `\n${paths.join('\n')}`);
            }
            if (tryCount > 1) {
                logger_1.default.info(`Retrying...${tryCount - 1}`);
            }
            try {
                return await projectUploader.sendToPublish(filesWithContent, tag, { skipSemVerEnsure: force });
            }
            catch (err) {
                const { response } = err;
                const { status } = response;
                const data = response === null || response === void 0 ? void 0 : response.data;
                const { message } = data;
                const statusMessage = status ? `: Status ${status}` : '';
                logger_1.default.error(`Error publishing app${statusMessage} (try: ${tryCount})`);
                if (message) {
                    logger_1.default.error(`Message: ${message}`);
                }
                if (status && status < 500) {
                    return;
                }
                throw err;
            }
        };
        return async_retry_1.default(publish, retryOpts);
    };
    const publishApps = async (path, tag, force) => {
        var _a;
        const session = SessionManager_1.SessionManager.getSingleton();
        const manifest = await manifest_1.ManifestEditor.getManifestEditor();
        const builderHubMessage = await utils_2.checkBuilderHubMessage('publish');
        if (builderHubMessage != null) {
            await utils_2.showBuilderHubMessage(builderHubMessage.message, builderHubMessage.prompt, manifest);
        }
        const { account: previousAccount, workspace: previousWorkspace } = session;
        if (manifest.vendor !== session.account) {
            const switchToVendorMsg = `You are trying to publish this app in an account that differs from the indicated vendor. Do you want to publish in account ${chalk_1.default.blue(manifest.vendor)}?`;
            const canSwitchToVendor = await prompts_1.promptConfirm(switchToVendorMsg);
            if (!canSwitchToVendor) {
                return;
            }
            await switch_1.switchAccount(manifest.vendor, {});
        }
        const pubTag = tag || automaticTag(manifest.version);
        const appId = locator_1.toAppLocator(manifest);
        const context = { account: manifest.vendor, workspace, region: env_1.region(), authToken: session.token };
        const projectUploader = ProjectUploader_1.ProjectUploader.getProjectUploader(appId, context);
        try {
            const senders = ['vtex.builder-hub', 'apps'];
            await build_1.listenBuild(appId, () => publishApp(path, pubTag, force, projectUploader), {
                waitCompletion: true,
                context,
                senders,
            });
            logger_1.default.info(`${appId} was published successfully!`);
            logger_1.default.info(`You can deploy it with: ${chalk_1.default.blueBright(`vtex deploy ${appId}`)}`);
            if ((_a = manifest.builders) === null || _a === void 0 ? void 0 : _a.docs) {
                logger_1.default.info(`Your app documentation will be available at: ${chalk_1.default.yellowBright(`https://vtex.io/docs/app/${appId}`)}`);
            }
        }
        catch (e) {
            logger_1.default.error(`Failed to publish ${appId}`);
        }
        await switch_1.returnToPreviousAccount({ previousAccount, previousWorkspace });
    };
    return { publishApp, publishApps };
};
exports.default = async (path, options) => {
    logger_1.default.debug(`Starting to publish app in ${conf.getEnvironment()}`);
    const { account } = SessionManager_1.SessionManager.getSingleton();
    const manifest = await manifest_1.ManifestEditor.getManifestEditor();
    const versionMsg = chalk_1.default.bold.yellow(manifest.version);
    const appNameMsg = chalk_1.default.bold.yellow(`${manifest.vendor}.${manifest.name}`);
    const yesFlag = options.y || options.yes;
    if (!yesFlag) {
        const confirmVersion = await prompts_1.promptConfirm(`Are you sure that you want to release version ${chalk_1.default.bold(`${versionMsg} of ${appNameMsg}?`)}`, false);
        if (!confirmVersion) {
            process.exit(1);
        }
    }
    if (yesFlag && manifest.vendor !== account) {
        logger_1.default.error(`When using the 'yes' flag, you need to be logged in to the same account as your app’s vendor.`);
        process.exit(1);
    }
    const workspace = options.w || options.workspace;
    if (workspace && manifest.vendor !== account) {
        logger_1.default.error(`When using the 'workspace' flag, you need to be logged in to the same account as your app’s vendor.`);
        process.exit(1);
    }
    path = path || root;
    const force = options.f || options.force;
    // Always run yarn locally for some builders
    buildersToRunLocalYarn.map(utils_1.runYarnIfPathExists);
    const { publishApps } = publisher(workspace);
    await publishApps(path, options.tag, force);
};
