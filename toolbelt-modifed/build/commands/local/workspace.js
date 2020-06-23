"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const workspace_1 = tslib_1.__importDefault(require("../../modules/local/workspace"));
class LocalWorkspace extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(LocalWorkspace);
        workspace_1.default();
    }
}
exports.default = LocalWorkspace;
LocalWorkspace.description = 'Show current workspace and copy it to clipboard';
LocalWorkspace.examples = ['vtex local workspace'];
LocalWorkspace.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
LocalWorkspace.args = [];
