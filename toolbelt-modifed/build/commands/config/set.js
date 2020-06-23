"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const set_1 = tslib_1.__importDefault(require("../../modules/config/set"));
class ConfigSet extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { configName, value }, } = this.parse(ConfigSet);
        set_1.default(configName, value);
    }
}
exports.default = ConfigSet;
ConfigSet.description = 'Sets the current value for the given configuration';
ConfigSet.aliases = [];
ConfigSet.examples = ['vtex config set env envValue', 'vtex config set cluster clusterValue'];
ConfigSet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
ConfigSet.args = [
    { name: 'configName', required: true, options: ['env', 'cluster'] },
    { name: 'value', required: true },
];
