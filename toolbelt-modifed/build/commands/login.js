"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const login_1 = tslib_1.__importDefault(require("../modules/auth/login"));
class Login extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { account }, flags: { workspace }, } = this.parse(Login);
        await login_1.default({ account, workspace });
    }
}
exports.default = Login;
Login.description = 'Log into a VTEX account';
Login.examples = ['vtex login', 'vtex login storecomponents'];
Login.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    workspace: command_1.flags.string({ char: 'w', description: 'Workspace to login into' }),
};
Login.args = [{ name: 'account', required: false }];
