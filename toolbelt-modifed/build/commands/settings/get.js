"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const settings_1 = tslib_1.__importDefault(require("../../modules/apps/settings"));
class SettingsGet extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { appName, field }, } = this.parse(SettingsGet);
        await settings_1.default(appName, field ? [field] : null);
    }
}
exports.default = SettingsGet;
SettingsGet.description = 'Get app settings';
SettingsGet.aliases = ['settings'];
SettingsGet.examples = ['vtex settings get vtex.service-example'];
SettingsGet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
SettingsGet.args = [{ name: 'appName', required: true }, { name: 'field' }];
