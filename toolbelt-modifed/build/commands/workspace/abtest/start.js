"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const start_1 = tslib_1.__importDefault(require("../../../modules/workspace/abtest/start"));
const CustomCommand_1 = require("../../../oclif/CustomCommand");
class ABTestStart extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(ABTestStart);
        await start_1.default();
    }
}
exports.default = ABTestStart;
ABTestStart.description = 'Start AB testing with current workspace';
ABTestStart.examples = [];
ABTestStart.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ABTestStart.args = [];
