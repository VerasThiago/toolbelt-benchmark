"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const init_1 = tslib_1.__importDefault(require("../modules/init"));
class Init extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(Init);
        await init_1.default();
    }
}
exports.default = Init;
Init.description = 'Create basic files and folders for your VTEX app';
Init.examples = ['vtex init'];
Init.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Init.args = [];
