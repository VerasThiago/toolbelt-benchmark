"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const status_1 = tslib_1.__importDefault(require("../../modules/workspace/status"));
class WorkspaceStatus extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { workspaceName }, } = this.parse(WorkspaceStatus);
        await status_1.default(workspaceName);
    }
}
exports.default = WorkspaceStatus;
WorkspaceStatus.description = 'Display information about a workspace';
WorkspaceStatus.examples = ['vtex workspace status'];
WorkspaceStatus.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
WorkspaceStatus.args = [{ name: 'workspaceName', required: false }];
