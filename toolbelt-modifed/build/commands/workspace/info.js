"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const info_1 = tslib_1.__importDefault(require("../../modules/workspace/info"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspaceInfo extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(WorkspaceInfo);
        await info_1.default();
    }
}
exports.default = WorkspaceInfo;
WorkspaceInfo.description = 'Display information about the current workspace';
WorkspaceInfo.examples = ['vtex workspace info'];
WorkspaceInfo.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
WorkspaceInfo.args = [];
