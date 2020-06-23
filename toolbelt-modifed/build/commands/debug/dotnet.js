"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const dotnet_1 = tslib_1.__importDefault(require("../../modules/debug/dotnet"));
class DotnetDebug extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { debugInst }, } = this.parse(DotnetDebug);
        await dotnet_1.default(debugInst);
    }
}
exports.default = DotnetDebug;
DotnetDebug.description = 'Debug .NET applications (IDEs only)';
DotnetDebug.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
DotnetDebug.args = [{ name: 'debugInst', required: true }];
