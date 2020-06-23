"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const update_1 = tslib_1.__importDefault(require("../modules/housekeeper/update"));
class Update extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(Update);
        await update_1.default();
    }
}
exports.default = Update;
Update.description = 'Update all installed apps to the latest (minor or patch) version';
Update.examples = ['vtex update'];
Update.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Update.args = [];
