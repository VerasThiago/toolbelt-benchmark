"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const use_1 = tslib_1.__importDefault(require("../../modules/workspace/use"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspaceUse extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { workspace }, flags: { production, reset }, } = this.parse(WorkspaceUse);
        await use_1.default(workspace, { production, reset });
    }
}
exports.default = WorkspaceUse;
WorkspaceUse.description = 'Use a workspace to perform operations';
WorkspaceUse.examples = ['vtex workspace use workspaceName', 'vtex use workspaceName'];
WorkspaceUse.aliases = ['use'];
WorkspaceUse.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    production: command_1.flags.boolean({
        char: 'p',
        description: 'Create the workspace as production if it does not exist or is reset',
        default: false,
    }),
    reset: command_1.flags.boolean({ char: 'r', description: 'Resets workspace before using it', default: false }),
};
WorkspaceUse.args = [{ name: 'workspace', required: true }];
