"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const get_1 = tslib_1.__importDefault(require("../../modules/config/get"));
class ConfigGet extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { configName }, } = this.parse(ConfigGet);
        get_1.default(configName);
    }
}
exports.default = ConfigGet;
ConfigGet.description = 'Gets the current value for the requested configuration';
ConfigGet.aliases = [];
ConfigGet.examples = ['vtex config get env', 'vtex config get cluster'];
ConfigGet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ConfigGet.args = [{ name: 'configName', required: true, options: ['env', 'cluster'] }];
