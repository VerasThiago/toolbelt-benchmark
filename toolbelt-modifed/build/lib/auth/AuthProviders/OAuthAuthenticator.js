"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const opn_1 = tslib_1.__importDefault(require("opn"));
const path_1 = require("path");
const randomstring_1 = tslib_1.__importDefault(require("randomstring"));
const env_1 = require("../../../env");
const sse_1 = require("../../sse");
const spawnUnblockingChildProcess_1 = require("../../utils/spawnUnblockingChildProcess");
const AuthProviderBase_1 = require("./AuthProviderBase");
class OAuthAuthenticator extends AuthProviderBase_1.AuthProviderBase {
    async login(account, workspace) {
        const [token, returnUrl] = await this.startUserAuth(account, workspace);
        const decodedToken = jsonwebtoken_1.default.decode(token);
        const login = decodedToken.sub;
        this.closeChromeTabIfMac(returnUrl);
        return { login, token, returnUrl };
    }
    closeChromeTabIfMac(returnUrl) {
        if (process.platform === 'darwin') {
            spawnUnblockingChildProcess_1.spawnUnblockingChildProcess('osascript', [path_1.join(__dirname, '../../../../scripts/closeChrome.scpt'), returnUrl]);
        }
    }
    async startUserAuth(account, workspace) {
        const state = randomstring_1.default.generate();
        const [url, fullReturnUrl] = await this.getLoginUrl(account, workspace, state);
        opn_1.default(url, { wait: false });
        return sse_1.onAuth(account, workspace, state, fullReturnUrl);
    }
    getOldLoginUrls(workspace, state) {
        const returnUrl = `/_v/private/auth-server/v1/callback?workspace=${workspace}&state=${state}`;
        const url = `/_v/private/auth-server/v1/login/?workspace=${workspace}`;
        return [url, returnUrl];
    }
    getNewLoginUrls(workspace, state) {
        const returnUrl = `/_v/private/auth-server/v1/callback?workspace=${workspace}&state=${state}`;
        const url = `/_v/segment/admin-login/v1/login?workspace=${workspace}`;
        return [url, returnUrl];
    }
    async getLoginUrl(account, workspace, state) {
        const baseUrl = `https://${account}${env_1.clusterIdDomainInfix()}.${env_1.publicEndpoint()}`;
        let [url, returnUrl] = this.getNewLoginUrls(workspace, state);
        try {
            const response = await axios_1.default.get(`${baseUrl}${url}`);
            if (!response.data.match(/vtex\.admin-login/)) {
                throw new Error('Unexpected response from admin-login');
            }
        }
        catch (e) {
            const oldUrls = this.getOldLoginUrls(workspace, state);
            url = oldUrls[0];
            returnUrl = oldUrls[1];
        }
        const fullReturnUrl = baseUrl + returnUrl;
        const returnUrlEncoded = encodeURIComponent(returnUrl);
        return [`${baseUrl}${url}&returnUrl=${returnUrlEncoded}`, fullReturnUrl];
    }
}
exports.OAuthAuthenticator = OAuthAuthenticator;
OAuthAuthenticator.AUTH_TYPE = 'oauth';
