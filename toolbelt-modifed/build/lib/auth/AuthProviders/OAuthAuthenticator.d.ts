import { AuthProviderBase } from './AuthProviderBase';
export declare class OAuthAuthenticator extends AuthProviderBase {
    static readonly AUTH_TYPE = "oauth";
    login(account: string, workspace: string): Promise<{
        login: string;
        token: string;
        returnUrl: string;
    }>;
    private closeChromeTabIfMac;
    private startUserAuth;
    private getOldLoginUrls;
    private getNewLoginUrls;
    private getLoginUrl;
}
