"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const logout_1 = tslib_1.__importDefault(require("../modules/auth/logout"));
class Logout extends CustomCommand_1.CustomCommand {
    async run() {
        logout_1.default();
    }
}
exports.default = Logout;
Logout.description = 'Logout of the current VTEX account';
Logout.examples = ['vtex logout'];
Logout.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Logout.args = [];
