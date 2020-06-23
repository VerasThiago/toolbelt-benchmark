"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const setEdition_1 = tslib_1.__importDefault(require("../../modules/sponsor/setEdition"));
class EditionSet extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { edition }, } = this.parse(EditionSet);
        await setEdition_1.default(edition);
    }
}
exports.default = EditionSet;
EditionSet.description = 'Set edition of the current account';
EditionSet.examples = ['vtex edition set editionName'];
EditionSet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
EditionSet.args = [{ name: 'edition', required: true }];
