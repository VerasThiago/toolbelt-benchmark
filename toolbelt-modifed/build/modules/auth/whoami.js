"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const greeting_1 = require("../../greeting");
const logger_1 = tslib_1.__importDefault(require("../../logger"));
exports.default = async () => {
    const lines = await greeting_1.greeting();
    lines.forEach((msg) => logger_1.default.info(msg));
};
