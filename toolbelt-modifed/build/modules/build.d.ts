interface ListeningOptions {
    context?: Context;
    waitCompletion?: boolean;
    onBuild?: AnyFunction;
    onError?: {
        [code: string]: AnyFunction;
    };
    senders?: string[];
}
declare type BuildTrigger<T> = () => Promise<T>;
interface ListenResponse<T> {
    response: T;
    unlisten: Unlisten;
}
declare type AnyFunction = (...args: any[]) => any;
export declare const listenBuild: <T = void>(appOrKey: string, triggerBuild: BuildTrigger<T>, options?: ListeningOptions) => Promise<ListenResponse<T>>;
export {};
