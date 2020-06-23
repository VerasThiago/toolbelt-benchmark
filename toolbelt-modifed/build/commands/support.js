"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const login_1 = tslib_1.__importDefault(require("../modules/support/login"));
class Support extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { account }, } = this.parse(Support);
        await login_1.default(account);
    }
}
exports.default = Support;
Support.description = 'Login as support into another VTEX account';
Support.examples = ['vtex support storecomponents'];
Support.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Support.args = [{ name: 'account', required: true }];
