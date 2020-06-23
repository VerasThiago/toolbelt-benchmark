"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const errors_1 = require("../../errors");
const SessionManager_1 = require("../../lib/session/SessionManager");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const create_1 = require("./create");
const reset_1 = tslib_1.__importDefault(require("./reset"));
exports.default = async (name, options) => {
    var _a;
    const session = SessionManager_1.SessionManager.getSingleton();
    const production = options === null || options === void 0 ? void 0 : options.production;
    const reset = (_a = options === null || options === void 0 ? void 0 : options.reset) !== null && _a !== void 0 ? _a : false;
    if (name === '-') {
        name = session.lastUsedWorkspace;
        if (name == null) {
            throw new errors_1.CommandError('No last used workspace was found');
        }
    }
    const result = await session.workspaceSwitch({
        targetWorkspace: name,
        workspaceCreation: {
            production,
            promptCreation: true,
            creator: create_1.workspaceCreator,
            onError: create_1.handleErrorCreatingWorkspace,
        },
    });
    if (reset && result !== 'created') {
        await reset_1.default(name, { production });
    }
    const { account, workspace } = session;
    logger_1.default.info(`You're now using the workspace ${chalk_1.default.green(workspace)} on account ${chalk_1.default.blue(account)}!`);
};
