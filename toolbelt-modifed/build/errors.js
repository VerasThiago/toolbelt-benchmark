"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const extendable_error_1 = tslib_1.__importDefault(require("extendable-error"));
const ramda_1 = require("ramda");
const ramda_adjunct_1 = require("ramda-adjunct");
const joinErrorMessages = ramda_1.compose(ramda_1.join('\n'), ramda_1.map(ramda_1.prop('message')), ramda_1.reject(ramda_adjunct_1.isFunction));
class CommandError extends extendable_error_1.default {
    constructor(message = '') {
        super(message);
    }
}
exports.CommandError = CommandError;
class SSEConnectionError extends extendable_error_1.default {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.SSEConnectionError = SSEConnectionError;
class BuildFailError extends extendable_error_1.default {
    constructor(eventMessage) {
        const { message = 'Build fail', code = 'unknown' } = eventMessage.body || {};
        super(message);
        this.message = message;
        this.code = code;
    }
}
exports.BuildFailError = BuildFailError;
class GraphQlError extends extendable_error_1.default {
    constructor(errors) {
        const message = joinErrorMessages(errors);
        super(message);
    }
}
exports.GraphQlError = GraphQlError;
class BuilderHubTimeoutError extends extendable_error_1.default {
    constructor(message) {
        super(message);
        this.code = 'builder_hub_timeout';
        this.message = message;
    }
}
exports.BuilderHubTimeoutError = BuilderHubTimeoutError;
