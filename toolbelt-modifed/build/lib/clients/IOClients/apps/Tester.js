"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
class Tester extends api_1.AppClient {
    constructor(context, options) {
        super('vtex.tester-hub@0.x', context, options);
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Tester, customContext, {
            retries: Tester.DEFAULT_RETRIES,
            timeout: Tester.DEFAULT_TIMEOUT,
            ...customOptions,
        });
    }
    report(testId) {
        return this.http.get(`/_v/report/${testId}`, {
            cacheable: api_1.CacheType.None,
        });
    }
    test(options, appId = '') {
        return this.http.post(`/_v/test/${appId}`, options);
    }
}
exports.Tester = Tester;
Tester.DEFAULT_RETRIES = 1;
Tester.DEFAULT_TIMEOUT = 45000;
