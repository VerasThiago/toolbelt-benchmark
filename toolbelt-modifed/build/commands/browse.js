"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../oclif/CustomCommand");
const browse_1 = tslib_1.__importDefault(require("../modules/browse"));
class Browse extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { path }, flags: { qr }, } = this.parse(Browse);
        await browse_1.default(path, { qr, q: qr });
    }
}
exports.default = Browse;
Browse.description = 'Open endpoint in browser window';
Browse.examples = ['vtex browse', 'vtex browse admin'];
Browse.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    qr: command_1.flags.boolean({ char: 'q', description: 'Outputs a QR Code on the terminal' }),
};
Browse.args = [{ name: 'path' }];
