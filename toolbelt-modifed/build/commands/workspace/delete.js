"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const delete_1 = tslib_1.__importDefault(require("../../modules/workspace/delete"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspaceDelete extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { force, yes }, } = this.parse(WorkspaceDelete);
        const names = this.getAllArgs(raw);
        await delete_1.default(names, { yes, force });
    }
}
exports.default = WorkspaceDelete;
WorkspaceDelete.description = 'Delete one or many workspaces';
WorkspaceDelete.examples = ['vtex workspace delete workspaceName', 'vtex workspace delete workspaceName1 workspaceName2'];
WorkspaceDelete.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    force: command_1.flags.boolean({ char: 'f', description: "Ignore if you're currently using the workspace" }),
    yes: command_1.flags.boolean({ char: 'y', description: 'Answer yes to confirmation prompts' }),
};
WorkspaceDelete.strict = false;
WorkspaceDelete.args = [
    { name: 'workspace1', required: true },
    { name: 'ithWorkspace', required: false, multiple: true },
];
