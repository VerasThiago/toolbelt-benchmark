"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const logger_1 = tslib_1.__importDefault(require("../../logger"));
const manifest_1 = require("../../manifest");
const setupTooling_1 = require("./setupTooling");
const setupTSConfig_1 = require("./setupTSConfig");
const setupTypings_1 = require("./setupTypings");
exports.default = async (opts) => {
    const all = opts.all || (!opts.tooling && !opts.typings && !opts.tsconfig);
    const tooling = opts.tooling || all;
    const typings = opts.typings || all;
    const tsconfig = opts.tsconfig || all;
    const ignoreLinked = opts.i || opts['ignore-linked'];
    if (ignoreLinked && !(all || typings)) {
        logger_1.default.error(chalk_1.default `The flag {bold --ignore-linked (-i)} can only be used when {bold --typings} or {bold --all} are also used`);
    }
    const manifest = await manifest_1.getManifest();
    if (tooling) {
        setupTooling_1.setupTooling(manifest);
    }
    if (tsconfig) {
        await setupTSConfig_1.setupTSConfig(manifest, opts.tsconfig);
    }
    if (typings) {
        await setupTypings_1.setupTypings(manifest, ignoreLinked);
    }
};
