"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const SessionManager_1 = require("../../lib/session/SessionManager");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
exports.default = async (workspace1 = 'master', workspace2) => {
    workspace2 = workspace2 !== null && workspace2 !== void 0 ? workspace2 : SessionManager_1.SessionManager.getSingleton().workspace;
    const deps1 = await utils_2.getCleanDependencies(workspace1);
    const deps2 = await utils_2.getCleanDependencies(workspace2);
    const diffTable = utils_1.matchedDepsDiffTable(workspace1, workspace2, deps1, deps2);
    if (diffTable.length === 1) {
        return console.log(`${chalk_1.default.yellow('Dependency diff')} between ${chalk_1.default.yellow(workspace1)} and ${chalk_1.default.yellow(workspace2)} is empty\n`);
    }
    console.log(`${chalk_1.default.yellow('Dependency diff')} between ${chalk_1.default.yellow(workspace1)} and ${chalk_1.default.yellow(workspace2)}`);
    console.log(diffTable.toString());
};
