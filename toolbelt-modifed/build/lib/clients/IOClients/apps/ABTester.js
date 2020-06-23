"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
const routes = {
    Abort: (workspace) => `${routes.ABTester}/finish/${workspace}`,
    ABTester: '/_v/private/abtesting',
    Initialize: (workspace) => `${routes.ABTester}/initialize/${workspace}`,
    InitializeLegacy: (workspace, probability) => `${routes.ABTester}/initialize/${workspace}/${probability}`,
    InitializeWithParameters: (workspace, hours, proportion) => `${routes.ABTester}/initialize/parameters/${workspace}/${hours}/${proportion}`,
    Preview: (probability) => `${routes.ABTester}/time/${probability}`,
    Status: () => `${routes.ABTester}/status`,
};
class ABTester extends api_1.AppClient {
    constructor(context, options) {
        super('vtex.ab-tester@0.x', context, options);
        // Abort AB Test in a workspace.
        this.finish = async (workspace) => this.http.post(routes.Abort(workspace), {}, { metric: 'abtester-finish' });
        // Start AB Test in a workspace with a given proportion of traffic and the duration of this enforcement.
        this.customStart = async (workspace, hours, proportion) => this.http.post(routes.InitializeWithParameters(workspace, hours, proportion), {}, { metric: 'abtester-start' });
        // Start AB Test in a workspace with a given probability.
        this.startLegacy = async (workspace, probability) => this.http.post(routes.InitializeLegacy(workspace, probability), {}, { metric: 'abtester-start' });
        // Start AB Test in a workspace.
        this.start = async (workspace) => this.http.post(routes.Initialize(workspace), {}, { metric: 'abtester-start' });
        // Get estimated AB Test duration.
        this.preview = async (significanceLevel) => this.http.get(routes.Preview(significanceLevel), { metric: 'abtester-preview' });
        // Get data about running AB Tests.
        this.status = async () => this.http.get(routes.Status(), { metric: 'abtester-status' });
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(ABTester, customContext, customOptions);
    }
}
exports.ABTester = ABTester;
