"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const create_1 = require("../../modules/workspace/create");
const CustomCommand_1 = require("../../oclif/CustomCommand");
class WorkspaceCreate extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { workspaceName }, flags: { production }, } = this.parse(WorkspaceCreate);
        await create_1.workspaceCreator({
            targetWorkspace: workspaceName,
            promptCreation: false,
            logIfAlreadyExists: true,
            productionWorkspace: production,
        });
    }
}
exports.default = WorkspaceCreate;
WorkspaceCreate.description = 'Create a new workspace';
WorkspaceCreate.examples = ['vtex workspace create workspaceName'];
WorkspaceCreate.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    production: command_1.flags.boolean({ char: 'p', description: 'Create a production workspace', default: false }),
};
WorkspaceCreate.args = [{ name: 'workspaceName' }];
