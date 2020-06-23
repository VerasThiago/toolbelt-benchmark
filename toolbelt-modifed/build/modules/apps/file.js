"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const globby_1 = tslib_1.__importDefault(require("globby"));
const path_1 = require("path");
const ramda_1 = require("ramda");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const defaultIgnored = [
    '.DS_Store',
    'README.md',
    '.gitignore',
    'package.json',
    'node_modules/**',
    '**/node_modules/**',
    '.git/**',
    'cypress/videos/**',
    'cypress/screenshots/**',
];
const services = ['react', 'render', 'masterdata', 'service'];
const safeFolder = folder => {
    if (folder && services.indexOf(folder) === -1) {
        logger_1.default.warn('Using unknown service', folder);
    }
    return folder ? `./${folder}/**` : '*/**';
};
const isTestOrMockPath = (p) => /.*(test|mock|snapshot).*/.test(p.toLowerCase());
exports.getIgnoredPaths = (root, test = false) => {
    try {
        const filesToIgnore = fs_extra_1.readFileSync(path_1.join(root, '.vtexignore'))
            .toString()
            .split('\n')
            .map(p => p.trim())
            .filter(p => p !== '')
            .map(p => p.replace(/\/$/, '/**'))
            .concat(defaultIgnored);
        return test ? ramda_1.reject(isTestOrMockPath, filesToIgnore) : filesToIgnore;
    }
    catch (e) {
        return defaultIgnored;
    }
};
exports.listLocalFiles = (root, test = false, folder) => Promise.resolve(globby_1.default(['manifest.json', 'policies.json', 'node/.*', 'react/.*', `${safeFolder(folder)}`], {
    cwd: root,
    follow: true,
    ignore: exports.getIgnoredPaths(root, test),
    nodir: true,
}))
    .then((files) => Promise.all(files.map(file => fs_extra_1.lstat(path_1.join(root, file)).then(stats => ({ file, stats })))))
    .then(filesStats => filesStats.reduce((acc, { file, stats }) => {
    if (stats.size > 0) {
        acc.push(file);
    }
    return acc;
}, []));
