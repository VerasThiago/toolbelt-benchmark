"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const finish_1 = tslib_1.__importDefault(require("../../../modules/workspace/abtest/finish"));
const CustomCommand_1 = require("../../../oclif/CustomCommand");
class ABTestFinish extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(ABTestFinish);
        await finish_1.default();
    }
}
exports.default = ABTestFinish;
ABTestFinish.description = 'Stop all AB testing in current account';
ABTestFinish.examples = [];
ABTestFinish.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ABTestFinish.args = [];
