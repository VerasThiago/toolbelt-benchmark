"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const diff_1 = tslib_1.__importDefault(require("../../modules/deps/diff"));
const SessionManager_1 = require("../../lib/session/SessionManager");
class DepsDiff extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { workspace1, workspace2 }, } = this.parse(DepsDiff);
        await diff_1.default(workspace1, workspace2);
    }
}
exports.default = DepsDiff;
DepsDiff.description = 'Diff between workspace dependencies. If only a parameter is passed the current workspace is used in the diff and if no parameter is passed the diff is made between the current workspace and master';
DepsDiff.examples = ['vtex deps diff workspace1 workspace2'];
DepsDiff.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
DepsDiff.args = [
    { name: 'workspace1', required: false, default: SessionManager_1.SessionManager.getSingleton().workspace },
    { name: 'workspace2', required: false, default: 'master' },
];
