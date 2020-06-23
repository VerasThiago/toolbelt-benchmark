"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const reset_1 = tslib_1.__importDefault(require("../../modules/config/reset"));
class ConfigReset extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { configName }, } = this.parse(ConfigReset);
        reset_1.default(configName);
    }
}
exports.default = ConfigReset;
ConfigReset.description = 'Reset the requested configuration to the default value';
ConfigReset.aliases = [];
ConfigReset.examples = ['vtex config reset env', 'vtex config reset cluster'];
ConfigReset.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ConfigReset.args = [{ name: 'configName', required: true, options: ['env', 'cluster'] }];
