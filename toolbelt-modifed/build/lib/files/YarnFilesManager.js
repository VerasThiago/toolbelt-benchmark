"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globby_1 = tslib_1.__importDefault(require("globby"));
const path_1 = require("path");
const stream_1 = require("stream");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const ProjectFilesManager_1 = require("./ProjectFilesManager");
const YarnLinkedFilesConfig_1 = require("./YarnLinkedFilesConfig");
const stringToStream = (str) => {
    const stream = new stream_1.PassThrough();
    stream.end(str);
    return stream;
};
class YarnFilesManager {
    constructor(linkConfig) {
        this.linkConfig = linkConfig;
        this.maybeMapLocalYarnLinkedPathToProjectPath = (path, projectPath) => {
            const absolutePath = path_1.resolve(projectPath, path);
            const linkedModules = this.yarnLinkedDependencies;
            for (const moduleInfo of linkedModules) {
                if (absolutePath.startsWith(moduleInfo.path)) {
                    return absolutePath.replace(moduleInfo.path, path_1.join(YarnFilesManager.BUILDER_HUB_LINKED_DEPS_DIR, moduleInfo.moduleName));
                }
            }
            return path;
        };
    }
    static async createFilesManager(projectSrc) {
        const yarnLinkedModulesConfig = await YarnLinkedFilesConfig_1.YarnSymlinkedModulesConfig.createConfig(projectSrc);
        return new YarnFilesManager(yarnLinkedModulesConfig);
    }
    static async getFiles(npmModule, path) {
        const files = await globby_1.default(['**'], {
            cwd: path,
            ignore: YarnFilesManager.LINKED_YARN_MODULES_IGNORED_FILES,
            nodir: true,
        });
        return files.map(ProjectFilesManager_1.createPathToFileObject(path, path_1.join(YarnFilesManager.BUILDER_HUB_LINKED_DEPS_DIR, npmModule)));
    }
    get symlinkedDepsDirs() {
        return this.linkConfig.symlinkedDepsDirs;
    }
    get yarnLinkedDependencies() {
        return this.linkConfig.symlinkedDependencies;
    }
    async getYarnLinkedFiles() {
        const npmModules = this.linkConfig.symlinkedModules;
        const filesPerNpmModule = await Promise.all(npmModules.map(npmModule => {
            return YarnFilesManager.getFiles(npmModule, this.linkConfig.metadata[npmModule]);
        }));
        const npmModulesFiles = filesPerNpmModule.reduce((acc, moduleFiles) => {
            return acc.concat(...moduleFiles);
        }, []);
        if (npmModulesFiles.length === 0) {
            return [];
        }
        const configJson = this.linkConfig.toJson();
        npmModulesFiles.push({
            path: YarnFilesManager.BUILDER_HUB_LINKED_DEPS_CONFIG_PATH,
            content: stringToStream(configJson),
            byteSize: Buffer.byteLength(configJson),
        });
        return npmModulesFiles;
    }
    logSymlinkedDependencies() {
        const linkedDeps = this.yarnLinkedDependencies;
        if (!linkedDeps.length) {
            return;
        }
        const plural = linkedDeps.length > 1;
        logger_1.default.info(`The following local dependenc${plural ? 'ies are' : 'y is'} linked to your app:`);
        linkedDeps.forEach(({ moduleName, path }) => logger_1.default.info(`${moduleName} (from: ${path})`));
        logger_1.default.info(`If you don't want ${plural ? 'them' : 'it'} to be used by your vtex app, please unlink ${plural ? 'them' : 'it'}`);
    }
}
exports.YarnFilesManager = YarnFilesManager;
YarnFilesManager.LINKED_YARN_MODULES_IGNORED_FILES = [
    '.DS_Store',
    'README.md',
    '.gitignore',
    'CHANGELOG.md',
    'node_modules/**',
    '**/node_modules/**',
];
YarnFilesManager.BUILDER_HUB_LINKED_DEPS_DIR = '.linked_deps';
YarnFilesManager.BUILDER_HUB_LINKED_DEPS_CONFIG_PATH = path_1.join(YarnFilesManager.BUILDER_HUB_LINKED_DEPS_DIR, '.config');
