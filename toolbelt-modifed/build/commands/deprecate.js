"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const deprecate_1 = tslib_1.__importDefault(require("../modules/apps/deprecate"));
class Deprecate extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw, flags: { yes }, } = this.parse(Deprecate);
        const allArgs = this.getAllArgs(raw);
        await deprecate_1.default(allArgs, { yes });
    }
}
exports.default = Deprecate;
Deprecate.description = 'Deprecate an app';
Deprecate.examples = ['vtex deprecate', 'vtex deprecate vtex.service-example@0.0.1'];
Deprecate.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    yes: command_1.flags.boolean({ description: 'Confirm all prompts', char: 'y', default: false }),
};
Deprecate.strict = false;
Deprecate.args = [
    { name: 'appId', required: false },
    { name: 'ithAppId', required: false, multiple: true },
];
