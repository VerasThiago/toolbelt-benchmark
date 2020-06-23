"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const url_1 = tslib_1.__importDefault(require("../modules/url"));
class URL extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(URL);
        url_1.default();
    }
}
exports.default = URL;
URL.description = 'Prints base URL for current account, workspace and environment';
URL.examples = ['vtex url'];
URL.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
