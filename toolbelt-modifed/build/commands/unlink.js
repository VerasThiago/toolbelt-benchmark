"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const unlink_1 = tslib_1.__importDefault(require("../modules/apps/unlink"));
class Unlink extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { all }, } = this.parse(Unlink);
        const allArgs = this.getAllArgs(raw);
        await unlink_1.default(allArgs, { all });
    }
}
exports.default = Unlink;
Unlink.description = 'Unlink an app on the current directory or a specified one';
Unlink.examples = ['vtex unlink', 'vtex unlink vtex.service-example@0.x'];
Unlink.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    all: command_1.flags.boolean({ char: 'a', description: 'Unlink all apps', default: false }),
};
Unlink.strict = false;
Unlink.args = [
    { name: 'appId', required: false },
    { name: 'ithAppId', required: false, multiple: true },
];
