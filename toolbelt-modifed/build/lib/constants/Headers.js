"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Headers;
(function (Headers) {
    Headers["VTEX_ORIGINAL_CREDENTIAL"] = "x-vtex-original-credential";
    // If set to 'true' in the request, will hit the runtime-base server, instead of the app server.
    Headers["VTEX_RUNTIME_API"] = "x-vtex-runtime-api";
    // Specify a specific pod to receive the request
    Headers["VTEX_STICKY_HOST"] = "x-vtex-sticky-host";
    // Specify the target cluster for the request.
    // Works only on myvtexdev domain
    Headers["VTEX_UPSTREAM_TARGET"] = "x-vtex-upstream-target";
    // LinkID used by builder-hub to create logs/tracing correlation between all
    // relink/link operations related to a initial link
    Headers["VTEX_LINK_ID"] = "x-vtex-bh-link-id";
    // Header to ensure that the request trace will be sampled
    Headers["VTEX_TRACE"] = "jaeger-debug-id";
    // When the backend **IO App** decides to sample the trace of a request, this
    // header will be defined
    Headers["VTEX_TRACE_ID"] = "x-trace-id";
})(Headers = exports.Headers || (exports.Headers = {}));
