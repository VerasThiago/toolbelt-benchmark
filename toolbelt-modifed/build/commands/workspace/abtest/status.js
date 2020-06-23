"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const status_1 = tslib_1.__importDefault(require("../../../modules/workspace/abtest/status"));
const CustomCommand_1 = require("../../../oclif/CustomCommand");
class ABTestStatus extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(ABTestStatus);
        await status_1.default();
    }
}
exports.default = ABTestStatus;
ABTestStatus.description = 'Display currently running AB tests results';
ABTestStatus.examples = ['vtex workspace abtest status'];
ABTestStatus.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ABTestStatus.args = [];
