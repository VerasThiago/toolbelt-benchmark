import EventSource from 'eventsource';
import { EventSourceError } from './EventSourceError';
interface CustomEventSourceOptions {
    source: string;
    additionalHeaders?: Record<string, any>;
    closeOnInvalidToken?: boolean;
}
declare type OnMessageHandler = (data: any) => void;
declare type OnErrorHandler = (err: EventSourceError) => void;
declare type OnOpenHandler = () => void;
export declare class CustomEventSource {
    static create(opts: CustomEventSourceOptions): CustomEventSource;
    esOnError: OnErrorHandler;
    esOnMessage: OnMessageHandler;
    esOnOpen: OnOpenHandler;
    private configuration;
    private events;
    private eventSource;
    private isClosed;
    private nRetries;
    private pingStatus;
    private reconnectInterval;
    private source;
    private timerAfterNextPing;
    private timerBeforeNextPing;
    private restartCount;
    private errorCount;
    private pingEventsCount;
    constructor(source: string, configuration: EventSource.EventSourceInitDict);
    set onopen(newOnOpen: OnOpenHandler);
    set onmessage(newOnMessage: OnMessageHandler);
    set onerror(newOnError: OnErrorHandler);
    addEventListener(event: string, handler: any): void;
    close(): void;
    handleError(err: any): void;
    private createError;
    private addColossusPing;
    private addMethods;
    private checkPing;
    private clearTimers;
    private closeEventSource;
    private connectEventSource;
    private reconnect;
}
export {};
