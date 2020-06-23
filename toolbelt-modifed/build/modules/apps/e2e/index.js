"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ink_1 = require("ink");
const react_1 = tslib_1.__importDefault(require("react"));
const Apps_1 = require("../../../lib/clients/IOClients/infra/Apps");
const Tester_1 = require("../../../lib/clients/IOClients/apps/Tester");
const ManifestEditor_1 = require("../../../lib/manifest/ManifestEditor");
const SessionManager_1 = require("../../../lib/session/SessionManager");
const index_1 = require("./report/index");
class EndToEndCommand {
    constructor(options) {
        this.options = options;
        this.tester = Tester_1.Tester.createClient();
    }
    run() {
        if (this.options.workspace) {
            return this.runWorkspaceTests();
        }
        return this.runAppTests();
    }
    async runAppTests() {
        const manifestEditor = await ManifestEditor_1.ManifestEditor.getManifestEditor();
        const cleanAppId = manifestEditor.appLocator;
        const apps = Apps_1.createAppsClient();
        const { data: workspaceAppsList } = await apps.listApps();
        const appItem = workspaceAppsList.find(({ app }) => app.startsWith(cleanAppId));
        if (appItem === undefined) {
            throw new Error(`App "${cleanAppId}" was not found in the current workspace!`);
        }
        const testRequest = this.options.report
            ? null
            : await this.tester.test({
                integration: true,
                monitoring: true,
                authToken: this.options.token ? SessionManager_1.SessionManager.getSingleton().token : undefined,
            }, appItem.id);
        this.render(testRequest);
    }
    async runWorkspaceTests() {
        const testRequest = this.options.report
            ? null
            : await this.tester.test({
                integration: true,
                monitoring: true,
                authToken: this.options.token ? SessionManager_1.SessionManager.getSingleton().token : undefined,
            });
        this.render(testRequest);
    }
    async render(testRequest) {
        const testId = testRequest ? testRequest.testId : this.options.report;
        const requestedAt = testRequest ? testRequest.requestedAt : null;
        const initialReport = await this.tester.report(testId);
        ink_1.render(react_1.default.createElement(index_1.RealTimeReport, { initialReport: initialReport, testId: testId, poll: () => this.tester.report(testId), interval: 2000, requestedAt: requestedAt }));
    }
}
exports.default = options => {
    return new EndToEndCommand(options).run();
};
