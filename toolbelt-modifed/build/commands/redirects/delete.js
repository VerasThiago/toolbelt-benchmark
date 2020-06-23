"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const delete_1 = tslib_1.__importDefault(require("../../modules/rewriter/delete"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class RedirectsDelete extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { csvPath }, } = this.parse(RedirectsDelete);
        await delete_1.default(csvPath);
    }
}
exports.default = RedirectsDelete;
RedirectsDelete.description = 'Delete redirects in the current account and workspace';
RedirectsDelete.examples = ['vtex redirects delete csvPath'];
RedirectsDelete.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
RedirectsDelete.args = [{ name: 'csvPath', required: true }];
