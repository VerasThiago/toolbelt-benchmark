"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const add_1 = tslib_1.__importDefault(require("../modules/apps/add"));
class Add extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw } = this.parse(Add);
        const args = this.getAllArgs(raw);
        await add_1.default(args);
    }
}
exports.default = Add;
Add.description = 'Add app(s) to the manifest dependencies';
Add.examples = ['vtex add vtex.service-example@0.x'];
Add.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Add.strict = false;
Add.args = [
    { name: 'appId', required: true },
    { name: 'ithAppId', required: false, multiple: true },
];
