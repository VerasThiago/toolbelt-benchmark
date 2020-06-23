"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const Apps_1 = require("../../lib/clients/IOClients/infra/Apps");
const isNpm = dep => dep.startsWith('npm:');
exports.removeNpm = (deps, inValues) => {
    Object.keys(deps).forEach(key => {
        if (isNpm(key)) {
            return delete deps[key];
        }
        if (inValues) {
            deps[key] = deps[key].filter(d => !isNpm(d));
        }
    });
    return deps;
};
const cleanDeps = ramda_1.compose(ramda_1.keys, exports.removeNpm);
exports.getCleanDependencies = async (workspace) => {
    return (await Apps_1.createAppsClient({ workspace })
        .getDependencies()
        .then(cleanDeps));
};
