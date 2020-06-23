"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../errors");
const logger_1 = tslib_1.__importStar(require("../logger"));
const sse_1 = require("../lib/sse");
const SessionManager_1 = require("../lib/session/SessionManager");
const allEvents = ['logs', 'build.status', 'receive.status'];
const onBuildEvent = (ctx, appOrKey, callback, senders) => {
    const unlistenLogs = sse_1.logAll(ctx, logger_1.fileLoggerLevel(), appOrKey, senders);
    const unlistenBuild = sse_1.onEvent(ctx, 'vtex.builder-hub', appOrKey, ['build.status'], message => callback('build.status', message));
    const unlistenReceive = sse_1.onEvent(ctx, 'vtex.builder-hub', appOrKey, ['receive.status'], message => callback('receive.status', message));
    const unlistenMap = {
        'build.status': unlistenBuild,
        'receive.status': unlistenReceive,
        logs: unlistenLogs,
    };
    return (...types) => {
        types.forEach(type => {
            unlistenMap[type]();
        });
    };
};
const runErrorAction = (code, message, errorActions) => {
    const action = errorActions[code];
    if (action) {
        action();
    }
    else {
        logger_1.default.error(`App build failed with message: ${message}`);
    }
};
const listen = (appOrKey, options = {}) => {
    const listenPromise = new Promise((resolve, reject) => {
        const { account, workspace } = SessionManager_1.SessionManager.getSingleton();
        const { waitCompletion, onError = {}, onBuild = false, context = { account, workspace }, senders = null } = options;
        const callback = (eventType, eventData) => {
            if (eventType === 'build.status') {
                const { body: { code, details, message }, } = eventData;
                if (code === 'success') {
                    if (waitCompletion) {
                        unlisten(...allEvents); // eslint-disable-line @typescript-eslint/no-use-before-define
                        resolve(() => undefined);
                    }
                    if (onBuild) {
                        onBuild();
                    }
                }
                if (code === 'fail') {
                    runErrorAction(details.errorCode, message, onError);
                    if (waitCompletion) {
                        unlisten(...allEvents); // eslint-disable-line @typescript-eslint/no-use-before-define
                        reject(new errors_1.BuildFailError(eventData));
                    }
                }
            }
            if (eventType === 'receive.status') {
                const transfered = parseFloat(eventData.body.bytesTransferred);
                const total = parseFloat(eventData.body.totalBytes);
                const percentage = Math.round((100 * transfered) / total);
                logger_1.default.info(`Sending files: ${percentage}% - ${(transfered / 1000000).toFixed(2)}MB/${(total / 1000000).toFixed(2)}MB`);
            }
        };
        const unlisten = onBuildEvent(context, appOrKey, callback, senders);
        const unlistenAll = () => unlisten(...allEvents);
        if (!waitCompletion) {
            resolve(unlistenAll);
        }
    });
    return listenPromise;
};
exports.listenBuild = async (appOrKey, triggerBuild, options = {}) => {
    const listenPromise = listen(appOrKey, options);
    const response = await triggerBuild();
    const unlisten = await listenPromise;
    return { response, unlisten };
};
