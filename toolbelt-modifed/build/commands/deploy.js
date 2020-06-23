"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const deploy_1 = tslib_1.__importDefault(require("../modules/apps/deploy"));
class Deploy extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { appId }, flags: { yes }, } = this.parse(Deploy);
        await deploy_1.default(appId, { yes });
    }
}
exports.default = Deploy;
Deploy.description = 'Deploy a release of an app';
Deploy.examples = ['vtex deploy', 'vtex deploy vtex.service-example@0.0.1'];
Deploy.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    yes: command_1.flags.boolean({ char: 'y', description: 'Answer yes to confirmation prompts' }),
};
Deploy.args = [{ name: 'appId' }];
