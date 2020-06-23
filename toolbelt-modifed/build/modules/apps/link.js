"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const ProjectUploader_1 = require("./ProjectUploader");
const utils_1 = require("./utils");
const errors_1 = require("../../errors");
const ramda_1 = require("ramda");
const readline_1 = require("readline");
const ProjectFilesManager_1 = require("../../lib/files/ProjectFilesManager");
const setup_1 = tslib_1.__importDefault(require("../setup"));
const pinnedDependencies_1 = require("../../lib/pinnedDependencies");
const utils_2 = require("../utils");
const manifest_1 = require("../../manifest");
const file_1 = require("./file");
const path_1 = require("path");
const build_1 = require("../build");
const manifest_2 = require("../../lib/manifest");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const YarnFilesManager_1 = require("../../lib/files/YarnFilesManager");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const debounce_1 = tslib_1.__importDefault(require("debounce"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const async_retry_1 = tslib_1.__importDefault(require("async-retry"));
const debugger_1 = tslib_1.__importDefault(require("./debugger"));
let nodeNotifier;
if (process.platform !== 'win32') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    nodeNotifier = require('node-notifier');
}
const root = manifest_1.getAppRoot();
const DELETE_SIGN = chalk_1.default.red('D');
const UPDATE_SIGN = chalk_1.default.blue('U');
const stabilityThreshold = process.platform === 'darwin' ? 100 : 200;
const linkID = crypto_1.randomBytes(8).toString('hex');
const buildersToStartDebugger = ['node'];
const buildersToRunLocalYarn = ['react', 'node'];
const RETRY_OPTS_INITIAL_LINK = {
    retries: 2,
    minTimeout: 1000,
    factor: 2,
};
const RETRY_OPTS_DEBUGGER = {
    retries: 2,
    minTimeout: 1000,
    factor: 2,
};
const shouldStartDebugger = (manifest) => {
    const buildersThatWillUseDebugger = ramda_1.intersection(manifest.builderNames, buildersToStartDebugger);
    return buildersThatWillUseDebugger.length > 0;
};
const performInitialLink = async (projectUploader, extraData, unsafe) => {
    const yarnFilesManager = await YarnFilesManager_1.YarnFilesManager.createFilesManager(root);
    extraData.yarnFilesManager = yarnFilesManager;
    yarnFilesManager.logSymlinkedDependencies();
    const linkApp = async (bail, tryCount) => {
        var _a;
        // wrapper for builder.linkApp to be used with the retry function below.
        const [localFiles, linkedFiles] = await Promise.all([
            file_1.listLocalFiles(root).then(paths => ramda_1.map(ProjectFilesManager_1.createPathToFileObject(root), paths)),
            yarnFilesManager.getYarnLinkedFiles(),
        ]);
        const filesWithContent = ramda_1.concat(localFiles, linkedFiles);
        if (tryCount === 1) {
            const linkedFilesInfo = linkedFiles.length ? `(${linkedFiles.length} from linked node modules)` : '';
            logger_1.default.info(`Sending ${filesWithContent.length} file${filesWithContent.length > 1 ? 's' : ''} ${linkedFilesInfo}`);
            logger_1.default.debug('Sending files');
            filesWithContent.forEach(p => logger_1.default.debug(p.path));
        }
        if (tryCount > 1) {
            logger_1.default.info(`Retrying...${tryCount - 1}`);
        }
        try {
            logger_1.default.info(`Link ID: ${linkID}`);
            const { code } = await projectUploader.sendToLink(filesWithContent, linkID, { tsErrorsAsWarnings: unsafe });
            if (code !== 'build.accepted') {
                bail(new Error('Please, update your builder-hub to the latest version!'));
            }
        }
        catch (err) {
            if (err instanceof ProjectUploader_1.ProjectSizeLimitError) {
                logger_1.default.error(err.message);
                process.exit(1);
            }
            const data = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data;
            if ((data === null || data === void 0 ? void 0 : data.code) === 'bad_toolbelt_version') {
                logger_1.default.error(`${data.message} To update just run ${chalk_1.default.bold.green('yarn global add vtex')}.`);
                process.exit(1);
            }
            if (err.status) {
                const { response } = err;
                const { status } = response;
                const { message } = data;
                const statusMessage = status ? `: Status ${status}` : '';
                logger_1.default.error(`Error linking app${statusMessage} (try: ${tryCount})`);
                if (message) {
                    logger_1.default.error(`Message: ${message}`);
                }
                if (status && status < 500) {
                    return;
                }
            }
            throw err;
        }
    };
    await async_retry_1.default(linkApp, RETRY_OPTS_INITIAL_LINK);
};
const warnAndLinkFromStart = (projectUploader, unsafe, extraData = { yarnFilesManager: null }) => {
    logger_1.default.warn('Initial link requested by builder');
    performInitialLink(projectUploader, extraData, unsafe);
    return null;
};
const watchAndSendChanges = async (appId, projectUploader, { yarnFilesManager }, unsafe) => {
    const changeQueue = [];
    const onInitialLinkRequired = e => {
        const data = e.response && e.response.data;
        if ((data === null || data === void 0 ? void 0 : data.code) === 'initial_link_required') {
            return warnAndLinkFromStart(projectUploader, unsafe, { yarnFilesManager });
        }
        throw e;
    };
    const defaultPatterns = ['*/**', 'manifest.json', 'policies.json', 'cypress.json'];
    const linkedDepsPatterns = ramda_1.map(path => path_1.join(path, '**'), yarnFilesManager.symlinkedDepsDirs);
    const pathModifier = ramda_1.pipe((path) => yarnFilesManager.maybeMapLocalYarnLinkedPathToProjectPath(path, root), path => path.split(path_1.sep).join('/'));
    const pathToChange = (path, remove) => {
        const content = remove ? null : fs_1.readFileSync(path_1.resolve(root, path)).toString('base64');
        const byteSize = remove ? 0 : Buffer.byteLength(content);
        return {
            content,
            byteSize,
            path: pathModifier(path),
        };
    };
    const sendChanges = debounce_1.default(async () => {
        try {
            logger_1.default.info(`Link ID: ${linkID}`);
            return await projectUploader.sendToRelink(changeQueue.splice(0, changeQueue.length), linkID, {
                tsErrorsAsWarnings: unsafe,
            });
        }
        catch (err) {
            nodeNotifier === null || nodeNotifier === void 0 ? void 0 : nodeNotifier.notify({
                title: appId,
                message: 'Link died',
            });
            if (err instanceof ProjectUploader_1.ChangeSizeLimitError) {
                logger_1.default.error(err.message);
                process.exit(1);
            }
            onInitialLinkRequired(err);
        }
    }, 1000);
    const queueChange = (path, remove) => {
        console.log(`${chalk_1.default.gray(moment_1.default().format('HH:mm:ss:SSS'))} - ${remove ? DELETE_SIGN : UPDATE_SIGN} ${path}`);
        changeQueue.push(pathToChange(path, remove));
        sendChanges();
    };
    const addIgnoreNodeModulesRule = (paths) => paths.concat((path) => path.includes('node_modules'));
    const watcher = chokidar_1.default.watch([...defaultPatterns, ...linkedDepsPatterns], {
        atomic: stabilityThreshold,
        awaitWriteFinish: {
            stabilityThreshold,
        },
        cwd: root,
        ignoreInitial: true,
        ignored: addIgnoreNodeModulesRule(file_1.getIgnoredPaths(root)),
        persistent: true,
        usePolling: process.platform === 'win32',
    });
    return new Promise((resolve, reject) => {
        watcher
            .on('add', file => queueChange(file))
            .on('change', file => queueChange(file))
            .on('unlink', file => queueChange(file, true))
            .on('error', reject)
            .on('ready', resolve);
    });
};
exports.default = async (options) => {
    await utils_1.validateAppAction('link');
    const unsafe = !!(options.unsafe || options.u);
    const manifest = await manifest_2.ManifestEditor.getManifestEditor();
    await manifest.writeSchema();
    const builderHubMessage = await utils_1.checkBuilderHubMessage('link');
    if (!ramda_1.isEmpty(builderHubMessage)) {
        await utils_1.showBuilderHubMessage(builderHubMessage.message, builderHubMessage.prompt, manifest);
    }
    const appId = manifest.appLocator;
    const builder = Builder_1.Builder.createClient({}, { timeout: 60000 });
    const projectUploader = ProjectUploader_1.ProjectUploader.getProjectUploader(appId, builder);
    if (options.setup || options.s) {
        await setup_1.default({ 'ignore-linked': false });
    }
    try {
        const pinnedDeps = await builder.getPinnedDependencies();
        await pinnedDependencies_1.fixPinnedDependencies(pinnedDeps, buildersToRunLocalYarn, manifest.builders);
    }
    catch (e) {
        logger_1.default.info('Failed to check for pinned dependencies');
        logger_1.default.debug(e);
    }
    // Always run yarn locally for some builders
    ramda_1.map(utils_2.runYarnIfPathExists, buildersToRunLocalYarn);
    if (options.c || options.clean) {
        logger_1.default.info('Requesting to clean cache in builder.');
        const { timeNano } = await builder.clean(appId);
        logger_1.default.info(`Cache cleaned successfully in ${utils_2.formatNano(timeNano)}`);
    }
    const onError = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        build_failed: () => {
            logger_1.default.error(`App build failed. Waiting for changes...`);
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        initial_link_required: () => warnAndLinkFromStart(projectUploader, unsafe),
    };
    let debuggerStarted = false;
    const onBuild = async () => {
        if (debuggerStarted) {
            return;
        }
        const startDebugger = async () => {
            const port = await debugger_1.default(manifest);
            if (!port) {
                throw new Error('Failed to start debugger.');
            }
            return port;
        };
        if (shouldStartDebugger(manifest)) {
            try {
                const debuggerPort = await async_retry_1.default(startDebugger, RETRY_OPTS_DEBUGGER);
                // eslint-disable-next-line require-atomic-updates
                debuggerStarted = true;
                logger_1.default.info(`Debugger tunnel listening on ${chalk_1.default.green(`:${debuggerPort}`)}. Go to ${chalk_1.default.blue('chrome://inspect')} in Google Chrome to debug your running application.`);
            }
            catch (e) {
                logger_1.default.error(e.message);
            }
        }
    };
    logger_1.default.info(`Linking app ${appId}`);
    let unlistenBuild;
    const extraData = { yarnFilesManager: null };
    try {
        const buildTrigger = performInitialLink.bind(this, projectUploader, extraData, unsafe);
        const [subject] = appId.split('@');
        if (options.noWatch) {
            await build_1.listenBuild(subject, buildTrigger, { waitCompletion: true });
            return;
        }
        unlistenBuild = await build_1.listenBuild(subject, buildTrigger, { waitCompletion: false, onBuild, onError }).then(ramda_1.prop('unlisten'));
    }
    catch (e) {
        if (e.response) {
            const { data } = e.response;
            if (data.code === 'routing_error' && /app_not_found.*vtex\.builder-hub/.test(data.message)) {
                return logger_1.default.error('Please install vtex.builder-hub in your account to enable app linking (vtex install vtex.builder-hub)');
            }
            if (data.code === 'link_on_production') {
                throw new errors_1.CommandError(`Please use a dev workspace to link apps. Create one with (${chalk_1.default.blue('vtex use <workspace> -rp')}) to be able to link apps`);
            }
            if (data.code === 'bad_toolbelt_version') {
                return logger_1.default.error(`${data.message} To update just run ${chalk_1.default.bold.green('yarn global add vtex')}.`);
            }
        }
        throw e;
    }
    readline_1.createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => {
        if (unlistenBuild) {
            unlistenBuild();
        }
        logger_1.default.info('Your app is still in development mode.');
        logger_1.default.info(`You can unlink it with: 'vtex unlink ${appId}'`);
        process.exit();
    });
    await watchAndSendChanges(appId, projectUploader, extraData, unsafe);
};
