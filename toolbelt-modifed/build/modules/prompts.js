"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const prompts_1 = tslib_1.__importDefault(require("prompts"));
const enableTerminalCursor = () => {
    process.stdout.write('\x1B[?25h');
};
const onState = (state) => {
    if (state.aborted) {
        // If we don't re-enable the terminal cursor before exiting
        // the program, the cursor will remain hidden
        enableTerminalCursor();
        process.stdout.write('\n');
        process.exit(1);
    }
};
exports.promptConfirm = async (message, initial = true) => {
    const { response } = await prompts_1.default([{ message, initial, type: 'confirm', name: 'response', onState }]);
    return response;
};
