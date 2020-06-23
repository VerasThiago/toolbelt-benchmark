"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CustomCommand_1 = require("../oclif/CustomCommand");
const release_1 = tslib_1.__importStar(require("../modules/release"));
class Release extends CustomCommand_1.CustomCommand {
    async run() {
        const { args: { releaseType, tagName }, } = this.parse(Release);
        await release_1.default(releaseType, tagName);
    }
}
exports.default = Release;
Release.description = 'Bump app version, commit and push to remote. Only for git users. The first option can also be a specific valid semver version';
Release.examples = [
    'vtex release',
    'vtex release patch',
    'vtex release patch beta',
    'vtex release minor stable',
    'vtex release pre',
];
Release.flags = {
    ...CustomCommand_1.CustomCommand.globalFlags,
};
Release.args = [
    {
        name: 'releaseType',
        required: false,
        default: 'patch',
        options: [...Object.keys(release_1.releaseTypeAliases), ...release_1.supportedReleaseTypes],
    },
    { name: 'tagName', required: false, default: 'beta', options: release_1.supportedTagNames },
];
