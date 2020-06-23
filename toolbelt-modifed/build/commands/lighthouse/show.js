"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const CustomCommand_1 = require("../../oclif/CustomCommand");
const showReports_1 = require("../../modules/lighthouse/showReports");
class ShowReports extends CustomCommand_1.CustomCommand {
    async run() {
        const { flags: { app, url }, } = this.parse(ShowReports);
        await showReports_1.showReports(app, url);
    }
}
exports.default = ShowReports;
ShowReports.description = 'Show previous saved audit reports, filtering by app and/or url';
ShowReports.examples = [
    'vtex lighthouse show --app=vtex.awesome-app',
    'vtex lighthouse show -u https://awesome.store.com',
    'vtex lighthouse show -a vtex.awesome-app --url=https://awesome.store.com',
    'vtex lh show --app=vtex.awesome-app',
    'vtex lh show -u https://awesome.store.com',
    'vtex lh show -a vtex.awesome-app --url=https://awesome.store.com',
];
ShowReports.aliases = ['lh:show'];
ShowReports.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
    app: command_1.flags.string({ char: 'a', description: 'App name to be filtered' }),
    url: command_1.flags.string({ char: 'u', description: 'Url to be filtered' }),
};
