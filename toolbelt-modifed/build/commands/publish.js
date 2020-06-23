"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const publish_1 = tslib_1.__importDefault(require("../modules/apps/publish"));
class Publish extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { path }, flags: { yes, workspace, force, tag }, } = this.parse(Publish);
        await publish_1.default(path, { yes, workspace, force, tag });
    }
}
exports.default = Publish;
Publish.description = 'Publish the current app or a path containing an app';
Publish.examples = ['vtex publish'];
Publish.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    tag: command_1.flags.string({ char: 't', description: 'Apply a tag to the release' }),
    workspace: command_1.flags.string({ char: 'w', description: 'Specify the workspace for the app registry' }),
    force: command_1.flags.boolean({
        char: 'f',
        description: 'Publish app without checking if the semver is being respected',
    }),
    yes: command_1.flags.boolean({ char: 'y', description: 'Answer yes to confirmation prompts' }),
};
