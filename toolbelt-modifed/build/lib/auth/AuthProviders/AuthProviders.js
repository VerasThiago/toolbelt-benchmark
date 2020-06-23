"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OAuthAuthenticator_1 = require("./OAuthAuthenticator");
class AuthProviders {
    static getAuthProviders() {
        return {
            [OAuthAuthenticator_1.OAuthAuthenticator.AUTH_TYPE]: new OAuthAuthenticator_1.OAuthAuthenticator(),
        };
    }
}
exports.AuthProviders = AuthProviders;
