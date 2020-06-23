interface AppLogsEventSourceArgs {
    account: string;
    workspace: string;
    app: string;
    userLogged: string;
    showSeenLogs: boolean;
}
interface CreateDefaultArgs {
    app: string;
    showSeenLogs: boolean;
}
export declare class AppLogsEventSource {
    static SKIDDER_MAJOR: number;
    static createDefault({ app, showSeenLogs }: CreateDefaultArgs): AppLogsEventSource;
    private uri;
    private account;
    private app;
    private userAgent;
    constructor({ account, workspace, app, showSeenLogs, userLogged }: AppLogsEventSourceArgs);
    createLogEventSource(): void;
}
export {};
