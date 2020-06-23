export declare const onEvent: (ctx: Context, sender: string, subject: string, keys: string[], callback: (message: Message) => void) => Unlisten;
export declare const logAll: (context: Context, logLevel: string, id: string, senders?: string[]) => Unlisten;
export declare const onAuth: (account: string, workspace: string, state: string, returnUrl: string) => Promise<[string, string]>;
