"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const link_1 = tslib_1.__importDefault(require("../modules/apps/link"));
class Link extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags, flags: { setup, clean, unsafe }, } = this.parse(Link);
        const noWatch = flags['no-watch'];
        await link_1.default({ setup, clean, unsafe, noWatch });
    }
}
exports.default = Link;
Link.description = 'Start a development session for this app';
Link.examples = [];
Link.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    clean: command_1.flags.boolean({ char: 'c', description: 'Clean builder cache', default: false }),
    setup: command_1.flags.boolean({
        char: 's',
        description: 'Setup typings before linking [see vtex setup --help]',
        default: false,
    }),
    'no-watch': command_1.flags.boolean({ description: "Don't watch for file changes after initial link", default: false }),
    unsafe: command_1.flags.boolean({ char: 'u', description: 'Allow links with Typescript errors', default: false }),
};
Link.args = [];
