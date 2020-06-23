interface SwitchOptions {
    showWelcomeMessage?: boolean;
    workspace?: string;
    gracefulAccountCheck?: boolean;
    initialPrompt?: {
        message: string;
    };
}
interface AccountReturnArgs {
    previousAccount: string;
    previousWorkspace: string;
    promptConfirmation?: boolean;
}
export declare const switchAccount: (account: string, options: SwitchOptions) => Promise<boolean>;
export declare function returnToPreviousAccount({ previousAccount, previousWorkspace, promptConfirmation, }: AccountReturnArgs): Promise<boolean>;
export {};
