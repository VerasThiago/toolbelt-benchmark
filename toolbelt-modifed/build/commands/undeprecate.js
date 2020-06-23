"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const undeprecate_1 = tslib_1.__importDefault(require("../modules/apps/undeprecate"));
class Undeprecate extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { yes }, } = this.parse(Undeprecate);
        const allArgs = this.getAllArgs(raw);
        await undeprecate_1.default(allArgs, { yes });
    }
}
exports.default = Undeprecate;
Undeprecate.description = 'Undeprecate app';
Undeprecate.examples = ['vtex undeprecate vtex.service-example@0.0.1'];
Undeprecate.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    yes: command_1.flags.boolean({ description: 'Confirm all prompts', char: 'y', default: false }),
};
Undeprecate.strict = false;
Undeprecate.args = [
    { name: 'appId', required: false },
    { name: 'ithAppId', required: false, multiple: true },
];
