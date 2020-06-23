"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const update_1 = tslib_1.__importDefault(require("../../modules/deps/update"));
class DepsUpdate extends CustomCommand_1.CustomCommand {
    async run() {
        const { raw } = this.parse(DepsUpdate);
        const allArgs = this.getAllArgs(raw);
        await update_1.default(allArgs);
    }
}
exports.default = DepsUpdate;
DepsUpdate.description = 'Update all workspace dependencies or a specific app@version';
DepsUpdate.examples = ['vtex deps update', 'vtex deps update vtex.service-example@0.0.1'];
DepsUpdate.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
DepsUpdate.strict = false;
DepsUpdate.args = [
    { name: 'appId', required: false },
    { name: 'ithAppId', required: false, multiple: true },
];
