import { ParseableError } from '@vtex/node-error-report/build/errorParsing';
interface EventSourceInfo {
    url: string;
    readyState: number;
    eventsCount: number;
    errorCount: number;
    pingEventsCount: number;
    restartCount: number;
    config: any;
}
export declare class EventSourceError extends Error implements ParseableError {
    event: any;
    eventSourceInfo: EventSourceInfo;
    constructor(event: any, eventSourceInfo: EventSourceInfo);
    getDetailsObject(): {
        event: any;
        eventSourceInfo: EventSourceInfo;
    };
}
export {};
