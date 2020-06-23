"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const opn_1 = tslib_1.__importDefault(require("opn"));
const ramda_1 = tslib_1.__importDefault(require("ramda"));
const env_1 = require("../env");
const Headers_1 = require("../lib/constants/Headers");
const SessionManager_1 = require("../lib/session/SessionManager");
// Doesn't seem to work with 'import', seems to return undefined for some reason ¯\_(ツ)_/¯
const QRCode = require('qrcode-terminal'); // eslint-disable-line @typescript-eslint/no-var-requires
const isSupportRole = (role) => role === null || role === void 0 ? void 0 : role.startsWith('vtex.support-authority');
const isSupportSession = () => {
    const { token } = SessionManager_1.SessionManager.getSingleton();
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded || typeof decoded === 'string') {
        return false;
    }
    return ramda_1.default.any(role => isSupportRole(role), decoded.roles);
};
const prepareSupportBrowser = async (account, workspace) => {
    const { token } = SessionManager_1.SessionManager.getSingleton();
    const uri = `https://${workspace}--${account}.${env_1.publicEndpoint()}/_v/private/support-login/prepare`;
    const response = await axios_1.default.get(uri, {
        headers: {
            [Headers_1.Headers.VTEX_ORIGINAL_CREDENTIAL]: token,
        },
    });
    return response.data.oneTimeToken;
};
exports.default = async (endpointInput, { q, qr }) => {
    const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
    let endpoint = endpointInput !== null && endpointInput !== void 0 ? endpointInput : '';
    if (isSupportSession()) {
        const token = await prepareSupportBrowser(account, workspace);
        endpoint = `_v/private/support-login/login?token=${token}&returnUrl=/${endpoint}`;
    }
    const uri = `https://${workspace}--${account}${env_1.clusterIdDomainInfix()}.${env_1.publicEndpoint()}/${endpoint}`;
    if (q || qr) {
        QRCode.generate(uri, { small: true });
        return;
    }
    opn_1.default(uri, { wait: false });
};
