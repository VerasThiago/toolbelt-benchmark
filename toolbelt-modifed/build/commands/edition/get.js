"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const getEdition_1 = tslib_1.__importDefault(require("../../modules/sponsor/getEdition"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class EditionGet extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(EditionGet);
        await getEdition_1.default();
    }
}
exports.default = EditionGet;
EditionGet.description = 'Get edition of the current account';
EditionGet.examples = ['vtex edition get'];
EditionGet.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
EditionGet.args = [];
