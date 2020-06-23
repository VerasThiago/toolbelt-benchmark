"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const logs_1 = tslib_1.__importDefault(require("../modules/apps/logs"));
class Logs extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { app }, flags, } = this.parse(Logs);
        await logs_1.default(app, flags);
    }
}
exports.default = Logs;
Logs.description = 'Show apps production logs';
Logs.examples = ['vtex logs', 'vtex logs appName', 'vtex logs --all', 'vtex logs appName --past'];
Logs.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    all: command_1.flags.boolean({ char: 'a', description: "Show all logs from this account's apps", default: false }),
    past: command_1.flags.boolean({
        char: 'p',
        description: "Show logs already seen from this account's apps",
        default: false,
    }),
};
Logs.args = [{ name: 'app', required: false }];
