"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const update_1 = tslib_1.__importDefault(require("../../modules/infra/update"));
class InfraUpdateCommand extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(InfraUpdateCommand);
        await update_1.default();
    }
}
exports.default = InfraUpdateCommand;
InfraUpdateCommand.description = 'Update all installed infra services';
InfraUpdateCommand.examples = ['vtex infra update'];
InfraUpdateCommand.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
InfraUpdateCommand.args = [];
