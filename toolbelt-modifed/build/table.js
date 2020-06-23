"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_table_1 = tslib_1.__importDefault(require("cli-table"));
exports.createTable = (options = {}) => new cli_table_1.default({
    chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: '   ',
    },
    style: { 'padding-left': 0, 'padding-right': 0 },
    ...options,
});
