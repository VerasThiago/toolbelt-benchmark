"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const semver_1 = tslib_1.__importDefault(require("semver"));
const conf_1 = require("../conf");
const Paths_1 = require("../lib/constants/Paths");
const DeprecationChecker_1 = require("./DeprecationChecker/DeprecationChecker");
const OutdatedChecker_1 = require("./OutdatedChecker/OutdatedChecker");
const EnvVariables_1 = require("../lib/constants/EnvVariables");
class CLIPreTasks {
    constructor(pkg) {
        this.pkg = pkg;
    }
    static getCLIPreTasks(pkgJson) {
        return new CLIPreTasks(pkgJson);
    }
    ensureCompatibleNode() {
        const nodeVersion = process.version;
        if (semver_1.default.satisfies(nodeVersion, this.pkg.engines.node)) {
            return;
        }
        const minMajor = this.pkg.engines.node.replace('>=', '');
        const errMsg = chalk_1.default.bold(`Incompatible with node < v${minMajor}. Please upgrade node to major ${minMajor} or higher.`);
        console.error(errMsg);
        process.exit(1);
    }
    removeOutdatedPaths() {
        // TODO: Add metrics to check for outdated paths
        const outdatedPaths = {
            telemetryPath: path_1.join(conf_1.configDir, 'vtex', 'telemetry'),
            cliPreChecker: path_1.join(conf_1.configDir, 'vtex', 'prechecks'),
            oldVtexFolder: path_1.join(conf_1.configDir, 'vtex'),
            telemetryStore: path_1.join(conf_1.configDir, 'vtex-telemetry-store.json'),
            deprecationStore: path_1.join(conf_1.configDir, 'deprecation-checking.json'),
        };
        Object.keys(outdatedPaths).forEach(pathKey => {
            if (fs_extra_1.pathExistsSync(outdatedPaths[pathKey])) {
                fs_extra_1.removeSync(outdatedPaths[pathKey]);
            }
        });
    }
    runTasks() {
        if (process.env[EnvVariables_1.EnvVariablesConstants.IGNORE_CLIPRETASKS]) {
            return;
        }
        this.ensureCompatibleNode();
        this.removeOutdatedPaths();
        DeprecationChecker_1.DeprecationChecker.checkForDeprecation(CLIPreTasks.PRETASKS_LOCAL_DIR, this.pkg);
        OutdatedChecker_1.OutdatedChecker.checkForOutdate(CLIPreTasks.PRETASKS_LOCAL_DIR, this.pkg);
    }
}
exports.CLIPreTasks = CLIPreTasks;
CLIPreTasks.PRETASKS_LOCAL_DIR = Paths_1.PathConstants.PRETASKS_FOLDER;
