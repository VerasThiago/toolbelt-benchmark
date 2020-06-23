"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const IOClientFactory_1 = require("../IOClientFactory");
class Sponsor extends api_1.IOClient {
    constructor(context, options) {
        super(context, {
            ...options,
            authType: api_1.AuthType.bearer,
        });
        const { account, workspace } = context;
        this.account = account;
        this.workspace = workspace;
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Sponsor, customContext, customOptions);
    }
    async getSponsorAccount() {
        const res = await this.http.get(this.routes.getSponsorAccount, { metric: 'get-sponsor-account' });
        return res === null || res === void 0 ? void 0 : res.sponsorAccount;
    }
    getEdition() {
        return this.http.get(this.routes.getEdition, { metric: 'get-edition' });
    }
    setEdition(account, workspace, editionApp) {
        const [edition, version] = editionApp.split('@');
        const [sponsor, editionName] = edition.split('.');
        return this.http.post(this.routes.setEdition(account, workspace), { sponsor, edition: editionName, version }, { metric: 'set-edition' });
    }
    get routes() {
        return {
            getSponsorAccount: `https://platform.io.vtex.com/_account/${this.account}`,
            getEdition: `https://infra.io.vtex.com/apps/v0/${this.account}/${this.workspace}/edition`,
            setEdition: (account, workspace) => `https://app.io.vtex.com/vtex.tenant-provisioner/v0/${this.account}/master/tenants/${account}/migrate?tenantWorkspace=${workspace}`,
        };
    }
}
exports.Sponsor = Sponsor;
