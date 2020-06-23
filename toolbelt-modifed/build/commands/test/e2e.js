"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const e2e_1 = tslib_1.__importDefault(require("../../modules/apps/e2e"));
class E2E extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags } = this.parse(E2E);
        e2e_1.default(flags);
    }
}
exports.default = E2E;
E2E.description = "Run your VTEX app's integration tests";
E2E.examples = [];
E2E.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    report: command_1.flags.string({
        char: 'r',
        description: 'Check the results and state of a previously started test given its ID',
    }),
    workspace: command_1.flags.boolean({ char: 'w', description: "Test workspace's apps", default: false }),
    token: command_1.flags.boolean({
        char: 't',
        description: "[Not recommended] Send your personal authorization token to your test session so it's available while running the tests. It can be dangerous because exposes the token via 'authToken' environment variable",
        default: false,
    }),
};
E2E.args = [];
