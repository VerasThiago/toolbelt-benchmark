"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const list_1 = tslib_1.__importDefault(require("../../modules/workspace/list"));
class WorkspaceList extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(WorkspaceList);
        list_1.default();
    }
}
exports.default = WorkspaceList;
WorkspaceList.description = 'List workspaces on this account';
WorkspaceList.aliases = ['workspace:ls'];
WorkspaceList.examples = ['vtex workspace list', 'vtex workspace ls'];
WorkspaceList.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
WorkspaceList.args = [];
