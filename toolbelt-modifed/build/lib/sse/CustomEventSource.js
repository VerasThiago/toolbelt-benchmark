"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eventsource_1 = tslib_1.__importDefault(require("eventsource"));
const env_1 = require("../../env");
const user_agent_1 = tslib_1.__importDefault(require("../../user-agent"));
const Headers_1 = require("../constants/Headers");
const SessionManager_1 = require("../session/SessionManager");
const EventSourceError_1 = require("./EventSourceError");
const traceConfig_1 = require("../globalConfigs/traceConfig");
// Colossus ping is set at 45s
const COLOSSUS_PING = 45000;
const EPSILON = 5000;
const BEFORE_NEXT_PING = COLOSSUS_PING - EPSILON;
const AFTER_NEXT_PING = COLOSSUS_PING + EPSILON;
const CONNECTION_CLOSED = 2;
const DEFAULT_RECONNECT_INTERVAL = 1000;
const MAX_RETRIES = 3;
class CustomEventSource {
    constructor(source, configuration) {
        var _a;
        this.restartCount = 0;
        this.errorCount = 0;
        this.pingEventsCount = 0;
        this.source = source;
        this.configuration = configuration;
        this.events = [];
        this.eventSource = null;
        this.isClosed = false;
        this.nRetries = 0;
        this.pingStatus = {};
        this.checkPing = this.checkPing.bind(this);
        this.handleError = this.handleError.bind(this);
        this.reconnect = this.reconnect.bind(this);
        this.connectEventSource();
        this.addColossusPing();
        this.reconnectInterval = ((_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.reconnectInterval) || DEFAULT_RECONNECT_INTERVAL;
    }
    static create(opts) {
        const { source, closeOnInvalidToken = false, additionalHeaders = {} } = opts;
        const traceHeader = traceConfig_1.TraceConfig.shouldTrace() ? { [Headers_1.Headers.VTEX_TRACE]: traceConfig_1.TraceConfig.jaegerDebugID } : null;
        let token;
        if (closeOnInvalidToken) {
            token = SessionManager_1.SessionManager.getSingleton().checkAndGetToken(closeOnInvalidToken);
        }
        else {
            token = SessionManager_1.SessionManager.getSingleton().token;
        }
        return new CustomEventSource(source, {
            headers: {
                authorization: `bearer ${token}`,
                'user-agent': user_agent_1.default,
                ...(env_1.envCookies() ? { cookie: env_1.envCookies() } : null),
                ...(env_1.cluster() ? { [Headers_1.Headers.VTEX_UPSTREAM_TARGET]: env_1.cluster() } : null),
                ...additionalHeaders,
                ...traceHeader,
            },
        });
    }
    set onopen(newOnOpen) {
        this.esOnOpen = newOnOpen;
        this.esOnOpen = this.esOnOpen.bind(this);
        if (this.eventSource) {
            this.eventSource.onopen = this.esOnOpen;
        }
    }
    set onmessage(newOnMessage) {
        this.esOnMessage = newOnMessage;
        this.esOnMessage = this.esOnMessage.bind(this);
        if (this.eventSource) {
            this.eventSource.onmessage = this.esOnMessage;
        }
    }
    set onerror(newOnError) {
        this.esOnError = newOnError;
        this.esOnError = this.esOnError.bind(this);
        if (this.eventSource) {
            this.eventSource.onerror = this.handleError;
        }
    }
    addEventListener(event, handler) {
        this.events.push({ event, handler });
        if (this.eventSource) {
            this.eventSource.addEventListener(event, handler);
        }
    }
    close() {
        this.closeEventSource();
        this.clearTimers();
        this.isClosed = true;
    }
    handleError(err) {
        var _a;
        this.errorCount += 1;
        if (typeof this.esOnError === 'function') {
            this.esOnError(this.createError(err));
        }
        this.nRetries += 1;
        if (this.nRetries > MAX_RETRIES) {
            this.close();
        }
        if (!this.eventSource || ((_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.readyState) === CONNECTION_CLOSED) {
            setTimeout(this.reconnect, this.reconnectInterval);
        }
    }
    createError(err) {
        return new EventSourceError_1.EventSourceError(err, {
            readyState: this.eventSource.readyState,
            url: this.eventSource.url,
            eventsCount: this.eventSource._eventsCount,
            errorCount: this.errorCount,
            pingEventsCount: this.pingEventsCount,
            restartCount: this.restartCount,
            config: this.configuration,
        });
    }
    addColossusPing() {
        if (this.eventSource) {
            this.eventSource.addEventListener('ping', this.checkPing);
        }
    }
    addMethods() {
        if (!this.eventSource) {
            return;
        }
        this.eventSource.onmessage = this.esOnMessage;
        this.eventSource.onopen = this.esOnOpen;
        this.eventSource.onerror = this.handleError;
        this.events.forEach(({ event, handler }) => {
            this.eventSource.addEventListener(event, handler);
        });
    }
    checkPing() {
        this.pingEventsCount += 1;
        this.nRetries = 0;
        this.pingStatus = true;
        this.timerBeforeNextPing = setTimeout(() => {
            this.pingStatus = false;
        }, BEFORE_NEXT_PING);
        this.timerAfterNextPing = setTimeout(() => !this.pingStatus && this.reconnect(), AFTER_NEXT_PING);
    }
    clearTimers() {
        clearTimeout(this.timerBeforeNextPing);
        clearTimeout(this.timerAfterNextPing);
    }
    closeEventSource() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }
    connectEventSource() {
        this.closeEventSource();
        this.eventSource = new eventsource_1.default(this.source, this.configuration);
    }
    reconnect() {
        if (this.isClosed) {
            return;
        }
        this.restartCount += 1;
        this.connectEventSource();
        this.addColossusPing();
        this.addMethods();
    }
}
exports.CustomEventSource = CustomEventSource;
