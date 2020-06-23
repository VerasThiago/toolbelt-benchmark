"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const list_1 = tslib_1.__importDefault(require("../../modules/infra/list"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class InfraList extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { name }, flags: { filter, available }, } = this.parse(InfraList);
        return list_1.default(name, { filter, available });
    }
}
exports.default = InfraList;
InfraList.description = 'List installed infra services';
InfraList.aliases = ['infra:ls'];
InfraList.examples = ['vtex infra list', 'vtex infra ls'];
InfraList.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    filter: command_1.flags.string({ char: 'f', description: 'Only list versions containing this word' }),
    available: command_1.flags.boolean({ char: 'a', description: 'List services available to install' }),
};
InfraList.args = [{ name: 'name', required: false }];
