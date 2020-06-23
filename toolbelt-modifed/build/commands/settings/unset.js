"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const unset_1 = tslib_1.__importDefault(require("../../modules/apps/settings/unset"));
class SettingsUnset extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { appName, field }, } = this.parse(SettingsUnset);
        await unset_1.default(appName, field);
    }
}
exports.default = SettingsUnset;
SettingsUnset.description = 'Unset app settings';
SettingsUnset.examples = ['vtex settings unset vtex.service-example fieldName'];
SettingsUnset.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
SettingsUnset.args = [
    { name: 'appName', required: true },
    { name: 'field', required: true },
];
