"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const setup_1 = tslib_1.__importDefault(require("../modules/setup"));
class Setup extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags } = this.parse(Setup);
        const ignoreLinked = flags['ignore-linked'];
        await setup_1.default({ ...flags, i: ignoreLinked });
    }
}
exports.default = Setup;
Setup.description = 'Setup development enviroment';
Setup.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    'ignore-linked': command_1.flags.boolean({
        char: 'i',
        description: 'Add only types from apps published',
        default: false,
    }),
    all: command_1.flags.boolean({
        description: 'Select all existing setup flags',
        default: false,
    }),
    typings: command_1.flags.boolean({
        description: 'Setup GraphQL and React typings',
        default: false,
    }),
    tooling: command_1.flags.boolean({
        description: 'Setup tools for applicable builders\nNode and React: Prettier, Husky and ESLint',
        default: false,
    }),
    tsconfig: command_1.flags.boolean({
        description: "Setup React and Node's TSconfig, if applicable",
        default: false,
    }),
};
Setup.args = [];
