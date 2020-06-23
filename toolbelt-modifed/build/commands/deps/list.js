"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const list_1 = tslib_1.__importDefault(require("../../modules/deps/list"));
class DepsList extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags } = this.parse(DepsList);
        await list_1.default(flags);
    }
}
exports.default = DepsList;
DepsList.aliases = ['deps:ls'];
DepsList.description = 'List your workspace dependencies';
DepsList.examples = ['vtex deps list', 'vtex deps ls'];
DepsList.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    keys: command_1.flags.boolean({ char: 'k', description: 'Show only keys', default: false }),
    npm: command_1.flags.boolean({ char: 'n', description: 'Include deps from npm registry', default: false }),
};
DepsList.args = [];
