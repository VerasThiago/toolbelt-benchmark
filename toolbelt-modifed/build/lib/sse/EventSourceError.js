"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventSourceError extends Error {
    constructor(event, eventSourceInfo) {
        super(`SSE error on endpoint ${eventSourceInfo.url}`);
        this.eventSourceInfo = eventSourceInfo;
        this.event = { ...event };
    }
    getDetailsObject() {
        return {
            event: this.event,
            eventSourceInfo: this.eventSourceInfo,
        };
    }
}
exports.EventSourceError = EventSourceError;
