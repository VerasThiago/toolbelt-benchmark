"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const async_retry_1 = tslib_1.__importDefault(require("async-retry"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const ramda_1 = require("ramda");
const conf_1 = require("./conf");
const errors_1 = require("./errors");
const logger_1 = tslib_1.__importDefault(require("./logger"));
const TTL_SAVED_HOST_HOURS = 0;
const NOT_AVAILABLE = {
    hostname: undefined,
    score: -1000,
    stickyHint: undefined,
};
const AVAILABILITY_RETRY_OPTS = {
    retries: 2,
    minTimeout: 1000,
    factor: 2,
};
const withTimeout = (promise, timeout) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new errors_1.BuilderHubTimeoutError(`Timeout of ${timeout}ms exceeded`)), timeout);
        promise
            .then(res => {
            clearTimeout(timer);
            resolve(res);
        })
            .catch(err => {
            clearTimeout(timer);
            reject(err);
        });
    });
};
const mapAvailability = (appId, builder, timeout) => {
    return ramda_1.map(async (hintIdx) => {
        const getAvailabilityWithTimeout = () => {
            const availabilityP = builder.availability(appId, hintIdx);
            return withTimeout(availabilityP, timeout);
        };
        try {
            const response = (await async_retry_1.default(getAvailabilityWithTimeout, AVAILABILITY_RETRY_OPTS));
            const { host: stickyHint, hostname, score } = response;
            logger_1.default.debug(`Retrieved availability score ${score} from host ${hostname}`);
            return { hostname, score, stickyHint };
        }
        catch (e) {
            e.code === 'builder_hub_timeout'
                ? logger_1.default.debug(`Request to host at position ${hintIdx} timed out after ${timeout}ms`)
                : logger_1.default.debug(`Unable to retrieve availability from host at position ${hintIdx}`);
            return NOT_AVAILABLE;
        }
    });
};
const highestAvailability = ramda_1.reduce((acc, current) => {
    const { score: scoreAcc } = acc;
    const { score: scoreCurrent } = current;
    return scoreCurrent > scoreAcc ? current : acc;
}, NOT_AVAILABLE);
const getMostAvailableHost = async (appId, builder, nHosts, timeout) => {
    const hintsIdxArray = Array.from(new Array(nHosts), (_, idx) => idx);
    const getAvailability = mapAvailability(appId, builder, timeout);
    logger_1.default.debug(`Trying to retrieve builder-hub availability from ${nHosts} hosts`);
    const availabilityArray = await Promise.all(getAvailability(hintsIdxArray));
    const { hostname, score, stickyHint } = highestAvailability(availabilityArray);
    stickyHint
        ? logger_1.default.debug(`Selected host ${hostname} with availability score ${score}`)
        : logger_1.default.debug(`Unable to select host a priori, will use default options`);
    return stickyHint;
};
exports.getSavedOrMostAvailableHost = async (appId, builder, nHosts, timeout) => {
    const [appName] = appId.split('@');
    if (conf_1.hasStickyHost(appName)) {
        logger_1.default.debug(`Found sticky host saved locally`);
        const { stickyHost, lastUpdated } = conf_1.getStickyHost(appName);
        const timeElapsed = moment_1.default.duration(moment_1.default().diff(lastUpdated));
        if (timeElapsed.asHours() <= TTL_SAVED_HOST_HOURS) {
            return stickyHost;
        }
        logger_1.default.debug(`Saved sticky host has expired`);
    }
    logger_1.default.debug(`Finding a new sticky host`);
    const newStickyHost = await getMostAvailableHost(appId, builder, nHosts, timeout);
    if (newStickyHost) {
        conf_1.saveStickyHost(appName, newStickyHost);
    }
    return newStickyHost;
};
