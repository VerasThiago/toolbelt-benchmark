"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const testCommand_1 = tslib_1.__importDefault(require("../../modules/apps/testCommand"));
class UnitTest extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags: { unsafe }, } = this.parse(UnitTest);
        await testCommand_1.default({ unsafe });
    }
}
exports.default = UnitTest;
UnitTest.description = 'Run your VTEX app unit tests';
UnitTest.aliases = ['test'];
UnitTest.examples = [];
UnitTest.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    unsafe: command_1.flags.boolean({ char: 'u', description: 'Allow tests with Typescript errors', default: false }),
};
UnitTest.args = [];
