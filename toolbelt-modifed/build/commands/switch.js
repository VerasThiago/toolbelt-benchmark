"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const switch_1 = require("../modules/auth/switch");
class Switch extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { account }, flags: { workspace }, } = this.parse(Switch);
        await switch_1.switchAccount(account, { workspace, showWelcomeMessage: true });
    }
}
exports.default = Switch;
Switch.description = 'Switch to another VTEX account';
Switch.examples = ['vtex switch storecomponents'];
Switch.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    workspace: command_1.flags.string({ char: 'w', description: 'Specify login workspace' }),
};
Switch.args = [{ name: 'account', required: true }];
