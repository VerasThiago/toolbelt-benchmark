import { AuthProviderBase } from '../auth/AuthProviders';
import { Token } from '../auth/Token';
import { SessionsPersisterBase } from './SessionsPersister';
import { WorkspaceCreateResult, WorkspaceCreator } from './WorkspaceCreator';
interface WorkspaceCreation {
    production?: boolean;
    promptCreation: boolean;
    creator: WorkspaceCreator;
    onError: (targetWorkspace: string, err: Error | any) => void;
}
export interface LoginInput {
    targetWorkspace?: string;
    authMethod?: string;
    useCachedToken?: boolean;
    workspaceCreation: WorkspaceCreation;
}
export interface WorkspaceSwitchInput {
    targetWorkspace: string;
    workspaceCreation: WorkspaceCreation;
}
interface WorkspaceSwitchMasterInput {
    targetWorkspace: 'master';
}
export declare type WorkspaceSwitchResult = WorkspaceCreateResult | 'not-changed';
export interface ISessionManager {
    account: string;
    token: string;
    tokenObj: Token;
    workspace: string;
    userLogged: string;
    lastUsedAccount: string;
    lastUsedWorkspace: string;
    checkValidCredentials: () => boolean;
    checkAndGetToken: (exitOnInvalid?: boolean) => string;
    login: (newAccount: string, opts: LoginInput) => Promise<void>;
    logout: () => void;
    workspaceSwitch: (input: WorkspaceSwitchInput) => Promise<WorkspaceSwitchResult>;
}
interface SessionManagerArguments {
    sessionsPersister: SessionsPersisterBase;
    authProviders: Record<string, AuthProviderBase>;
}
export declare class SessionManager implements ISessionManager {
    private static singleton;
    static getSingleton(): SessionManager;
    private state;
    private sessionPersister;
    private authProviders;
    constructor({ sessionsPersister, authProviders }: SessionManagerArguments);
    get account(): string;
    get token(): string;
    get tokenObj(): Token;
    get workspace(): string;
    get userLogged(): any;
    get lastUsedAccount(): string;
    get lastUsedWorkspace(): string;
    checkAndGetToken(exitOnInvalid?: boolean): string;
    login(newAccount: string, { targetWorkspace, authMethod, useCachedToken, workspaceCreation }: LoginInput): Promise<void>;
    logout(): void;
    checkValidCredentials(): boolean;
    workspaceSwitch(input: WorkspaceSwitchInput | WorkspaceSwitchMasterInput): Promise<WorkspaceSwitchResult>;
    DEPRECATEDchangeAccount(account: string): void;
    DEPRECATEDchangeToken(token: string): void;
    private saveState;
    private saveWorkspaceData;
    private saveAccountData;
}
export {};
