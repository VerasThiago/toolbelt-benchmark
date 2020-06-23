"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const set_1 = tslib_1.__importDefault(require("../../modules/apps/settings/set"));
class SettingsSet extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { appName, field, value }, } = this.parse(SettingsSet);
        await set_1.default(appName, field, value);
    }
}
exports.default = SettingsSet;
SettingsSet.description = 'Set app settings';
SettingsSet.examples = ['vtex settings set vtex.service-example fieldName fieldValue'];
SettingsSet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
SettingsSet.args = [
    { name: 'appName', required: true },
    { name: 'field', required: true },
    { name: 'value', required: true },
];
