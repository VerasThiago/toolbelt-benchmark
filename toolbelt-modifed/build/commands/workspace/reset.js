"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const reset_1 = tslib_1.__importDefault(require("../../modules/workspace/reset"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspaceReset extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { workspaceName }, flags: { yes, production }, } = this.parse(WorkspaceReset);
        await reset_1.default(workspaceName, { yes, production });
    }
}
exports.default = WorkspaceReset;
WorkspaceReset.description = 'Delete and recreate a workspace';
WorkspaceReset.examples = ['vtex workspace reset', 'vtex workspace reset workspaceName'];
WorkspaceReset.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    production: command_1.flags.boolean({
        char: 'p',
        description: 'Re-create the workspace as a production one',
        default: false,
    }),
    yes: command_1.flags.boolean({ char: 'y', description: 'Answer yes to confirmation prompts' }),
};
WorkspaceReset.args = [{ name: 'workspaceName', required: false }];
