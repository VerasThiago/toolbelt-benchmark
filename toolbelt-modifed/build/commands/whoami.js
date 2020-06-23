"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const whoami_1 = tslib_1.__importDefault(require("../modules/auth/whoami"));
class WhoAmI extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(WhoAmI);
        await whoami_1.default();
    }
}
exports.default = WhoAmI;
WhoAmI.description = 'See your credentials current status';
WhoAmI.examples = ['vtex whoami'];
WhoAmI.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
WhoAmI.args = [];
