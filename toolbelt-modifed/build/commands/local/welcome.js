"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const welcome_1 = tslib_1.__importDefault(require("../../modules/auth/welcome"));
class Welcome extends CustomCommand_1.CustomCommand {
    async run() {
        return welcome_1.default();
    }
}
exports.default = Welcome;
Welcome.description = 'Gives some commonly sought-after info after you log in';
Welcome.examples = ['vtex welcome', 'vtex local welcome'];
Welcome.aliases = ['welcome'];
Welcome.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Welcome.args = [];
