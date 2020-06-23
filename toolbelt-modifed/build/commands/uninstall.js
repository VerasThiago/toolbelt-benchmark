"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const uninstall_1 = tslib_1.__importDefault(require("../modules/apps/uninstall"));
class Uninstall extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { yes }, } = this.parse(Uninstall);
        const allArgs = this.getAllArgs(raw);
        await uninstall_1.default(allArgs, { yes });
    }
}
exports.default = Uninstall;
Uninstall.description = 'Uninstall an app (defaults to the app in the current directory)';
Uninstall.examples = ['vtex uninstall', 'vtex uninstall vtex.service-example', 'vtex uninstall vtex.service-example@0.x'];
Uninstall.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    yes: command_1.flags.boolean({ char: 'y', description: 'Auto confirm prompts' }),
};
Uninstall.strict = false;
Uninstall.args = [
    { name: 'appName', required: false },
    { name: 'ithAppName', required: false, multiple: true },
];
