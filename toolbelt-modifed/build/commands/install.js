"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const install_1 = tslib_1.__importDefault(require("../modules/apps/install"));
class Install extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { force }, } = this.parse(Install);
        const allArgs = this.getAllArgs(raw);
        await install_1.default(allArgs, { force });
    }
}
exports.default = Install;
Install.description = 'Install an app (defaults to the app in the current directory)';
Install.examples = ['vtex install', 'vtex install vtex.service-example@0.x', 'vtex install vtex.service-example@0.0.1'];
Install.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    force: command_1.flags.boolean({
        char: 'f',
        description: 'Install app without checking for route conflicts',
        default: false,
    }),
};
Install.strict = false;
Install.args = [
    { name: 'appId', required: false },
    { name: 'ithAppId', required: false, multiple: true },
];
