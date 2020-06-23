export interface LoginResult {
    login: string;
    token: string;
}
export declare abstract class AuthProviderBase {
    abstract login(account: string, workspace: string): Promise<LoginResult>;
}
