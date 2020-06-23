"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const errors_1 = require("../../../../errors");
const IOClientFactory_1 = require("../IOClientFactory");
class Billing extends api_1.AppClient {
    constructor(ioContext, opts) {
        super('vtex.billing@0.x', ioContext, opts);
        this.installApp = async (appName, termsOfUseAccepted, force) => {
            var _a, _b, _c;
            const graphQLQuery = `mutation InstallApps{
      install(appName:"${appName}", termsOfUseAccepted:${termsOfUseAccepted}, force:${force}) {
        code
        billingOptions
      }
    }`;
            const { data: { data, errors }, } = await this.http.postRaw(`/_v/graphql`, { query: graphQLQuery });
            if (errors) {
                if (errors.length === 1 && ((_c = (_b = (_a = errors[0].extensions) === null || _a === void 0 ? void 0 : _a.exception) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.data)) {
                    throw errors[0].extensions.exception.response.data;
                }
                throw new errors_1.GraphQlError(errors);
            }
            return data.install;
        };
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Billing, customContext, customOptions);
    }
}
exports.default = Billing;
