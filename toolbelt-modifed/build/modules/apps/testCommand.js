"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const async_retry_1 = tslib_1.__importDefault(require("async-retry"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const errors_1 = require("../../errors");
const Builder_1 = require("../../lib/clients/IOClients/apps/Builder");
const ProjectFilesManager_1 = require("../../lib/files/ProjectFilesManager");
const YarnFilesManager_1 = require("../../lib/files/YarnFilesManager");
const pinnedDependencies_1 = require("../../lib/pinnedDependencies");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_1 = require("../../manifest");
const build_1 = require("../build");
const utils_1 = require("../utils");
const file_1 = require("./file");
const ProjectUploader_1 = require("./ProjectUploader");
const utils_2 = require("./utils");
const root = manifest_1.getAppRoot();
const buildersToRunLocalYarn = ['react', 'node'];
const RETRY_OPTS_TEST = {
    retries: 2,
    minTimeout: 1000,
    factor: 2,
};
const performTest = async (projectUploader, extraData, unsafe) => {
    const yarnFilesManager = await YarnFilesManager_1.YarnFilesManager.createFilesManager(root);
    extraData.yarnFilesManager = yarnFilesManager;
    yarnFilesManager.logSymlinkedDependencies();
    const testApp = async (bail, tryCount) => {
        const test = true;
        const [localFiles, linkedFiles] = await Promise.all([
            file_1.listLocalFiles(root, test).then(paths => ramda_1.map(ProjectFilesManager_1.createPathToFileObject(root), paths)),
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
            const { code } = await projectUploader.sendToTest(filesWithContent, { tsErrorsAsWarnings: unsafe });
            if (code !== 'build.accepted') {
                bail(new Error('Please, update your builder-hub to the latest version!'));
            }
        }
        catch (err) {
            const { response } = err;
            const { status } = response;
            const data = response === null || response === void 0 ? void 0 : response.data;
            const { message } = data;
            const statusMessage = status ? `: Status ${status}` : '';
            logger_1.default.error(`Error testing app${statusMessage} (try: ${tryCount})`);
            if (message) {
                logger_1.default.error(`Message: ${message}`);
            }
            if (status && status < 500) {
                return;
            }
            throw err;
        }
    };
    await async_retry_1.default(testApp, RETRY_OPTS_TEST);
};
exports.default = async (options) => {
    await utils_2.validateAppAction('test');
    const unsafe = !!(options.unsafe || options.u);
    const manifest = await manifest_1.getManifest();
    try {
        await manifest_1.writeManifestSchema();
    }
    catch (e) {
        logger_1.default.debug('Failed to write schema on manifest.');
    }
    const appId = locator_1.toAppLocator(manifest);
    const builder = Builder_1.Builder.createClient({}, { timeout: 60000 });
    const projectUploader = ProjectUploader_1.ProjectUploader.getProjectUploader(appId, builder);
    try {
        const pinnedDeps = await builder.getPinnedDependencies();
        await pinnedDependencies_1.fixPinnedDependencies(pinnedDeps, buildersToRunLocalYarn, manifest.builders);
    }
    catch (e) {
        logger_1.default.info('Failed to check for pinned dependencies');
    }
    // Always run yarn locally for some builders
    ramda_1.map(utils_1.runYarnIfPathExists, buildersToRunLocalYarn);
    const onError = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        build_failed: () => {
            logger_1.default.error(`App build failed. Waiting for changes...`);
        },
    };
    const onBuild = async () => {
        process.exit();
    };
    logger_1.default.info(`Testing app ${appId}`);
    const extraData = { linkConfig: null };
    try {
        const buildTrigger = performTest.bind(this, projectUploader, extraData, unsafe);
        const [subject] = appId.split('@');
        await build_1.listenBuild(subject, buildTrigger, { waitCompletion: false, onBuild, onError }).then(ramda_1.prop('unlisten'));
    }
    catch (e) {
        if (e.response) {
            const { data } = e.response;
            if (data.code === 'routing_error' && /app_not_found.*vtex\.builder-hub/.test(data.message)) {
                return logger_1.default.error('Please install vtex.builder-hub in your account to enable app testing (vtex install vtex.builder-hub)');
            }
            if (data.code === 'link_on_production') {
                throw new errors_1.CommandError(`Please use a dev workspace to test apps. Create one with (${chalk_1.default.blue('vtex use <workspace> -rp')}) to be able to test apps`);
            }
        }
        throw e;
    }
};
