"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const globby_1 = tslib_1.__importDefault(require("globby"));
const path_1 = require("path");
const ramda_1 = require("ramda");
exports.createPathToFileObject = (root, prefix = '') => {
    return (path) => {
        const realAbsolutePath = path_1.join(root, path);
        const stats = fs_extra_1.statSync(realAbsolutePath);
        return {
            path: path_1.join(prefix, path),
            content: fs_extra_1.createReadStream(realAbsolutePath),
            byteSize: stats.size,
        };
    };
};
class ProjectFilesManager {
    constructor(projectRoot) {
        this.root = projectRoot;
    }
    getIgnoredPaths(test = false) {
        try {
            const filesToIgnore = fs_extra_1.readFileSync(path_1.join(this.root, '.vtexignore'))
                .toString()
                .split('\n')
                .map(path => path.trim())
                .filter(path => path !== '')
                .map(path => path.replace(/\/$/, '/**'))
                .concat(ProjectFilesManager.DEFAULT_IGNORED_FILES);
            return test ? ramda_1.reject(ProjectFilesManager.isTestOrMockPath, filesToIgnore) : filesToIgnore;
        }
        catch (e) {
            return ProjectFilesManager.DEFAULT_IGNORED_FILES;
        }
    }
    async getLocalFiles(test = false) {
        const files = await globby_1.default(['manifest.json', 'policies.json', 'node/.*', 'react/.*'], {
            cwd: this.root,
            follow: true,
            ignore: this.getIgnoredPaths(test),
            nodir: true,
        });
        const filesStats = await Promise.all(files.map(async (file) => {
            const stats = await fs_extra_1.lstat(path_1.join(this.root, file));
            return { file, stats };
        }));
        return filesStats.reduce((acc, { file, stats }) => {
            if (stats.size > 0) {
                acc.push(file);
            }
            return acc;
        }, []);
    }
}
exports.ProjectFilesManager = ProjectFilesManager;
ProjectFilesManager.DEFAULT_IGNORED_FILES = [
    '.DS_Store',
    'README.md',
    '.gitignore',
    'package.json',
    'node_modules/**',
    '**/node_modules/**',
    '.git/**',
];
ProjectFilesManager.isTestOrMockPath = (path) => {
    return /.*(test|mock|snapshot).*/.test(path.toLowerCase());
};
