"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const is_docker_1 = tslib_1.__importDefault(require("is-docker"));
const is_wsl_1 = tslib_1.__importDefault(require("is-wsl"));
function getPlatform() {
    if (is_wsl_1.default) {
        return `${process.platform}:wsl`;
    }
    if (is_docker_1.default()) {
        return `${process.platform}:container`;
    }
    return process.platform;
}
exports.getPlatform = getPlatform;
