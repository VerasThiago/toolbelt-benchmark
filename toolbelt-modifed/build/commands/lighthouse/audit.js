"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const auditUrl_1 = tslib_1.__importDefault(require("../../modules/lighthouse/auditUrl"));
class AuditUrl extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { url }, flags: { json }, } = this.parse(AuditUrl);
        await auditUrl_1.default(url, { json });
    }
}
exports.default = AuditUrl;
AuditUrl.description = 'Run lighthouse audit over a specific url';
AuditUrl.examples = ['vtex lighthouse audit my.url.com', 'vtex lh audit my.url.com'];
AuditUrl.aliases = ['lh:audit'];
AuditUrl.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    json: command_1.flags.boolean({ char: 'j', description: 'Return the report as json on stdout', default: false }),
};
AuditUrl.args = [{ name: 'url', required: true }];
