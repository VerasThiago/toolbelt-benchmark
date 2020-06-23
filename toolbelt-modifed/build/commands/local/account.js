"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const account_1 = tslib_1.__importDefault(require("../../modules/local/account"));
class LocalAccount extends CustomCommand_1.CustomCommand {
    async run() {
        account_1.default();
    }
}
exports.default = LocalAccount;
LocalAccount.description = 'Show current account and copy it to clipboard';
LocalAccount.examples = ['vtex local account'];
LocalAccount.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
LocalAccount.args = [];
