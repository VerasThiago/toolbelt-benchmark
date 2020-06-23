"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
const package_json_1 = require("../../../package.json");
const path_1 = require("path");
const Paths_1 = require("../constants/Paths");
class SessionsPersisterBase {
}
exports.SessionsPersisterBase = SessionsPersisterBase;
class SessionsPersister extends SessionsPersisterBase {
    constructor() {
        super();
        this.oldConfigstore = new configstore_1.default(package_json_1.name);
        this.tokenCacheStore = new configstore_1.default('', null, { configPath: SessionsPersister.TOKEN_CACHE_STORE_PATH });
        this.workspaceMetadataStore = new configstore_1.default('', null, {
            configPath: SessionsPersister.WORKSPACE_METADATA_STORE_PATH,
        });
        this.sessionStore = new configstore_1.default('', null, { configPath: SessionsPersister.SESSION_STORE_PATH });
    }
    static getSingleton() {
        return new SessionsPersister();
    }
    clearData() {
        this.oldConfigstore.clear();
        this.tokenCacheStore.clear();
        this.workspaceMetadataStore.clear();
        this.sessionStore.clear();
    }
    getAccount() {
        return this.sessionStore.get('account');
    }
    saveAccount(account) {
        this.oldConfigstore.set('account', account);
        this.sessionStore.set('account', account);
    }
    getLastAccount() {
        return this.sessionStore.get('lastAccount');
    }
    saveLastAccount(account) {
        this.oldConfigstore.set('_lastUsedAccount', account);
        this.sessionStore.set('lastAccount', account);
    }
    getWorkspace() {
        return this.workspaceMetadataStore.get('currentWorkspace');
    }
    saveWorkspace(workspace) {
        this.oldConfigstore.set('workspace', workspace);
        this.workspaceMetadataStore.set('currentWorkspace', workspace);
    }
    getLastWorkspace() {
        return this.workspaceMetadataStore.get('lastWorkspace');
    }
    saveLastWorkspace(workspace) {
        this.oldConfigstore.set('_lastUsedWorkspace', workspace);
        this.workspaceMetadataStore.set('lastWorkspace', workspace);
    }
    getToken() {
        return this.sessionStore.get('token');
    }
    saveToken(token) {
        this.oldConfigstore.set('token', token);
        this.sessionStore.set('token', token);
    }
    getLogin() {
        return this.sessionStore.get('login');
    }
    saveLogin(login) {
        this.oldConfigstore.set('login', login);
        this.sessionStore.set('login', login);
    }
    getAccountToken(account) {
        return this.tokenCacheStore.get(account);
    }
    saveAccountToken(account, token) {
        this.tokenCacheStore.set(account, token);
    }
}
exports.SessionsPersister = SessionsPersister;
SessionsPersister.SESSION_STORE_PATH = path_1.join(Paths_1.PathConstants.SESSION_FOLDER, 'session.json');
SessionsPersister.TOKEN_CACHE_STORE_PATH = path_1.join(Paths_1.PathConstants.SESSION_FOLDER, 'tokens.json');
SessionsPersister.WORKSPACE_METADATA_STORE_PATH = path_1.join(Paths_1.PathConstants.SESSION_FOLDER, 'workspace.json');
