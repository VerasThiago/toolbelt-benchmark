"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const import_1 = tslib_1.__importDefault(require("../../modules/rewriter/import"));
class RedirectsImport extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { csvPath }, flags: { reset }, } = this.parse(RedirectsImport);
        await import_1.default(csvPath, { reset });
    }
}
exports.default = RedirectsImport;
RedirectsImport.description = 'Import redirects for the current account and workspace';
RedirectsImport.examples = ['vtex redirects import csvPath'];
RedirectsImport.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    reset: command_1.flags.boolean({ char: 'r', description: 'Remove all previous redirects', default: false }),
};
RedirectsImport.args = [{ name: 'csvPath', required: true }];
