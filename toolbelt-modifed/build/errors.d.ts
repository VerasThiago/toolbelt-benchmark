import ExtendableError from 'extendable-error';
export declare class CommandError extends ExtendableError {
    message: any;
    constructor(message?: string);
}
export declare class SSEConnectionError extends ExtendableError {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class BuildFailError extends ExtendableError {
    code: string;
    message: string;
    constructor(eventMessage: Message);
}
export declare class GraphQlError extends ExtendableError {
    constructor(errors: [any]);
}
export declare class BuilderHubTimeoutError extends ExtendableError {
    code: string;
    message: string;
    constructor(message: string);
}
