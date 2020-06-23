"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const token_1 = tslib_1.__importDefault(require("../../modules/local/token"));
class LocalToken extends CustomCommand_1.CustomCommand {
    async run() {
        token_1.default();
    }
}
exports.default = LocalToken;
LocalToken.description = "Show user's auth token and copy it to clipboard";
LocalToken.examples = ['vtex local token'];
LocalToken.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
