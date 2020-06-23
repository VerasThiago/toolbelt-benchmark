"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const AuthProviders_1 = require("../auth/AuthProviders");
const Token_1 = require("../auth/Token");
const ErrorKinds_1 = require("../error/ErrorKinds");
const ErrorReport_1 = require("../error/ErrorReport");
const SessionsPersister_1 = require("./SessionsPersister");
function isWorkspaceSwitchMaster(el) {
    return el.targetWorkspace === 'master';
}
class SessionManager {
    constructor({ sessionsPersister, authProviders }) {
        this.sessionPersister = sessionsPersister;
        this.authProviders = authProviders;
        this.state = {
            account: this.sessionPersister.getAccount(),
            lastAccount: this.sessionPersister.getLastAccount(),
            workspace: this.sessionPersister.getWorkspace(),
            lastWorkspace: this.sessionPersister.getLastWorkspace(),
            tokenObj: new Token_1.Token(this.sessionPersister.getToken()),
        };
    }
    static getSingleton() {
        if (SessionManager.singleton) {
            return SessionManager.singleton;
        }
        const sessionsPersister = SessionsPersister_1.SessionsPersister.getSingleton();
        const authProviders = AuthProviders_1.AuthProviders.getAuthProviders();
        SessionManager.singleton = new SessionManager({ sessionsPersister, authProviders });
        return SessionManager.singleton;
    }
    get account() {
        return this.state.account;
    }
    get token() {
        return this.state.tokenObj.token;
    }
    get tokenObj() {
        return this.state.tokenObj;
    }
    get workspace() {
        return this.state.workspace;
    }
    get userLogged() {
        return this.state.tokenObj.login;
    }
    get lastUsedAccount() {
        return this.state.lastAccount;
    }
    get lastUsedWorkspace() {
        return this.state.lastWorkspace;
    }
    checkAndGetToken(exitOnInvalid = false) {
        if (this.state.tokenObj.isValid()) {
            return this.state.tokenObj.token;
        }
        const errMsg = 'Auth token is invalid or expired.';
        if (exitOnInvalid) {
            logger_1.default.error(errMsg);
            process.exit(1);
        }
        throw ErrorReport_1.ErrorReport.create({
            kind: ErrorKinds_1.ErrorKinds.INVALID_OR_EXPIRED_TOKEN_ERROR,
            originalError: new Error(errMsg),
        });
    }
    async login(newAccount, { targetWorkspace = 'master', authMethod = 'oauth', useCachedToken = true, workspaceCreation }) {
        if (this.account !== newAccount) {
            this.state.lastAccount = this.account;
            this.state.lastWorkspace = null;
        }
        const cachedToken = new Token_1.Token(this.sessionPersister.getAccountToken(newAccount));
        if (useCachedToken && cachedToken.isValid()) {
            this.state.tokenObj = cachedToken;
        }
        else {
            // Tokens are scoped by workspace - logging into master will grant cacheability
            const { token } = await this.authProviders[authMethod].login(newAccount, 'master');
            this.state.tokenObj = new Token_1.Token(token);
            this.sessionPersister.saveAccountToken(newAccount, this.state.tokenObj.token);
        }
        this.state.account = newAccount;
        this.state.workspace = 'master';
        this.saveState();
        await this.workspaceSwitch({ targetWorkspace, workspaceCreation });
    }
    logout() {
        this.sessionPersister.clearData();
    }
    checkValidCredentials() {
        return this.tokenObj.isValid() && !!this.state.account && !!this.state.workspace;
    }
    async workspaceSwitch(input) {
        const { targetWorkspace } = input;
        if (this.state.workspace === targetWorkspace) {
            return 'not-changed';
        }
        let result;
        if (!isWorkspaceSwitchMaster(input)) {
            try {
                result = await input.workspaceCreation.creator({
                    targetWorkspace,
                    productionWorkspace: input.workspaceCreation.production,
                    promptCreation: input.workspaceCreation.promptCreation,
                    logIfAlreadyExists: false,
                    clientContext: {
                        account: this.account,
                        token: this.token,
                        workspace: this.workspace,
                    },
                });
            }
            catch (err) {
                input.workspaceCreation.onError(targetWorkspace, err);
                result = 'error';
            }
        }
        else {
            result = 'exists';
        }
        if (result === 'created' || result === 'exists') {
            this.state.lastWorkspace = this.state.workspace;
            this.state.workspace = targetWorkspace;
            this.saveWorkspaceData();
        }
        return result;
    }
    /* This should not be used - implement another login method instead */
    DEPRECATEDchangeAccount(account) {
        this.state.lastAccount = this.state.account;
        this.state.account = account;
        this.saveState();
    }
    /* This should not be used - implement another login method instead */
    DEPRECATEDchangeToken(token) {
        this.state.tokenObj = new Token_1.Token(token);
        this.saveState();
    }
    saveState() {
        this.saveAccountData();
        this.saveWorkspaceData();
        this.sessionPersister.saveLogin(this.state.tokenObj.login);
        this.sessionPersister.saveToken(this.state.tokenObj.token);
    }
    saveWorkspaceData() {
        this.sessionPersister.saveWorkspace(this.state.workspace);
        this.sessionPersister.saveLastWorkspace(this.state.lastWorkspace);
    }
    saveAccountData() {
        this.sessionPersister.saveAccount(this.state.account);
        this.sessionPersister.saveLastAccount(this.state.lastAccount);
    }
}
exports.SessionManager = SessionManager;
