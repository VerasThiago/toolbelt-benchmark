"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const clipboardy_1 = tslib_1.__importDefault(require("clipboardy"));
exports.copyToClipboard = (str) => {
    if (process.platform === 'linux' && !process.env.DISPLAY) {
        // skip, probably running on a server
        return;
    }
    clipboardy_1.default.writeSync(str);
};
