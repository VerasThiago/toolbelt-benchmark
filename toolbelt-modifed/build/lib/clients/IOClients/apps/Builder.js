"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@vtex/api");
const Headers_1 = require("../../../constants/Headers");
const ErrorKinds_1 = require("../../../error/ErrorKinds");
const ErrorReport_1 = require("../../../error/ErrorReport");
const IOClientFactory_1 = require("../IOClientFactory");
const builderBaseRoute = `/_v/builder/0`;
const routes = {
    tsConfig: `${builderBaseRoute}/tsconfig`,
    typings: `${builderBaseRoute}/typings`,
    availability: (app) => `${routes.builder}/availability/${app}`,
    builder: builderBaseRoute,
    clean: (app) => `${routes.builder}/clean/${app}`,
    link: (app) => `${routes.builder}/link/${app}`,
    pinnedDependencies: () => `${routes.builder}/pinneddeps`,
    publish: (app) => `${routes.builder}/publish/${app}`,
    relink: (app) => `${routes.builder}/relink/${app}`,
    test: (app) => `${routes.builder}/test/${app}`,
};
class Builder extends api_1.AppClient {
    constructor(ioContext, opts) {
        super('vtex.builder-hub@0.x', ioContext, opts);
        this.hostChanges = 0;
        this.availability = async (app, hintIndex) => {
            const stickyHint = hintIndex === undefined || hintIndex === null
                ? `request:${this.context.account}:${this.context.workspace}:${app}`
                : `request:${this.context.account}:${this.context.workspace}:${app}:${hintIndex}`;
            const headers = {
                'Content-Type': 'application/json',
                [Headers_1.Headers.VTEX_STICKY_HOST]: stickyHint,
            };
            const metric = 'bh-availability';
            const { data: { availability }, headers: { [Headers_1.Headers.VTEX_STICKY_HOST]: host }, } = await this.http.getRaw(routes.availability(app), { headers, metric, cacheable: api_1.CacheType.None });
            const { hostname, score } = availability;
            return { host, hostname, score };
        };
        this.clean = (app) => {
            const headers = {
                'Content-Type': 'application/json',
                ...(this.stickyHost && { [Headers_1.Headers.VTEX_STICKY_HOST]: this.stickyHost }),
            };
            const metric = 'bh-clean';
            return this.http.post(routes.clean(app), { headers, metric });
        };
        this.getPinnedDependencies = () => {
            return this.http.get(routes.pinnedDependencies());
        };
        this.publishApp = (app, zipFile, stickyOptions = { sticky: true }, params = {}) => {
            return this.sendZipFile(routes.publish(app), app, zipFile, stickyOptions, params);
        };
        this.testApp = (app, zipFile, stickyOptions = { sticky: true }, params = {}) => {
            return this.sendZipFile(routes.test(app), app, zipFile, stickyOptions, params);
        };
        this.linkApp = (app, linkID, zipFile, stickyOptions = { sticky: true }, params = {}) => {
            return this.sendZipFile(routes.link(app), app, zipFile, stickyOptions, params, { [Headers_1.Headers.VTEX_LINK_ID]: linkID });
        };
        this.relinkApp = async (app, changes, linkID, params = {}) => {
            const headers = {
                ...(this.stickyHost && { [Headers_1.Headers.VTEX_STICKY_HOST]: this.stickyHost }),
                [Headers_1.Headers.VTEX_LINK_ID]: linkID,
                'Content-Type': 'application/json',
            };
            const metric = 'bh-relink';
            const putConfig = { url: routes.relink(app), method: 'put', data: changes, headers, metric, params };
            const { data, headers: { [Headers_1.Headers.VTEX_STICKY_HOST]: host, [Headers_1.Headers.VTEX_TRACE_ID]: traceID }, } = await this.http.request(putConfig);
            this.updateStickyHost(this.stickyHost, host, traceID);
            return data;
        };
        this.builderHubTsConfig = () => {
            return this.http.get(routes.tsConfig);
        };
        this.typingsInfo = async () => {
            const res = await this.http.get(routes.typings);
            return res.typingsInfo;
        };
        this.sendZipFile = async (route, app, zipFile, { tag, sticky, stickyHint } = {}, requestParams = {}, requestHeaders = {}) => {
            const hint = stickyHint || `request:${this.context.account}:${this.context.workspace}:${app}`;
            const metric = 'bh-zip-send';
            const params = tag ? { ...requestParams, tag } : requestParams;
            const stickyHostHeader = this.stickyHost || hint;
            const { data, headers: { [Headers_1.Headers.VTEX_STICKY_HOST]: host, [Headers_1.Headers.VTEX_TRACE_ID]: traceID }, } = await this.http.postRaw(route, zipFile, {
                headers: {
                    ...(sticky && { [Headers_1.Headers.VTEX_STICKY_HOST]: stickyHostHeader }),
                    ...requestHeaders,
                    'Content-length': zipFile.byteLength,
                    'Content-Type': 'application/octet-stream',
                },
                metric,
                params,
            });
            if (sticky) {
                this.updateStickyHost(stickyHostHeader, host, traceID);
            }
            return data;
        };
    }
    static createClient(customContext = {}, customOptions = {}) {
        return IOClientFactory_1.IOClientFactory.createClient(Builder, customContext, customOptions);
    }
    updateStickyHost(sentStickyHostHeader, responseStickyHostHeader, traceID) {
        if (!responseStickyHostHeader) {
            ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                kind: ErrorKinds_1.ErrorKinds.STICKY_HOST_ERROR,
                originalError: new Error('Missing sticky-host on builder-hub response'),
                details: { traceID, sentStickyHostHeader },
            });
        }
        else if (this.stickyHost && responseStickyHostHeader !== this.stickyHost) {
            this.hostChanges += 1;
            if (this.hostChanges >= Builder.TOO_MANY_HOST_CHANGES) {
                ErrorReport_1.ErrorReport.createAndMaybeRegisterOnTelemetry({
                    kind: ErrorKinds_1.ErrorKinds.STICKY_HOST_ERROR,
                    originalError: new Error(`Too many builder-hub host changes`),
                    details: {
                        traceID,
                        sentStickyHostHeader,
                        responseStickyHostHeader,
                        hostChanges: this.hostChanges,
                    },
                });
            }
        }
        this.stickyHost = responseStickyHostHeader;
    }
}
exports.Builder = Builder;
Builder.TOO_MANY_HOST_CHANGES = 3;
