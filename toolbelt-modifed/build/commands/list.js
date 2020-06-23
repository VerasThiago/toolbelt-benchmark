"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const list_1 = tslib_1.__importDefault(require("../modules/apps/list"));
class List extends CustomCommand_1.CustomCommand {
    async run() {
        this.parse(List);
        await list_1.default();
    }
}
exports.default = List;
List.description = 'List your installed VTEX apps';
List.examples = ['vtex list', 'vtex ls'];
List.aliases = ['ls'];
List.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
List.args = [];
