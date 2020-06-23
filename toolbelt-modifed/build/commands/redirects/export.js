"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const export_1 = tslib_1.__importDefault(require("../../modules/rewriter/export"));
class RedirectsExport extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { csvPath }, } = this.parse(RedirectsExport);
        await export_1.default(csvPath);
    }
}
exports.default = RedirectsExport;
RedirectsExport.description = 'Export all redirects in the current account and workspace';
RedirectsExport.examples = ['vtex redirects export csvPath'];
RedirectsExport.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
RedirectsExport.args = [{ name: 'csvPath', required: true }];
