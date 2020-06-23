"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const install_1 = tslib_1.__importDefault(require("../../modules/infra/install"));
const CustomCommand_1 = require("../../oclif/CustomCommand");
class InfraInstall extends CustomCommand_1.CustomCommand {
    async run() {
        const { args } = this.parse(InfraInstall);
        const name = args.serviceId;
        await install_1.default(name);
    }
}
exports.default = InfraInstall;
InfraInstall.description = 'Install an infra service';
InfraInstall.examples = ['vtex infra install infra-service', 'vtex infra install infra-service@0.0.1'];
InfraInstall.flags = { ...CustomCommand_1.CustomCommand.globalFlags };
InfraInstall.args = [{ name: 'serviceId', required: true }];
