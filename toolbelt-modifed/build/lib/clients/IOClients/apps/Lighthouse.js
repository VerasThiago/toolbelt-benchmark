"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const querystring_1 = require("querystring");
const IOClientFactory_1 = require("../IOClientFactory");
class Lighthouse extends api_1.AppClient {
    constructor(ioContext, opts) {
        super('vtex.lighthouse@0.x', ioContext, {
            ...opts,
            timeout: Lighthouse.TIMEOUT_MS,
        });
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Lighthouse, customContext, customOptions);
    }
    /**
     * This request a Lightouse audit for a url. Lighthouse audit process runs on the current workspace
     *
     * @param url The url that lightouse must audit
     */
    runAudit(url) {
        return this.http.post('/_v/toolbelt/audit/url', { url });
    }
    /**
     * Returns a list of previous lighthouse reports stored on masterdata
     *
     * @param app App name to filter query results
     * @param url Url to filter query results
     */
    getReports(app, url) {
        const params = {
            ...(app ? { app } : null),
            ...(url ? { url } : null),
        };
        const path = `/_v/toolbelt/reports?${querystring_1.stringify(params)}`;
        return this.http.get(path);
    }
}
exports.Lighthouse = Lighthouse;
Lighthouse.TIMEOUT_MS = 60 * 1000;
