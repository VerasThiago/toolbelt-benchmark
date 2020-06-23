"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promote_1 = tslib_1.__importDefault(require("../../modules/workspace/promote"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspacePromote extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(WorkspacePromote);
        await promote_1.default();
    }
}
exports.default = WorkspacePromote;
WorkspacePromote.description = 'Promote this workspace to master';
WorkspacePromote.aliases = ['promote'];
WorkspacePromote.examples = ['vtex workspace promote', 'vtex promote'];
WorkspacePromote.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
WorkspacePromote.args = [];
