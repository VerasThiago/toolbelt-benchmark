"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ramda_1 = require("ramda");
const env_1 = require("../../env");
const errors_1 = require("../../errors");
const locator_1 = require("../../locator");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const verbose_1 = require("../../verbose");
const ErrorKinds_1 = require("../error/ErrorKinds");
const ErrorReport_1 = require("../error/ErrorReport");
const CustomEventSource_1 = require("./CustomEventSource");
const levelAdapter = { warning: 'warn' };
const onOpen = (type) => () => logger_1.default.debug(`Connected to ${type} server`);
const onError = (type) => (err) => {
    logger_1.default.error(`Connection to ${type} server has failed with status ${err.event.status}`);
    ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
        kind: ErrorKinds_1.ErrorKinds.SSE_ERROR,
        originalError: err,
    }).logErrorForUser({ coreLogLevelDefault: 'debug', logLevels: { core: { errorId: 'error' } } });
};
const parseMessage = (msg) => {
    const { sender, subject, level, body } = JSON.parse(msg.data);
    return {
        body,
        level: levelAdapter[level] || level,
        sender,
        subject,
    };
};
const parseKeyToQueryParameter = (keys) => {
    let urlQueryParameters = '';
    ramda_1.forEach(key => {
        urlQueryParameters += `&keys=${key}`;
    }, keys);
    return urlQueryParameters;
};
const matchSubject = (msg, subject) => {
    return (msg.subject.startsWith(subject) ||
        (msg.subject.startsWith('-') && ramda_1.pathOr('', ['body', 'subject'], msg).startsWith(subject)));
};
const hasNoSubject = (msg) => {
    return msg.subject.startsWith('-') && !ramda_1.path(['body', 'subject'], msg);
};
const filterMessage = (subject, logAny = false, senders) => (msg) => {
    return ((matchSubject(msg, subject) || (logAny && hasNoSubject(msg))) &&
        (!senders || ramda_1.contains(locator_1.removeVersion(msg.sender), senders)) &&
        msg);
};
const maybeCall = (callback) => (msg) => {
    if (msg) {
        callback(msg);
    }
};
const onLog = (ctx, subject, logLevel, callback, senders) => {
    const source = `${env_1.colossusEndpoint()}/${ctx.account}/${ctx.workspace}/logs?level=${logLevel}`;
    const es = CustomEventSource_1.CustomEventSource.create({ source, closeOnInvalidToken: true });
    es.onopen = onOpen(`${logLevel} log`);
    es.onmessage = ramda_1.compose(maybeCall(callback), filterMessage(subject, true, senders), parseMessage);
    es.onerror = onError(`${logLevel} log`);
    return es.close.bind(es);
};
exports.onEvent = (ctx, sender, subject, keys, callback) => {
    const source = `${env_1.colossusEndpoint()}/${ctx.account}/${ctx.workspace}/events?onUnsubscribe=link_interrupted&sender=${sender}${parseKeyToQueryParameter(keys)}`;
    const es = CustomEventSource_1.CustomEventSource.create({ source, closeOnInvalidToken: true });
    es.onopen = onOpen('event');
    es.onmessage = ramda_1.compose(maybeCall(callback), filterMessage(subject), parseMessage);
    es.onerror = onError('event');
    return es.close.bind(es);
};
const filterAndMaybeLogVTEXLogs = (message) => {
    // Because stdout is buffered, __VTEX_IO_LOG objects might be interpolated with regular stdout messages.
    if (!message) {
        return '';
    }
    return (message
        .split('\n')
        .map((m) => {
        try {
            const obj = JSON.parse(m);
            if (obj.__VTEX_IO_LOG) {
                if (verbose_1.isVerbose) {
                    delete obj.__VTEX_IO_LOG;
                    console.log(chalk_1.default.dim('// The following object was logged to Splunk:'));
                    console.log(obj);
                }
                return '';
            }
            // Not a log object, just return original string
            return m;
        }
        catch (e) {
            // Not an object, just return original string
            return m;
        }
    })
        .filter(s => s !== '')
        // Undo split
        .join('\n'));
};
exports.logAll = (context, logLevel, id, senders) => {
    let previous = '';
    const callback = ({ sender, level, body: { message: rawMessage, code } }) => {
        if (!(rawMessage || code)) {
            return; // Ignore logs without message or code.
        }
        const message = filterAndMaybeLogVTEXLogs(rawMessage);
        if (!message) {
            return;
        }
        const suffix = sender.startsWith(id) ? '' : ` ${chalk_1.default.gray(sender)}`;
        const formatted = (message || code || '').replace(/\n\s*$/, '') + suffix;
        if (previous !== formatted) {
            previous = formatted;
            logger_1.default.log(level, formatted);
        }
    };
    return onLog(context, id, logLevel, callback, senders);
};
exports.onAuth = (account, workspace, state, returnUrl) => {
    const source = `https://${workspace}--${account}.${env_1.publicEndpoint()}/_v/private/auth-server/v1/sse/${state}`;
    logger_1.default.debug(`Listening for auth events from: ${source}`);
    const es = CustomEventSource_1.CustomEventSource.create({ source });
    return new Promise((resolve, reject) => {
        es.onmessage = (msg) => {
            const { body: token } = JSON.parse(msg.data);
            es.close();
            resolve([token, returnUrl]);
        };
        es.onerror = err => {
            es.close();
            const errMessage = `Connection to login server has failed${err.event.status ? ` with status ${err.event.status}` : ''}`;
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.SSE_ERROR,
                originalError: err,
            }).logErrorForUser({ coreLogLevelDefault: 'debug', logLevels: { core: { errorId: 'error' } } });
            reject(new errors_1.SSEConnectionError(errMessage, err.event.status));
        };
    });
};
