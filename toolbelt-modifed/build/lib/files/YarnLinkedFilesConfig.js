"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const globby_1 = tslib_1.__importDefault(require("globby"));
const path_1 = require("path");
const ramda_1 = require("ramda");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const isScopedDirOrLink = (path, stats) => {
    return stats != null && ((path.startsWith('@') && stats.isDirectory()) || stats.isSymbolicLink());
};
const isLink = (_, stats) => {
    return stats === null || stats === void 0 ? void 0 : stats.isSymbolicLink();
};
const isScopedModule = (dirName) => {
    return dirName.startsWith('@');
};
class YarnSymlinkedModulesConfig {
    constructor(projectSrc) {
        this.projectSrc = projectSrc;
        this.stack = [];
        this.graph = {};
        this._metadata = {};
    }
    static async createConfig(projectSrc) {
        const conf = new YarnSymlinkedModulesConfig(projectSrc);
        await conf.init();
        return conf;
    }
    get metadata() {
        return this._metadata;
    }
    get symlinkedDepsDirs() {
        return Object.values(this.metadata);
    }
    get symlinkedModules() {
        return Object.keys(this.metadata);
    }
    get symlinkedDependencies() {
        return Object.keys(this.metadata).map((moduleName) => {
            return {
                moduleName,
                path: this.metadata[moduleName],
            };
        });
    }
    async init() {
        const allPackageJsonsFolders = (await globby_1.default([path_1.join('*', 'package.json')], { cwd: this.projectSrc })).map(path_1.dirname);
        this.stack.push(...allPackageJsonsFolders);
        while (this.stack.length > 0) {
            const moduleFolder = this.stack.pop();
            // eslint-disable-next-line no-await-in-loop
            const dependencies = await this.discoverDependencies(moduleFolder);
            this.graph[moduleFolder] = dependencies;
            this.addSubDependenciesToStack(dependencies);
        }
    }
    toJson() {
        return JSON.stringify({
            metadata: this.metadata,
            graph: this.graph,
        });
    }
    async discoverDependencies(currentModule) {
        const path = currentModule in this._metadata ? this._metadata[currentModule] : path_1.join(this.projectSrc, currentModule);
        const depsRoot = path_1.join(path, 'node_modules');
        const submodules = await this.getAllLinkedModules(depsRoot);
        const realPaths = await Promise.all(submodules.map((submoduleName) => this.getModuleRealPath(submoduleName, depsRoot)));
        this.addModulesMetadata(realPaths);
        return realPaths.map(([moduleName]) => moduleName);
    }
    async getModuleRealPath(moduleName, depsRoot) {
        return [moduleName, await fs_extra_1.realpath(path_1.join(depsRoot, ...moduleName.split('/')))];
    }
    async getAllLinkedModules(root) {
        try {
            const npmDirs = await this.getDirs(root, isScopedDirOrLink);
            const [scopedDirectories, regularModules] = ramda_1.partition(isScopedModule, npmDirs);
            const modulesPerScope = await Promise.all(scopedDirectories.map((scopedDir) => this.getLinkedScopedModules(root, scopedDir)));
            return [...regularModules, ...ramda_1.unnest(modulesPerScope)];
        }
        catch (err) {
            return [];
        }
    }
    async getLinkedScopedModules(root, scopedDir) {
        const dirs = await this.getDirs(path_1.join(root, scopedDir), isLink);
        return dirs.map(dir => `${scopedDir}/${dir}`);
    }
    async getDirs(root, isWantedPath) {
        const nullifyInvalidAndUnwantedPaths = async (path) => {
            try {
                const stats = await fs_extra_1.lstat(path_1.join(root, path));
                return isWantedPath(path, stats) ? path : null;
            }
            catch (err) {
                return null;
            }
        };
        const allDirs = await fs_extra_1.readdir(root);
        const validAndNullDirs = await Promise.all(allDirs.map(nullifyInvalidAndUnwantedPaths));
        return validAndNullDirs.filter(dir => dir != null);
    }
    addSubDependenciesToStack(deps) {
        deps.forEach(dep => {
            if (dep in this.graph) {
                return;
            }
            this.stack.push(dep);
            this.graph[dep] = [];
        });
    }
    addModulesMetadata(modulesRealPaths) {
        modulesRealPaths.forEach(([moduleName, path]) => {
            if (moduleName in this._metadata && this._metadata[moduleName] !== path) {
                logger_1.default.warn(`Found ${moduleName} from two sources as linked dependencies. Ignoring the one from ${path}`);
            }
            else {
                this._metadata[moduleName] = path;
            }
        });
    }
}
exports.YarnSymlinkedModulesConfig = YarnSymlinkedModulesConfig;
