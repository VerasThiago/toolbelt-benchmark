"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const child_process_1 = require("child_process");
const path_1 = require("path");
const ramda_1 = require("ramda");
const ErrorKinds_1 = require("../../lib/error/ErrorKinds");
const ErrorReport_1 = require("../../lib/error/ErrorReport");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_1 = require("../../manifest");
const utils_1 = require("../utils");
const consts_1 = require("./consts");
const utils_2 = require("./utils");
/**
 * Returns a base package.json configuration
 * @param {string} appName
 * @returns
 */
function getBasePackageJson(appName) {
    return {
        name: appName,
        private: true,
        license: 'UNLICENSED',
        scripts: {
            lint: 'eslint --ext js,jsx,ts,tsx .',
            format: 'prettier --write "**/*.{ts,tsx,js,jsx,json}"',
        },
        husky: {
            hooks: {
                'pre-commit': 'lint-staged',
            },
        },
        'lint-staged': {
            '*.{ts,js,tsx,jsx}': ['eslint --fix', 'prettier --write'],
            '*.{json,graphql,gql}': ['prettier --write'],
        },
        devDependencies: {},
    };
}
/**
 * Installs a map of dependencies at the project's root
 * @param {Record<string, string>} deps
 */
function installDeps(deps) {
    const depList = Object.entries(deps)
        .map(([app, version]) => `${app}@${version}`)
        .join(' ');
    child_process_1.execSync(`${utils_1.yarnPath} add -D ${depList}`, {
        // only errors (stderr) are useful here, ignore stdin and stdout
        stdio: ['ignore', 'ignore', 'inherit'],
        cwd: path_1.resolve(manifest_1.getAppRoot()),
    });
}
/**
 * Configures the root package.json with the base configuration
 * @param {Manifest} manifest
 */
function configurePackageJson(manifest) {
    const rootPkgJson = utils_2.getRootPackageJson();
    if (rootPkgJson == null) {
        logger_1.default.warn(`No "package.json" found in "${path_1.resolve(manifest_1.getAppRoot())}". Creating one.`);
    }
    const newPkgJson = ramda_1.mergeDeepRight(getBasePackageJson(manifest.name), rootPkgJson || {});
    utils_2.packageJsonEditor.write('.', newPkgJson);
}
/**
 * Installs and configures root dependencies common for all projects.
 */
function setupCommonTools() {
    const rootPkgJson = utils_2.getRootPackageJson();
    const hasCommonDeps = utils_2.hasDevDependenciesInstalled({
        deps: consts_1.DEPENDENCIES.common,
        pkg: rootPkgJson,
    });
    if (!hasCommonDeps) {
        const depList = Object.keys(consts_1.DEPENDENCIES.common)
            .map(name => chalk_1.default.blue(name))
            .join(', ');
        logger_1.default.info(`Adding common dependencies to root: ${depList}`);
        installDeps(consts_1.DEPENDENCIES.common);
    }
    logger_1.default.info(`Configuring ${chalk_1.default.blue('.eslintrc')}`);
    utils_2.eslintrcEditor.write('.', consts_1.CONTENT_BASE_ESLINT_RC);
    logger_1.default.info(`Configuring ${chalk_1.default.blue('.eslintignore')}`);
    utils_2.eslintIgnoreEditor.write('.', consts_1.CONTENT_ESLINT_IGNORE.trim());
    logger_1.default.info(`Configuring ${chalk_1.default.blue('.prettierrc')}`);
    utils_2.prettierrcEditor.write('.', consts_1.CONTENT_PRETTIER_RC.trim());
}
/**
 * Installs and sets up root dependencies related to each builder.
 * @param {Manifest} manifest
 */
function setupBuilderTools(builders) {
    const rootPkgJson = utils_2.getRootPackageJson();
    for (const builder of builders) {
        const builderDeps = consts_1.DEPENDENCIES[builder];
        if (builderDeps != null) {
            const hasDepsInstalled = utils_2.hasDevDependenciesInstalled({
                deps: consts_1.DEPENDENCIES[builder],
                pkg: rootPkgJson,
            });
            if (hasDepsInstalled)
                continue;
            const depList = Object.keys(consts_1.DEPENDENCIES[builder])
                .map(name => chalk_1.default.blue(name))
                .join(', ');
            logger_1.default.info(`Adding "${chalk_1.default.yellow(builder)}" builder dependencies to root: ${depList}`);
            installDeps(consts_1.DEPENDENCIES[builder]);
        }
        const eslintConfig = consts_1.CONTENT_ESLINT_RC_BUILDERS[builder];
        if (eslintConfig != null) {
            logger_1.default.info(`Configuring ${chalk_1.default.blue(`${builder}/.eslintrc`)}`);
            utils_2.eslintrcEditor.write(builder, eslintConfig);
        }
    }
}
function setupTooling(manifest, buildersWithTooling = consts_1.BUILDERS_WITH_TOOLING) {
    logger_1.default.info(`Setting up tooling`);
    const builders = Object.keys(manifest.builders || {});
    const needTooling = builders.some(b => buildersWithTooling.includes(b));
    if (!needTooling) {
        logger_1.default.warn(`This project doesn't have builders candidates for tooling`);
        return;
    }
    try {
        configurePackageJson(manifest);
        setupCommonTools();
        setupBuilderTools(builders);
        logger_1.default.info('Finished setting up tooling');
    }
    catch (err) {
        ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
            kind: ErrorKinds_1.ErrorKinds.SETUP_TOOLING_ERROR,
            originalError: err,
        }).logErrorForUser();
    }
}
exports.setupTooling = setupTooling;
